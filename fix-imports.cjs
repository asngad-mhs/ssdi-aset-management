const fs = require('fs');
const files = [
  'src/pages/Dashboard.tsx',
  'src/pages/AssetList.tsx',
  'src/pages/AuditTrail.tsx',
  'src/pages/Reports.tsx',
  'src/pages/Settings.tsx',
  'src/components/layout/AppLayout.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replaceAll('../../store', '../store');
    content = content.replaceAll('../../components', '../components');
    content = content.replaceAll('../../lib', '../lib');
    fs.writeFileSync(file, content);
  }
});
console.log('Fixed imports.');
