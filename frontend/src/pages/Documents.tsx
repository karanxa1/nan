import { useEffect, useState } from 'react';
import { docAPI, caseAPI } from '@/api';
import { FileUp, Download, Loader2, Briefcase } from 'lucide-react';

export default function Documents() {
  const [cases, setCases] = useState<any[]>([]);
  const [selectedCase, setSelectedCase] = useState<number | null>(null);
  const [docs, setDocs] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    caseAPI.getMy().then(r => {
      setCases(r.data);
      if (r.data.length > 0) { setSelectedCase(r.data[0].id); loadDocs(r.data[0].id); }
    }).finally(() => setLoading(false));
  }, []);

  const loadDocs = (caseId: number) => {
    docAPI.getByCase(caseId).then(r => setDocs(r.data));
  };

  const handleCaseChange = (caseId: number) => {
    setSelectedCase(caseId);
    loadDocs(caseId);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !selectedCase) return;
    setUploading(true);
    try {
      await docAPI.upload(selectedCase, e.target.files[0]);
      loadDocs(selectedCase);
    } finally { setUploading(false); }
  };

  const handleDownload = async (docId: number, fileName: string) => {
    const res = await docAPI.download(docId);
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a'); a.href = url; a.download = fileName; a.click();
    URL.revokeObjectURL(url);
  };

  return (
      <main className="w-full flex-1">
        <div className="mb-4 md:mb-6 animate-fade-in">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground mt-1">Upload and manage case documents</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 size={28} className="animate-spin" style={{ color: '#d4a847' }} /></div>
        ) : cases.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center">
            <Briefcase size={48} className="mx-auto mb-4 text-muted-foreground opacity-40" />
            <p className="text-muted-foreground">No cases found. Documents are linked to cases.</p>
          </div>
        ) : (
          <div className="space-y-5 animate-fade-in">
            <div className="glass-card rounded-xl p-4">
              <label className="block text-xs text-muted-foreground mb-1.5">Select Case</label>
              <select value={selectedCase || ''} onChange={e => handleCaseChange(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-lg text-sm text-foreground bg-surface border border-border focus:outline-none focus:border-accent">
                {cases.map(c => <option key={c.id} value={c.id}>#{c.id} - {c.title}</option>)}
              </select>
            </div>

            <label className={`flex flex-col items-center justify-center p-10 rounded-xl border-2 border-dashed cursor-pointer transition-all
              ${uploading ? 'border-accent/50 bg-accent/5' : 'border-border hover:border-accent/40 hover:bg-muted'}`}>
              <input type="file" className="hidden" onChange={handleUpload} disabled={uploading || !selectedCase} />
              {uploading ? <Loader2 size={28} className="animate-spin mb-3" style={{ color: '#d4a847' }} /> : <FileUp size={28} className="mb-3 text-muted-foreground" />}
              <p className="font-medium text-foreground mb-1">{uploading ? 'Uploading...' : 'Upload Document'}</p>
              <p className="text-sm text-muted-foreground">Click to browse files</p>
            </label>

            {docs.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-sm font-medium text-muted-foreground">Uploaded Documents ({docs.length})</h2>
                {docs.map(doc => (
                  <div key={doc.id} className="glass rounded-lg p-4 flex items-center justify-between hover:border-accent/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center icon-box">
                        <FileUp size={14} style={{ color: '#d4a847' }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{doc.fileName}</p>
                        <p className="text-xs text-muted-foreground">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDownload(doc.id, doc.fileName)}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
                      style={{ background: 'rgba(212,168,71,0.15)', color: '#d4a847', border: '1px solid rgba(212,168,71,0.3)' }}>
                      <Download size={12} />Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
  );
}