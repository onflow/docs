import { visit } from 'unist-util-visit';
import fetch from 'node-fetch';

const VALUE_STARTS_WITH = '!from ';

const githubReplace = /^(https:\/\/)(www.)?github.com\/(.+)\/blob\/(.+)/;

const getUrl = (nodeValue) => {
  const url = nodeValue.replace(VALUE_STARTS_WITH, '').trim();

  return url.replace(githubReplace, '$1raw.githubusercontent.com/$3/$4');
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
            node.value = code;
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
