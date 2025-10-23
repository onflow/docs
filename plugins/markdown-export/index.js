const fs = require("fs");
const path = require("path");
const { globby } = require("globby");

module.exports = function markdownExportPlugin(context, options = {}) {
  const { siteDir, baseUrl } = context;
  const docsDir = options.docsDir ?? path.join(siteDir, "docs");
  const blogDir = options.blogDir ?? path.join(siteDir, "blog");
  const outDirRel = options.outDirRel ?? "md"; // build/md

  async function copyTree(srcDir, outDir) {
    if (!fs.existsSync(srcDir)) return;
    const mdPaths = await globby(["**/*.md", "**/*.mdx"], { cwd: srcDir });
    for (const rel of mdPaths) {
      const src = path.join(srcDir, rel);
      // Keep the original extension so MDX shortcodes remain intact
      const dest = path.join(outDir, outDirRel, rel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
    }
  }

  return {
    name: "markdown-export",
    async postBuild({ outDir, routes }) {
      // 1) Copy docs & blog source to build/md
      await copyTree(docsDir, outDir);
      await copyTree(blogDir, outDir);

      // 2) Emit a path map: HTML route -> Markdown URL (best effort)
      const map = {};
      for (const r of routes) {
        const p = r.path; // e.g. /docs/intro
        // naive mirror: /docs/foo -> /md/foo(.mdx|.md). We'll try .mdx first.
        if (p.startsWith(baseUrl + "docs")) {
          const rel = p.replace(baseUrl, "").replace(/^docs\/?/, "");
          map[p] = `${baseUrl}${outDirRel}/${rel.replace(/\/$/, "")}.mdx`;
        }
        if (p.startsWith(baseUrl + "blog")) {
          const rel = p.replace(baseUrl, "").replace(/^blog\/?/, "");
          map[p] = `${baseUrl}${outDirRel}/../blog/${rel.replace(/\/$/, "")}.mdx`;
        }
      }
      fs.mkdirSync(path.join(outDir, outDirRel), { recursive: true });
      fs.writeFileSync(
        path.join(outDir, outDirRel, "_index.json"),
        JSON.stringify(map, null, 2)
      );

      // 3) Emit a well-known manifest for LLM crawlers
      const llmsTxt =
        Object.entries(map)
          .map(([htmlUrl, mdUrl]) => `${htmlUrl} -> ${mdUrl}`)
          .join("\n") + "\n";
      const wellKnownDir = path.join(outDir, ".well-known");
      fs.mkdirSync(wellKnownDir, { recursive: true });
      fs.writeFileSync(path.join(wellKnownDir, "llms.txt"), llmsTxt);
    },
    injectHtmlTags() {
      return {
        headTags: [
          // Discovery hint that Markdown is available
          { tagName: "meta", attributes: { name: "llm:available-format", content: "text/markdown" } },
        ],
      };
    },
  };
};
