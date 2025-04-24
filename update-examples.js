const fs = require('fs');
const path = require('path');

// Directory containing example files
const examplesDir = path.join(__dirname, 'examples');

// Get all TypeScript files in the examples directory
const exampleFiles = fs.readdirSync(examplesDir)
  .filter(file => file.endsWith('.ts'));

console.log(`Found ${exampleFiles.length} example files to update.`);

// Process each file
exampleFiles.forEach(file => {
  const filePath = path.join(examplesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace OpenAIAgent with ForwardAgent
  const originalContent = content;
  content = content.replace(/OpenAIAgent/g, 'ForwardAgent');
  
  // Write the updated content back to the file
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}: Replaced OpenAIAgent with ForwardAgent`);
  } else {
    console.log(`No changes needed in ${file}`);
  }
});

console.log('All example files have been updated.');
