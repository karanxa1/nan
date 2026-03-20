import { useEffect, useState } from 'react';
import { caseAPI, firAPI } from '@/api';
import { Briefcase, Plus, Loader2, X, CheckCircle } from 'lucide-react';

const CASE_STATUS = ['OPEN', 'ACTIVE', 'CLOSED'];
const statusColor: Record<string, string> = { OPEN: 'status-open', ACTIVE: 'status-active', CLOSED: 'status-closed' };

export default function AdminCases() {
  const [cases, setCases] = useState<any[]>([]);
  const [firs, setFirs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', firId: '', assignedTo: '', status: 'OPEN' });
  const [submitting, setSubmitting] = useState(false);
  const [logModal, setLogModal] = useState<number | null>(null);
  const [logNote, setLogNote] = useState('');
  const [msg, setMsg] = useState('');

  const reload = () => Promise.all([caseAPI.getAll(), firAPI.getAll()])
    .then(([c, f]) => { setCases(c.data); setFirs(f.data); });

  useEffect(() => { reload().finally(() => setLoading(false)); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await caseAPI.create({ ...form, firId: Number(form.firId) });
      setShowForm(false);
      setForm({ title: '', firId: '', assignedTo: '', status: 'OPEN' });
      await reload();
      setMsg('Case created'); setTimeout(() => setMsg(''), 2000);
    } finally { setSubmitting(false); }
  };

  const updateStatus = async (id: number, status: string) => {
    await caseAPI.updateStatus(id, status);
    setCases(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const addLog = async () => {
    if (!logNote.trim() || !logModal) return;
    await caseAPI.addLog(logModal, logNote);
    setLogNote(''); setLogModal(null);
    setMsg('Log added'); setTimeout(() => setMsg(''), 2000);
  };

  return (
      <main className="w-full flex-1">
        <div className="flex items-center justify-between mb-4 md:mb-6 animate-fade-in">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Manage Cases</h1>
            <p className="text-muted-foreground mt-1">{cases.length} total cases</p>
          </div>
          <div className="flex items-center gap-3">
            {msg && <span className="text-sm text-green-400 flex items-center gap-1"><CheckCircle size={14} />{msg}</span>}
            <button onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: 'linear-gradient(135deg, #d4a847, #c49437)', color: '#0f172a' }}>
              <Plus size={16} />New Case
            </button>
          </div>
        </div>

        {showForm && (
          <div className="glass-card rounded-xl p-5 mb-4 md:mb-6 animate-fade-in">
            <h2 className="font-semibold text-foreground mb-4">Create New Case</h2>
            <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-muted-foreground mb-1">Case Title</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-foreground bg-input border border-border focus:outline-none focus:border-accent transition-all" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Linked FIR</label>
                <select value={form.firId} onChange={e => setForm(f => ({ ...f, firId: e.target.value }))} required
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-foreground bg-surface border border-border focus:outline-none focus:border-accent">
                  <option value="">Select FIR</option>
                  {firs.map(f => <option key={f.id} value={f.id}>#{f.id} - {f.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Assigned To</label>
                <input value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-foreground bg-input border border-border focus:outline-none focus:border-accent transition-all"
                  placeholder="Officer name (optional)" />
              </div>
              <div className="col-span-2 flex gap-3">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm border border-border text-muted-foreground hover:text-foreground transition-all">Cancel</button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #d4a847, #c49437)', color: '#0f172a' }}>
                  {submitting ? <><Loader2 size={14} className="animate-spin" />Creating...</> : 'Create Case'}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 size={28} className="animate-spin" style={{ color: '#d4a847' }} /></div>
        ) : (
          <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
            <div className="overflow-x-auto"><table className="min-w-[600px] w-full text-sm">
              <thead className="border-b border-border">
                <tr>{['ID', 'Title', 'FIR', 'Assigned To', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {cases.map(c => (
                  <tr key={c.id} className="border-b border-border table-row-hover">
                    <td className="px-4 py-3 text-muted-foreground">#{c.id}</td>
                    <td className="px-4 py-3 text-foreground font-medium">{c.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.firTitle || `#${c.firId}`}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.assignedTo || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[c.status] || ''}`}>{c.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select value={c.status} onChange={e => updateStatus(c.id, e.target.value)}
                          className="text-xs px-2 py-1 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:border-accent cursor-pointer">
                          {CASE_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <button onClick={() => setLogModal(c.id)}
                          className="text-xs px-2 py-1 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-accent transition-all">
                          + Log
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </div>
        )}

        {/* Log Modal */}
        {logModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="glass-card rounded-xl p-6 w-96 animate-fade-in" style={{ border: '1px solid rgba(212,168,71,0.3)' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Add Case Log</h3>
                <button onClick={() => setLogModal(null)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
              </div>
              <textarea value={logNote} onChange={e => setLogNote(e.target.value)} rows={4}
                className="w-full px-4 py-3 rounded-lg text-sm text-foreground bg-input border border-border focus:outline-none focus:border-accent transition-all resize-none mb-4"
                placeholder="Enter case log note..." />
              <div className="flex gap-3">
                <button onClick={() => setLogModal(null)} className="flex-1 py-2 rounded-lg text-sm border border-border text-muted-foreground hover:text-foreground transition-all">Cancel</button>
                <button onClick={addLog} className="flex-1 py-2 rounded-lg text-sm font-semibold" style={{ background: 'linear-gradient(135deg, #d4a847, #c49437)', color: '#0f172a' }}>Add Log</button>
              </div>
            </div>
          </div>
        )}
      </main>
  );
}