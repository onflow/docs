import { visit } from 'unist-util-visit';
import fetch from 'node-fetch';

const VALUE_STARTS_WITH = '!from ';

const githubReplace = /^(https:\/\/)(www.)?github.com\/(.+)\/blob\/(.+)/;

const getUrl = (nodeValue) => {
  const url = nodeValue.replace(VALUE_STARTS_WITH, '').trim();

  return url.replace(githubReplace, '$1raw.githubusercontent.com/$3/$4');
};

const getLines = (url) => {
  const lines = url.split('#')[1];
  if (!lines) {
    return null;
  }

  const [start, end] = lines
    .split('-')
    .map((line) => line.replace(/L(\d+)/, '$1'));

  return [start, end];
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

        const fetchPromise = fetch(url)
          .then((res) => {
            if (!res.ok) {
              throw new Error(
                `Failed to fetch code from ${url}: ${res.statusText}`,
              );
            }
            return res.text();
          })
          .then((code) => {
            if (lines) {
              const codeLines = code
                .split('\n')
                .slice(lines[0] - 1, lines[1])
                .join('\n');
              node.value = codeLines;
            } else {
              node.value = code;
            }
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
