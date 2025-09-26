#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Scanning for unused components in src directory...\n');

// Get all component files
function getAllFiles(dir, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
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

// Get component name from file
function getComponentName(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Look for default export
  const defaultExportMatch = content.match(/export\s+default\s+(\w+)/);
  if (defaultExportMatch) {
    return defaultExportMatch[1];
  }
  
  // Look for named exports
  const namedExportMatch = content.match(/export\s+(?:const|function|class)\s+(\w+)/);
  if (namedExportMatch) {
    return namedExportMatch[1];
  }
  
  // Look for export at the end
  const exportMatch = content.match(/export\s*{\s*(\w+)/);
  if (exportMatch) {
    return exportMatch[1];
  }
  
  return null;
}

// Check if component is used anywhere
function isComponentUsed(componentName, allFiles) {
  if (!componentName) return true; // Skip if we can't determine name
  
  for (const file of allFiles) {
    if (file.includes('node_modules')) continue;
    
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Skip the file itself
      if (content.includes(`export.*${componentName}`)) continue;
      
      // Check for imports
      if (content.includes(`import.*${componentName}`) || 
          content.includes(`from.*${componentName}`) ||
          content.includes(`<${componentName}`) ||
          content.includes(`${componentName}.`)) {
        return true;
      }
    } catch (err) {
      // Skip files that can't be read
    }
  }
  
  return false;
}

// Main scanning logic
const srcDir = path.join(__dirname, '..', 'src');
const allFiles = getAllFiles(srcDir);

console.log(`📁 Found ${allFiles.length} files in src directory\n`);

const unusedComponents = [];
const componentFiles = allFiles.filter(file => 
  file.includes('/components/') || 
  file.includes('/Components/') ||
  file.includes('/ui/design-system/')
);

console.log(`🎨 Found ${componentFiles.length} component files\n`);

for (const file of componentFiles) {
  const componentName = getComponentName(file);
  
  if (componentName && !isComponentUsed(componentName, allFiles)) {
    unusedComponents.push({
      file: path.relative(process.cwd(), file),
      component: componentName
    });
  }
}

// Display results
if (unusedComponents.length > 0) {
  console.log('❌ Potentially unused components:\n');
  unusedComponents.forEach(({ file, component }) => {
    console.log(`  📄 ${file}`);
    console.log(`     Component: ${component}\n`);
  });
} else {
  console.log('✅ No unused components found!');
}

console.log(`\n💡 Found ${unusedComponents.length} potentially unused components`);
console.log('⚠️  Please verify each component before deleting!');
