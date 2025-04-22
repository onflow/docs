/* eslint-disable */
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Ensure the static directory exists
const staticDir = path.join(__dirname, '..', 'static');
if (!fs.existsSync(staticDir)) {
  fs.mkdirSync(staticDir, { recursive: true });
}

// Create a directory for markdown files
const markdownDir = path.join(staticDir, 'markdown');
if (!fs.existsSync(markdownDir)) {
  fs.mkdirSync(markdownDir, { recursive: true });
}

// Find all markdown files
const files = glob.sync('./docs/**/*.md?(x)');
const llms = [];
const fullContent = [];

files.forEach((file) => {
  const content = fs.readFileSync(file, 'utf-8');
  const relativePath = path.relative('./docs', file);
  const fileDir = path.dirname(file);

  // Add to llms.txt (just the paths)
  llms.push(relativePath);

  // Add to llms-full.txt (full content with separators)
  fullContent.push(`\n=== ${relativePath} ===\n${content}`);

  // Create a markdown file for each page
  const markdownFileName = relativePath.replace(/\.mdx?$/, '.md');
  const markdownFilePath = path.join(markdownDir, markdownFileName);

  // Ensure the directory exists
  const markdownFileDir = path.dirname(markdownFilePath);
  if (!fs.existsSync(markdownFileDir)) {
    fs.mkdirSync(markdownFileDir, { recursive: true });
  }

  // Extract import statements to create a map of image variables to file paths
  const importMap = {};
  const importRegex = /import\s+(\w+)\s+from\s+['"](.+?)['"];?/g;
  let importMatch;
  while ((importMatch = importRegex.exec(content)) !== null) {
    const [_, varName, filePath] = importMatch;
    // Handle relative paths
    const fullPath =
      filePath.startsWith('./') || filePath.startsWith('../')
        ? path.relative(fileDir, path.resolve(fileDir, filePath))
        : filePath;
    importMap[varName] = fullPath;
  }

  // Process the content to handle common React/MDX components
  let processedContent = content
    // Convert import statements to comments
    .replace(
      /import\s+(.*?)\s+from\s+['"](.+?)['"];?/g,
      '<!-- Import: $1 from "$2" -->',
    )
    // Handle image components with src
    .replace(
      /<img\s+src=\{(.+?)\}\s+alt="(.+?)"\s+style=\{\{(.+?)\}\}\s*\/>/g,
      '![$2]($1)',
    )
    // Replace image variables with their file paths
    .replace(/!\[(.*?)\]\((\w+)\)/g, (match, alt, varName) => {
      return importMap[varName] ? `![${alt}](${importMap[varName]})` : match;
    })
    // Clean up multiple newlines
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Write the processed markdown file - directly as Markdown, not wrapped in HTML
  fs.writeFileSync(markdownFilePath, processedContent);
});

// Write the files
fs.writeFileSync(path.join(staticDir, 'llms.txt'), llms.join('\n'));
fs.writeFileSync(path.join(staticDir, 'llms-full.txt'), fullContent.join('\n'));

console.log('✅ Generated llms.txt, llms-full.txt, and markdown files');
