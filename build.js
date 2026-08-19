const fs = require('fs');
const path = require('path');

const filesToCopy = ['index.html', 'styles.css', 'script.js', 'favicon.svg'];
const targetDirs = ['dist', 'public'];

targetDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  filesToCopy.forEach(file => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join(dir, file));
    }
  });
});

console.log('Static site build complete: generated dist/ and public/ successfully.');
