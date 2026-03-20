const fs = require('fs');

const fixJSX = (filepath) => {
  if (!fs.existsSync(filepath)) return;
  
  let content = fs.readFileSync(filepath, 'utf8');

  // Strip broken import if still left
  content = content.replace(/import { Sidebar } from '@\/components\/Sidebar';\n/g, '');

  const openDivs = (content.match(/<div/g) || []).length;
  const closeDivs = (content.match(/<\/div>/g) || []).length;
  const missingDivs = openDivs - closeDivs;

  if (missingDivs > 0) {
     const replacement = '</main>\n' + '    </div>\n'.repeat(missingDivs) + '  );\n}';
     content = content.replace(/<\/main>(\s*)\);(\s*)}/g, replacement);
     
     // Form fallback
     const fReplace = '</form>\n' + '    </div>\n'.repeat(missingDivs) + '  );\n}';
     content = content.replace(/<\/form>(\s*)\);(\s*)}/g, fReplace);
  }
  
  fs.writeFileSync(filepath, content);
};

const components = [
  'src/pages/CaseDetail.tsx',
  'src/pages/Documents.tsx',
  'src/pages/FIRDetail.tsx',
  'src/pages/FIRForm.tsx',
  'src/pages/LegalDetail.tsx',
  'src/pages/LegalSearch.tsx',
  'src/pages/MyCases.tsx',
  'src/pages/MyFIRs.tsx',
  'src/pages/admin/AdminCases.tsx',
  'src/pages/admin/AdminFIRs.tsx',
  'src/pages/admin/AdminLegal.tsx',
  'src/pages/admin/AdminNotifications.tsx',
  'src/pages/admin/AdminPanel.tsx',
  'src/pages/admin/AdminReports.tsx',
  'src/pages/admin/AdminUsers.tsx'
];

components.forEach(fixJSX);
console.log('Fixed tags');
