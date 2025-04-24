const fs = require('fs');
const path = require('path');

// Directory containing source files
const srcDir = path.join(__dirname, 'src');

// Function to process files in a directory recursively
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      // Recursively process subdirectories
      processDirectory(filePath);
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      // Process TypeScript files (excluding declaration files)
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Replace OpenAIAgent with ForwardAgent
      const originalContent = content;
      content = content.replace(/OpenAIAgent/g, 'ForwardAgent');
      content = content.replace(/@helse\/agentic-writing/g, '@dem1989/forward');
      
      // Write the updated content back to the file
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${path.relative(__dirname, filePath)}`);
      }
    }
  });
}

// Start processing from the src directory
console.log('Updating source files...');
processDirectory(srcDir);
console.log('All source files have been updated.');
