import { visit } from 'unist-util-visit';
import fetch from 'node-fetch';

const VALUE_STARTS_WITH = '!from ';

const githubReplace = /^(https:\/\/)(www.)?github.com\/(.+)\/blob\/(.+)/;

const getUrl = (nodeValue) => {
  const url = nodeValue.replace(VALUE_STARTS_WITH, '').trim();

  return url.replace(githubReplace, '$1raw.githubusercontent.com/$3/$4');
};

/**
 * try parse int
 * @param {string} strNumber
 * @returns number | null
 */
const tryParseInt = (strNumber) => {
  try {
    const number = parseInt(strNumber);
    if (isNaN(number)) {
      return null;
    }
    return number;
  } catch (e) {
    console.error(e);
    return null;
  }
};

/**
 * get start line and end line for a snippet from a url
 * @param {string} url provided url
 * @returns {null | [string, string]}
 */
export const getLines = (url) => {
  const lines = url.split('#')[1];
  if (lines == null || lines === '') {
    return null;
  }
  if (lines.match(/^L\d+$/) == null && lines.match(/^L\d+-L\d+$/) == null) {
    return null;
  }

  const [start, end] = lines
    .split('-')
    .map((line) => line.replace(/L(\d+)/, '$1'));

  const startNum = tryParseInt(start);
  const endNum = tryParseInt(end);

  return [startNum, endNum ?? startNum];
};

export const getSnippetName = (url) => {
  const snippet = url.split('#')[1];
  if (snippet == null || snippet === '') {
    return null;
  }
  if (snippet.match(/^L\d+$/) != null || snippet.match(/^L\d+-L\d+$/) != null) {
    return null;
  }
  return snippet;
};

export const getCodeSnippet = ({ code, lines, snippetName }) => {
  if (lines != null) {
    const codeLines = code
      .split('\n')
      .slice(lines[0] - 1, lines[1])
      .join('\n');
    return codeLines;
  }
  /**
   * based on https://github.com/search?q=%22%5BSTART+snippet_name%5D%22&type=code
   */
  if (snippetName != null) {
    /** @type [string] */
    const codeArray = code.split('\n');
    const snippetStart = `[START ${snippetName}]`;
    const snippetEnd = `[END ${snippetName}]`;
    let startLine = null;
    let endLine = null;

    for (let i = 0; i < codeArray.length; i++) {
      const line = codeArray[i];
      if (line.includes(snippetStart)) {
        startLine = i + 1;
        break;
      }
    }
    for (let i = 0; i < codeArray.length; i++) {
      const line = codeArray[i];

      if (line.includes(snippetEnd)) {
        endLine = i;
        break;
      }
    }
    if (startLine != null && endLine != null) {
      const codeLines = codeArray.slice(startLine, endLine).join('\n');
      return codeLines;
    }
    return code;
  }
  return code;
};

const plugin = () => {
  const transformer = async (ast) => {
    const promises = [];
    visit(ast, 'code', (node) => {
      if (node.value?.startsWith(VALUE_STARTS_WITH)) {
        const url = getUrl(node.value);
        if (!url) {
          return;
        }

        const lines = getLines(url);
        const snippetName = getSnippetName(url);

        const fetchPromise = fetch(url)
          .then(async (res) => {
            if (!res.ok) {
              throw new Error(
                `Failed to fetch code from ${url}: ${res.statusText}`,
              );
            }
            return await res.text();
          })
          .then((code) => {
            node.value = getCodeSnippet({ code, lines, snippetName });
          })
          .catch((err) => {
            console.error(err);
            node.value = `Error fetching code: ${err.message}`;
          });

        promises.push(fetchPromise);
      }
    });

    await Promise.all(promises);
  };
  return transformer;
};

export default plugin;
