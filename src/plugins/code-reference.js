const { visit } = require('unist-util-visit');
const { default: fetch } = require('node-fetch');
const fs = require('fs/promises');
const path = require('path');

const VALUE_STARTS_WITH = '!from ';

const githubReplace = /^(https:\/\/)(www.)?github.com\/(.+)\/blob\/(.+)/;

/**
 *
 * @param {string} nodeValue
 * @returns string
 */
function getUrl(nodeValue) {
  const url = nodeValue.replace(VALUE_STARTS_WITH, '').trim();
  return url.replace(githubReplace, '$1raw.githubusercontent.com/$3/$4');
}

/**
 * try parse int
 * @param {string} strNumber
 * @returns number | null
 */
function tryParseInt(strNumber) {
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
}

/**
 * get start line and end line for a snippet from a url
 * @param {string} url provided url
 * @returns {null | [number, number]}
 */
function getLines(url) {
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
}

function getSnippetName(url) {
  const snippet = url.split('#')[1];
  if (snippet == null || snippet === '') {
    return null;
  }
  if (snippet.match(/^L\d+$/) != null || snippet.match(/^L\d+-L\d+$/) != null) {
    return null;
  }
  return snippet;
}

/**
 *
 * @param {object} params
 * @param {string} params.code
 * @param {[number, number] | null} params.lines
 * @param {string | null} params.snippetName
 * @returns {string}
 */
function getCodeSnippet({ code, lines, snippetName }) {
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
    if (startLine == null) {
      throw Error(`Nonexistent snippet: ${snippetName}`);
    }
    if (endLine == null) {
      throw Error(`Unclosed snippet: ${snippetName}`);
    }

    const codeLines = codeArray.slice(startLine, endLine).join('\n');
    return codeLines;
  }
  return code;
}

/**
 *
 * @param {string} url
 * @param {{ lines: [number, number] | null, snippetName: string | null }} from
 * @returns {Promise<string>}
 */
async function fetchSnippet(url, { lines, snippetName }) {
  const codeResponse = await fetch(url);
  if (!codeResponse.ok) {
    throw new Error(
      `Failed to fetch code from ${url}: ${codeResponse.statusText}`,
    );
  }
  const code = await codeResponse.text();
  const snippet = getCodeSnippet({ code, lines, snippetName });

  return snippet;
}

/**
 *
 * @param {string} url
 * @param {string} snippet
 *
 * @returns {Promise<boolean>}
 */
async function verifySnippet(url, snippet) {
  const fileName = encodeURIComponent(url);
  const filePath = path.resolve(`./src/plugins/snippets/${fileName}`);
  let fileContent;
  try {
    const file = await fs.readFile(filePath);
    fileContent = file.toString();
  } catch (e) {
    if (e.code !== 'ENOENT') {
      return false;
    }
    await fs.writeFile(filePath, snippet);
    return true;
  }
  if (fileContent !== snippet) {
    return false;
  }
  return true;
}

function plugin() {
  const transformer = async (ast) => {
    const promises = [];
    visit(ast, 'code', (node) => {
      if (node.value?.startsWith(VALUE_STARTS_WITH)) {
        const url = getUrl(node.value);
        if (!url || typeof url !== 'string') {
          return;
        }

        const lines = getLines(url);
        const snippetName = getSnippetName(url);

        const parseSnippetPromise = (async () => {
          try {
            const snippet = await fetchSnippet(url, {
              lines,
              snippetName,
            });
            if (lines != null || snippetName != null) {
              const isVerifiedSnippet = await verifySnippet(url, snippet);
              if (!isVerifiedSnippet) {
                throw new Error(
                  `Snippet has changed for URL ${url}. Fix the reference or check the source.`,
                );
              }
            }
            node.value = snippet;
          } catch (error) {
            // Log the error for debugging
            console.error(
              `Error processing snippet from ${url}:`,
              error.message,
            );
            // Re-throw the error to propagate it
            throw error;
          }
        })();

        promises.push(parseSnippetPromise);
      }
    });

    const results = await Promise.allSettled(promises);
    const errors = results
      .filter(({ status }) => status === 'rejected')
      .map(({ reason }) => reason);

    if (errors.length > 0) {
      // Aggregate error messages
      const errorMessage = errors.map((err) => err.message).join('\n');
      // Throw a new error with all the messages
      throw new Error(`Snippet parsing errors:\n${errorMessage}`);
    }
  };

  return transformer;
}

module.exports = {
  getLines,
  getSnippetName,
  getCodeSnippet,
  fetchSnippet,
  verifySnippet,
  plugin,
};
