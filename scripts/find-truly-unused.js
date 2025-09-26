#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Scanning for truly unused components in src directory...\n');

// Get all files recursively
function getAllFiles(dir, extensions = ['.tsx', '.ts', '.jsx', '.js', '.mdx', '.md']) {
  const files = [];
  
  function traverse(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.git')) {
          traverse(fullPath);
        } else if (stat.isFile()) {
          const ext = path.extname(item);
          if (extensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    } catch (err) {
      // Skip directories we can't read
    }
  }
  
  traverse(dir);
  return files;
}

// Check if a file is imported/used anywhere
function isFileUsed(filePath, allFiles) {
  const relativePath = path.relative(process.cwd(), filePath);
  const fileName = path.basename(filePath, path.extname(filePath));
  const dirName = path.dirname(relativePath);
  
  for (const file of allFiles) {
    if (file === filePath) continue; // Skip self
    
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for direct imports
      if (content.includes(`from '${relativePath}'`) ||
          content.includes(`from "${relativePath}"`) ||
          content.includes(`from '@site/${relativePath}'`) ||
          content.includes(`from "@site/${relativePath}"`) ||
          content.includes(`from './${fileName}'`) ||
          content.includes(`from "./${fileName}"`) ||
          content.includes(`from '../${fileName}'`) ||
          content.includes(`from "../${fileName}"`)) {
        return true;
      }
      
      // Check for require statements
      if (content.includes(`require('${relativePath}')`) ||
          content.includes(`require("${relativePath}")`)) {
        return true;
      }
      
      // Check for dynamic imports
      if (content.includes(`import('${relativePath}')`) ||
          content.includes(`import("${relativePath}")`)) {
        return true;
      }
      
    } catch (err) {
      // Skip files that can't be read
    }
  }
  
  return false;
}

// Check if it's a Storybook file (usually safe to remove)
function isStorybookFile(filePath) {
  return filePath.includes('.stories.') || filePath.includes('.story.');
}

// Check if it's a test file
function isTestFile(filePath) {
  return filePath.includes('.test.') || filePath.includes('.spec.') || filePath.includes('__tests__');
}

// Check if it's a config file that might be used by build tools
function isConfigFile(filePath) {
  const configPatterns = [
    'docusaurus.config',
    'tailwind.config',
    'next.config',
    'webpack.config',
    'babel.config',
    'jest.config',
    'tsconfig',
    'eslint.config'
  ];
  
  return configPatterns.some(pattern => filePath.includes(pattern));
}

// Main scanning logic
const srcDir = path.join(__dirname, '..', 'src');
const allFiles = getAllFiles(srcDir);

console.log(`📁 Found ${allFiles.length} files in src directory\n`);

const unusedFiles = [];
const componentFiles = allFiles.filter(file => 
  (file.includes('/components/') || 
   file.includes('/Components/') ||
   file.includes('/ui/design-system/')) &&
  !isConfigFile(file)
);

console.log(`🎨 Found ${componentFiles.length} component files\n`);

for (const file of componentFiles) {
  if (!isFileUsed(file, allFiles)) {
    const fileType = isStorybookFile(file) ? '📚 Storybook' : 
                    isTestFile(file) ? '🧪 Test' : 
                    '📄 Component';
    
    unusedFiles.push({
      file: path.relative(process.cwd(), file),
      type: fileType
    });
  }
}

// Display results
if (unusedFiles.length > 0) {
  console.log('❌ Potentially unused files:\n');
  
  // Group by type
  const storybookFiles = unusedFiles.filter(f => f.type === '📚 Storybook');
  const testFiles = unusedFiles.filter(f => f.type === '🧪 Test');
  const componentFiles = unusedFiles.filter(f => f.type === '📄 Component');
  
  if (storybookFiles.length > 0) {
    console.log('📚 Storybook files (usually safe to remove):');
    storybookFiles.forEach(({ file }) => {
      console.log(`  - ${file}`);
    });
    console.log('');
  }
  
  if (testFiles.length > 0) {
    console.log('🧪 Test files (usually safe to remove):');
    testFiles.forEach(({ file }) => {
      console.log(`  - ${file}`);
    });
    console.log('');
  }
  
  if (componentFiles.length > 0) {
    console.log('📄 Component files (verify before removing):');
    componentFiles.forEach(({ file }) => {
      console.log(`  - ${file}`);
    });
    console.log('');
  }
  
} else {
  console.log('✅ No unused files found!');
}

console.log(`\n💡 Found ${unusedFiles.length} potentially unused files`);
console.log('⚠️  Please verify each file before deleting!');
