const fs = require('fs');

const files = [
  '/Users/macbook/nan/frontend/src/pages/CaseDetail.tsx',
  '/Users/macbook/nan/frontend/src/pages/Documents.tsx',
  '/Users/macbook/nan/frontend/src/pages/FIRDetail.tsx',
  '/Users/macbook/nan/frontend/src/pages/FIRForm.tsx',
  '/Users/macbook/nan/frontend/src/pages/LegalDetail.tsx',
  '/Users/macbook/nan/frontend/src/pages/LegalSearch.tsx',
  '/Users/macbook/nan/frontend/src/pages/MyCases.tsx',
  '/Users/macbook/nan/frontend/src/pages/MyFIRs.tsx',
  '/Users/macbook/nan/frontend/src/pages/admin/AdminCases.tsx',
  '/Users/macbook/nan/frontend/src/pages/admin/AdminFIRs.tsx',
  '/Users/macbook/nan/frontend/src/pages/admin/AdminLegal.tsx',
  '/Users/macbook/nan/frontend/src/pages/admin/AdminNotifications.tsx',
  '/Users/macbook/nan/frontend/src/pages/admin/AdminPanel.tsx',
  '/Users/macbook/nan/frontend/src/pages/admin/AdminReports.tsx',
  '/Users/macbook/nan/frontend/src/pages/admin/AdminUsers.tsx',
  '/Users/macbook/nan/frontend/src/components/Sidebar.tsx'
];

const replacements = [
  { search: "text-white", replace: "text-foreground" },
  { search: "text-slate-400", replace: "text-muted-foreground" },
  { search: "text-slate-500", replace: "text-muted-foreground" },
  { search: "text-slate-300", replace: "text-foreground" },
  { search: "bg-slate-900/50", replace: "bg-card/50" },
  { search: "bg-slate-800/60", replace: "bg-muted/80" },
  { search: "bg-slate-800/30", replace: "bg-muted/50" },
  { search: "bg-slate-800", replace: "bg-muted" },
  { search: "border-white/10", replace: "border-border" },
  { search: "border-white/5", replace: "border-border" },
  { search: "border-slate-700", replace: "border-border" },
  { search: "bg-white/5", replace: "bg-input" },
  { search: "bg-white/3", replace: "bg-muted" },
  { search: "hover:bg-white/5", replace: "hover:bg-accent hover:text-accent-foreground" },
  { search: "hover:bg-white/3", replace: "hover:bg-muted" },
  { search: "border-border/50", replace: "border-border" },
  { search: "text-gray-400", replace: "text-muted-foreground" },
  { search: "text-gray-500", replace: "text-muted-foreground" },
  { search: "text-gray-300", replace: "text-foreground" },
  { search: "bg-[#0f172a]", replace: "bg-background" }
];

let filesModified = 0;

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    replacements.forEach(({ search, replace }) => {
      content = content.split(search).join(replace);
    });

    if (content !== original) {
      fs.writeFileSync(file, content);
      console.log('Updated ' + file.split('frontend/src/')[1]);
      filesModified++;
    }
  }
});

console.log('Modified ' + filesModified + ' files.');
