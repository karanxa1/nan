import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { caseAPI, docAPI } from '@/api';
import { Loader2, Briefcase, FileUp, ClipboardList, Clock } from 'lucide-react';

const statusColor: Record<string, string> = {
  OPEN: 'status-open', ACTIVE: 'status-active', CLOSED: 'status-closed',
};

export default function CaseDetail() {
  const { id } = useParams();
  const [caseData, setCaseData] = useState<any>(null);
  const [docs, setDocs] = useState<any[]>([]);
  const [tab, setTab] = useState<'overview' | 'logs' | 'documents'>('overview');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    Promise.all([caseAPI.getById(Number(id)), docAPI.getByCase(Number(id))])
      .then(([c, d]) => { setCaseData(c.data); setDocs(d.data); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    try {
      await docAPI.upload(Number(id), e.target.files[0]);
      const d = await docAPI.getByCase(Number(id));
      setDocs(d.data);
    } finally { setUploading(false); }
  };

  const handleDownload = async (docId: number, fileName: string) => {
    const res = await docAPI.download(docId);
    const url = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = url; a.download = fileName; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return (
      <main className="w-full flex-1 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin" style={{ color: '#d4a847' }} />
      </main>
  );

  return (
      <main className="w-full flex-1">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="glass-card rounded-xl p-5 mb-5 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center icon-box">
                  <Briefcase size={22} style={{ color: '#d4a847' }} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">{caseData.title}</h1>
                  <p className="text-sm text-muted-foreground">FIR: {caseData.firTitle}</p>
                </div>
              </div>
              <span className={`text-sm px-3 py-1 rounded-full ${statusColor[caseData.status] || ''}`}>{caseData.status}</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-5 p-1 rounded-lg bg-input w-fit">
            {(['overview', 'logs', 'documents'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize
                  ${tab === t ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                style={tab === t ? { background: '#1e2a4a', color: '#d4a847' } : {}}>
                {t}
              </button>
            ))}
          </div>

          {tab === 'overview' && (
            <div className="glass-card rounded-xl p-5 animate-fade-in space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  ['Assigned To', caseData.assignedTo || 'Unassigned'],
                  ['Created', new Date(caseData.createdAt).toLocaleDateString()],
                  ['Last Updated', new Date(caseData.updatedAt).toLocaleDateString()],
                  ['FIR ID', `#${caseData.firId}`],
                ].map(([label, val]) => (
                  <div key={label} className="p-3 rounded-lg bg-input">
                    <p className="text-xs text-muted-foreground mb-1">{label}</p>
                    <p className="text-sm text-foreground">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'logs' && (
            <div className="space-y-3 animate-fade-in">
              {caseData.logs?.length === 0 ? (
                <div className="glass-card rounded-xl p-10 text-center">
                  <ClipboardList size={40} className="mx-auto mb-3 text-muted-foreground opacity-40" />
                  <p className="text-muted-foreground">No logs yet</p>
                </div>
              ) : caseData.logs?.map((log: any, i: number) => (
                <div key={log.id} className="glass-card rounded-xl p-4 flex gap-4 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="w-2 mt-1.5 flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full" style={{ background: '#d4a847' }} />
                    {i < (caseData.logs.length - 1) && <div className="w-px flex-1 mt-1" style={{ background: 'rgba(212,168,71,0.3)' }} />}
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{log.note}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Clock size={10} />{new Date(log.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'documents' && (
            <div className="space-y-3 animate-fade-in">
              <label className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all
                ${uploading ? 'border-accent/50 bg-accent/5' : 'border-border hover:border-accent/40 hover:bg-muted'}`}>
                <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
                {uploading ? <Loader2 size={24} className="animate-spin mb-2" style={{ color: '#d4a847' }} /> : <FileUp size={24} className="mb-2 text-muted-foreground" />}
                <p className="text-sm text-muted-foreground">{uploading ? 'Uploading...' : 'Click to upload document'}</p>
              </label>
              {docs.map(doc => (
                <div key={doc.id} className="glass rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{doc.fileName}</p>
                    <p className="text-xs text-muted-foreground">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => handleDownload(doc.id, doc.fileName)}
                    className="text-xs px-3 py-1.5 rounded-lg transition-all"
                    style={{ background: 'rgba(212,168,71,0.15)', color: '#d4a847', border: '1px solid rgba(212,168,71,0.3)' }}>
                    Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
  );
}