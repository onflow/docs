const fs = require('fs');
const path = require('path');

interface FileStats {
    filePath: string;
    wordCount: number;
}

function countWordsInFile(filePath: string): number {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Remove code blocks
        const withoutCodeBlocks = content.replace(/```[\s\S]*?```/g, '');
        
        // Remove inline code
        const withoutInlineCode = withoutCodeBlocks.replace(/`.*?`/g, '');
        
        // Remove URLs
        const withoutUrls = withoutInlineCode.replace(
            /https?:\/\/(?:[\w-]|\.|[^\s])+/g,
            ''
        );
        
        // Split into words and count
        const words = withoutUrls.match(/\w+/g);
        return words ? words.length : 0;
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
        return 0;
    }
}

function findMarkdownFiles(dir: string): FileStats[] {
    const results: FileStats[] = [];
    
    function traverse(currentDir: string) {
        const files = fs.readdirSync(currentDir);
        
        for (const file of files) {
            const fullPath = path.join(currentDir, file);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory() && !file.startsWith('.')) {
                traverse(fullPath);
            } else if (
                stat.isFile() &&
                (file.toLowerCase().endsWith('.md') || file.toLowerCase().endsWith('.markdown'))
            ) {
                const wordCount = countWordsInFile(fullPath);
                results.push({
                    filePath: fullPath,
                    wordCount
                });
            }
        }
    }
    
    traverse(dir);
    return results;
}

function main() {
    const startDir = '.';
    const files = findMarkdownFiles(startDir);
    
    if (files.length === 0) {
        console.log('No markdown files found.');
        return;
    }
    
    // Print individual file counts
    files.forEach(({ filePath, wordCount }) => {
        console.log(`${filePath}: ${wordCount} words`);
    });
    
    // Calculate and print statistics
    const totalWords = files.reduce((sum, file) => sum + file.wordCount, 0);
    const averageWords = totalWords / files.length;
    
    console.log('\nSummary:');
    console.log(`Total files: ${files.length}`);
    console.log(`Total words: ${totalWords}`);
    console.log(`Average words per file: ${averageWords.toFixed(2)}`);
}

main(); 