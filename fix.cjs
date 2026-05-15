const fs = require('fs');
const files = [
  'src/store/useAppStore.ts',
  'src/pages/Dashboard.tsx',
  'src/pages/AssetList.tsx',
  'src/pages/Reports.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\\`/g, '\`');
  content = content.replace(/\\\$/g, '$');
  fs.writeFileSync(file, content);
});
console.log('Fixed.');
