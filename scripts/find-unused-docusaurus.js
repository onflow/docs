#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Scanning for unused Docusaurus configuration and components...\n');

// 1. Check for unused theme components
console.log('🎨 Checking for unused theme components...');

const themeDir = path.join(__dirname, '..', 'src', 'theme');
const themeFiles = [];

function getThemeFiles(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getThemeFiles(fullPath);
    } else if (stat.isFile() && (item.endsWith('.js') || item.endsWith('.jsx') || item.endsWith('.ts') || item.endsWith('.tsx'))) {
      themeFiles.push(fullPath);
    }
  }
}

if (fs.existsSync(themeDir)) {
  getThemeFiles(themeDir);
  
  const unusedThemeFiles = [];
  
  for (const file of themeFiles) {
    const relativePath = path.relative(process.cwd(), file);
    const fileName = path.basename(file, path.extname(file));
    
    // Skip index files and main theme files
    if (fileName === 'index' || fileName === 'Layout' || fileName === 'Root') {
      continue;
    }
    
    // Check if this theme component is referenced in docusaurus.config.js
    try {
      const configContent = fs.readFileSync(path.join(__dirname, '..', 'docusaurus.config.js'), 'utf8');
      if (configContent.includes(relativePath) || configContent.includes(fileName)) {
        continue;
      }
    } catch (error) {
      // Ignore config read errors
    }
    
    // Check if it's imported anywhere
    try {
      const grepResult = execSync(`grep -r "${relativePath}" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null || true`, { encoding: 'utf8' });
      if (!grepResult.trim()) {
        unusedThemeFiles.push(relativePath);
      }
    } catch (error) {
      // Ignore grep errors
    }
  }
  
  if (unusedThemeFiles.length > 0) {
    console.log('❌ Potentially unused theme components:');
    unusedThemeFiles.forEach(file => console.log(`  - ${file}`));
  } else {
    console.log('✅ No obviously unused theme components found');
  }
} else {
  console.log('⚠️  Theme directory not found');
}

console.log('\n');

// 2. Check for unused plugins
console.log('🔌 Checking for unused plugins...');

try {
  const configContent = fs.readFileSync(path.join(__dirname, '..', 'docusaurus.config.js'), 'utf8');
  
  // Extract plugin names
  const pluginMatches = configContent.match(/require\(['"]([^'"]+)['"]\)/g);
  const plugins = [];
  
  if (pluginMatches) {
    pluginMatches.forEach(match => {
      const pluginPath = match.match(/require\(['"]([^'"]+)['"]\)/)[1];
      if (pluginPath.includes('plugin') || pluginPath.includes('theme')) {
        plugins.push(pluginPath);
      }
    });
  }
  
  console.log('📋 Found plugins:');
  plugins.forEach(plugin => console.log(`  - ${plugin}`));
  
} catch (error) {
  console.log('⚠️  Could not read docusaurus.config.js');
}

console.log('\n');

// 3. Check for unused static assets
console.log('🖼️  Checking for unused static assets...');

const staticDir = path.join(__dirname, '..', 'static');
const publicDir = path.join(__dirname, '..', 'public');

const staticFiles = [];

function getStaticFiles(dir) {
  if (!fs.existsSync(dir)) return;
  
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getStaticFiles(fullPath);
    } else if (stat.isFile()) {
      staticFiles.push(fullPath);
    }
  }
}

getStaticFiles(staticDir);
getStaticFiles(publicDir);

const unusedStaticFiles = [];

for (const file of staticFiles) {
  const relativePath = path.relative(process.cwd(), file);
  const fileName = path.basename(file);
  
  // Skip common files that are always used
  if (fileName === 'favicon.ico' || fileName === 'robots.txt' || fileName === 'sitemap.xml') {
    continue;
  }
  
  // Check if file is referenced anywhere
  try {
    const grepResult = execSync(`grep -r "${fileName}" src/ docs/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.mdx" --include="*.css" 2>/dev/null || true`, { encoding: 'utf8' });
    if (!grepResult.trim()) {
      unusedStaticFiles.push(relativePath);
    }
  } catch (error) {
    // Ignore grep errors
  }
}

if (unusedStaticFiles.length > 0) {
  console.log('❌ Potentially unused static files:');
  unusedStaticFiles.forEach(file => console.log(`  - ${file}`));
} else {
  console.log('✅ No obviously unused static files found');
}

console.log('\n');

// 4. Check for unused data files
console.log('📊 Checking for unused data files...');

const dataDir = path.join(__dirname, '..', 'src', 'data');
const dataFiles = [];

if (fs.existsSync(dataDir)) {
  function getDataFiles(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        getDataFiles(fullPath);
      } else if (stat.isFile()) {
        dataFiles.push(fullPath);
      }
    }
  }
  
  getDataFiles(dataDir);
  
  const unusedDataFiles = [];
  
  for (const file of dataFiles) {
    const relativePath = path.relative(process.cwd(), file);
    const fileName = path.basename(file, path.extname(file));
    
    // Check if file is imported anywhere
    try {
      const grepResult = execSync(`grep -r "${relativePath}" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null || true`, { encoding: 'utf8' });
      if (!grepResult.trim()) {
        unusedDataFiles.push(relativePath);
      }
    } catch (error) {
      // Ignore grep errors
    }
  }
  
  if (unusedDataFiles.length > 0) {
    console.log('❌ Potentially unused data files:');
    unusedDataFiles.forEach(file => console.log(`  - ${file}`));
  } else {
    console.log('✅ No obviously unused data files found');
  }
} else {
  console.log('⚠️  Data directory not found');
}

console.log('\n✨ Docusaurus-specific scan complete!');
