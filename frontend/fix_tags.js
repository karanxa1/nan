const fs = require('fs');

const files = [
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

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Clean up any weird sed leftovers
  content = content.replace(/className=" flex-1/g, 'className="w-full flex-1');
  
  // The missing closing tags issue happens at the end of the return statement
  // We matched `</div>\n  );\n}` and it got deleted.
  // We can just add `</div>` to the end if it's not well balanced.
  
  const openCount = (content.match(/<div/g) || []).length;
  const closeCount = (content.match(/<\/div>/g) || []).length;
  
  if (openCount > closeCount) {
    const diff = openCount - closeCount;
    // Replace the ending tag
    const endReg = /<\/main>(\s*)\);/g;
    
    if (endReg.test(content)) {
       let injection = '</main>\n';
       for(let i=0; i<diff; i++) { injection += '    </div>\n'; }
       content = content.replace(/<\/main>(\s*)\);/g, injection + '$1);');
    }
  }

  // Same process for <form>
  const openF = (content.match(/<form/g) || []).length;
  const closeF = (content.match(/<\/form>/g) || []).length;
  if(openF > closeF) {
     content = content.replace(/<\/div>(\s*)\);/g, '  </form>\n</div>$1);');
  }
  
  fs.writeFileSync(file, content);
}
console.log('Fixed pages');
