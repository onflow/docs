#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Scanning for unused files and components...\n');

// 1. Check for unused dependencies
console.log('📦 Checking for unused dependencies...');
try {
  const depcheckOutput = execSync('npx depcheck --json', { encoding: 'utf8' });
  const depcheck = JSON.parse(depcheckOutput);
  
  if (depcheck.dependencies && depcheck.dependencies.length > 0) {
    console.log('❌ Unused dependencies:');
    depcheck.dependencies.forEach(dep => console.log(`  - ${dep}`));
  } else {
    console.log('✅ No unused dependencies found');
  }
  
  if (depcheck.devDependencies && depcheck.devDependencies.length > 0) {
    console.log('❌ Unused dev dependencies:');
    depcheck.devDependencies.forEach(dep => console.log(`  - ${dep}`));
  } else {
    console.log('✅ No unused dev dependencies found');
  }
} catch (error) {
  console.log('⚠️  Could not run depcheck:', error.message);
}

console.log('\n');

// 2. Find potentially unused files
console.log('📁 Scanning for potentially unused files...');

const srcDir = path.join(__dirname, '..', 'src');
const docsDir = path.join(__dirname, '..', 'docs');

function getAllFiles(dir, extensions = ['.ts', '.tsx', '.js', '.jsx', '.mdx']) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  traverse(dir);
  return files;
}

const allFiles = getAllFiles(srcDir).concat(getAllFiles(docsDir));

// 3. Check for files that might be unused
const potentiallyUnused = [];

for (const file of allFiles) {
  const relativePath = path.relative(process.cwd(), file);
  const fileName = path.basename(file, path.extname(file));
  
  // Skip certain files
  if (
    fileName.includes('index') ||
    fileName.includes('App') ||
    fileName.includes('Layout') ||
    fileName.includes('theme') ||
    fileName.includes('config') ||
    relativePath.includes('node_modules') ||
    relativePath.includes('.docusaurus')
  ) {
    continue;
  }
  
  // Check if file is imported anywhere
  const searchPatterns = [
    `from ['"]${relativePath.replace(/\\/g, '/')}['"]`,
    `from ['"]\\./${fileName}['"]`,
    `from ['"]\\.\\./${fileName}['"]`,
    `import.*${fileName}`,
    `require\\(['"]${relativePath.replace(/\\/g, '/')}['"]\\)`,
    `require\\(['"]\\./${fileName}['"]\\)`,
    `require\\(['"]\\.\\./${fileName}['"]\\)`,
  ];
  
  let isUsed = false;
  
  for (const searchPattern of searchPatterns) {
    try {
      const grepResult = execSync(`grep -r "${searchPattern}" src/ docs/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.mdx" 2>/dev/null || true`, { encoding: 'utf8' });
      if (grepResult.trim()) {
        isUsed = true;
        break;
      }
    } catch (error) {
      // Ignore grep errors
    }
  }
  
  if (!isUsed) {
    potentiallyUnused.push(relativePath);
  }
}

if (potentiallyUnused.length > 0) {
  console.log('❌ Potentially unused files:');
  potentiallyUnused.forEach(file => console.log(`  - ${file}`));
} else {
  console.log('✅ No obviously unused files found');
}

console.log('\n');

// 4. Check for unused exports
console.log('📤 Checking for unused exports...');

const unusedExports = [];

for (const file of allFiles) {
  if (!file.includes('src/') || !file.endsWith('.ts') && !file.endsWith('.tsx')) {
    continue;
  }
  
  try {
    const content = fs.readFileSync(file, 'utf8');
    const exportMatches = content.match(/export\s+(?:const|function|class|interface|type|enum)\s+(\w+)/g);
    
    if (exportMatches) {
      for (const match of exportMatches) {
        const exportName = match.match(/export\s+(?:const|function|class|interface|type|enum)\s+(\w+)/)[1];
        const relativePath = path.relative(process.cwd(), file);
        
        // Check if this export is used elsewhere
        const searchPatterns = [
          `import.*{.*${exportName}.*}.*from`,
          `import\\s+${exportName}\\s+from`,
          `from\\s+['"]${relativePath.replace(/\\/g, '/')}['"]`,
        ];
        
        let isUsed = false;
        
        for (const searchPattern of searchPatterns) {
          try {
            const grepResult = execSync(`grep -r "${searchPattern}" src/ docs/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.mdx" 2>/dev/null || true`, { encoding: 'utf8' });
            if (grepResult.trim()) {
              isUsed = true;
              break;
            }
          } catch (error) {
            // Ignore grep errors
          }
        }
        
        if (!isUsed) {
          unusedExports.push(`${relativePath}:${exportName}`);
        }
      }
    }
  } catch (error) {
    // Ignore file read errors
  }
}

if (unusedExports.length > 0) {
  console.log('❌ Potentially unused exports:');
  unusedExports.forEach(exportInfo => console.log(`  - ${exportInfo}`));
} else {
  console.log('✅ No obviously unused exports found');
}

console.log('\n');

// 5. Check for unused CSS classes
console.log('🎨 Checking for unused CSS classes...');

const cssFiles = getAllFiles(srcDir, ['.css']).concat(getAllFiles(path.join(__dirname, '..'), ['.css']));
const allCssClasses = new Set();

// Extract CSS classes
for (const cssFile of cssFiles) {
  try {
    const content = fs.readFileSync(cssFile, 'utf8');
    const classMatches = content.match(/\.([a-zA-Z0-9_-]+)/g);
    if (classMatches) {
      classMatches.forEach(match => {
        const className = match.substring(1);
        if (className.length > 2) { // Skip very short class names
          allCssClasses.add(className);
        }
      });
    }
  } catch (error) {
    // Ignore file read errors
  }
}

const unusedCssClasses = [];

for (const className of allCssClasses) {
  try {
    const grepResult = execSync(`grep -r "class.*${className}" src/ docs/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.mdx" 2>/dev/null || true`, { encoding: 'utf8' });
    if (!grepResult.trim()) {
      unusedCssClasses.push(className);
    }
  } catch (error) {
    // Ignore grep errors
  }
}

if (unusedCssClasses.length > 0) {
  console.log('❌ Potentially unused CSS classes:');
  unusedCssClasses.slice(0, 20).forEach(className => console.log(`  - .${className}`));
  if (unusedCssClasses.length > 20) {
    console.log(`  ... and ${unusedCssClasses.length - 20} more`);
  }
} else {
  console.log('✅ No obviously unused CSS classes found');
}

console.log('\n✨ Scan complete!');
console.log('\n💡 Tips:');
console.log('  - Review each item carefully before deleting');
console.log('  - Some files might be used by build tools or plugins');
console.log('  - Check if files are referenced in configuration files');
console.log('  - Consider using TypeScript strict mode to catch more unused code');
