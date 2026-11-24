const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

const missing = [];
const allRefs = [];

htmlFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const regex = /(?:src|href)=["']([^"']+)["']/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const raw = match[1].trim();
    if (!raw || /^(https?:|mailto:|tel:|data:|javascript:|#)/i.test(raw)) {
      continue;
    }
    const clean = raw.split('#')[0].split('?')[0].replace(/^\//, '');
    if (!clean) continue;
    const targetPath = path.join(rootDir, clean);
    allRefs.push({ file, raw, targetPath });
    if (!fs.existsSync(targetPath)) {
      missing.push({ file, raw, clean });
    }
  }
});

console.log(`Total HTML files scanned: ${htmlFiles.length}`);
console.log(`Total local references checked: ${allRefs.length}`);
console.log(`Missing references found: ${missing.length}`);
missing.forEach(m => {
  console.log(`[MISSING] in ${m.file}: "${m.raw}" -> resolved as "${m.clean}"`);
});
