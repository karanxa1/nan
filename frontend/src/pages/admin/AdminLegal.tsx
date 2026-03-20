import { useEffect, useState } from 'react';
import { legalAPI } from '@/api';
import { Scale, Plus, Loader2, X, CheckCircle, Shield, ShieldOff } from 'lucide-react';

const ACT_TYPES = ['IPC', 'CRPC'];
const empty = { code: '', title: '', description: '', actType: 'IPC', isBailable: false };

export default function AdminLegal() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...empty });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const reload = () => legalAPI.getAll().then(r => setSections(r.data));

  useEffect(() => { reload().finally(() => setLoading(false)); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await legalAPI.create(form);
      setForm({ ...empty });
      setShowForm(false);
      await reload();
      setMsg('Section created'); setTimeout(() => setMsg(''), 2000);
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    await legalAPI.delete(id);
    setSections(prev => prev.filter(s => s.id !== id));
    setMsg('Deleted'); setTimeout(() => setMsg(''), 2000);
  };

  return (
      <main className="w-full flex-1">
        <div className="flex items-center justify-between mb-4 md:mb-6 animate-fade-in">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Manage Legal Sections</h1>
            <p className="text-muted-foreground mt-1">{sections.length} sections in database</p>
          </div>
          <div className="flex items-center gap-3">
            {msg && <span className="text-sm text-green-400 flex items-center gap-1"><CheckCircle size={14} />{msg}</span>}
            <button onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: 'linear-gradient(135deg, #d4a847, #c49437)', color: '#0f172a' }}>
              <Plus size={16} />Add Section
            </button>
          </div>
        </div>

        {showForm && (
          <div className="glass-card rounded-xl p-5 mb-4 md:mb-6 animate-fade-in">
            <h2 className="font-semibold text-foreground mb-4">Add Legal Section</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Section Code</label>
                  <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} required
                    className="w-full px-4 py-2.5 rounded-lg text-sm text-foreground bg-input border border-border focus:outline-none focus:border-accent transition-all"
                    placeholder="e.g. IPC 302" />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Act Type</label>
                  <select value={form.actType} onChange={e => setForm(f => ({ ...f, actType: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg text-sm text-foreground bg-surface border border-border focus:outline-none focus:border-accent">
                    {ACT_TYPES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2.5">
                    <div className={`w-10 h-5 rounded-full transition-all ${form.isBailable ? 'bg-green-500' : 'bg-border'}`}
                         onClick={() => setForm(f => ({ ...f, isBailable: !f.isBailable }))}>
                      <div className={`w-4 h-4 bg-white rounded-full m-0.5 transition-all ${form.isBailable ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                    <span className="text-sm text-foreground">Bailable</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Title</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-foreground bg-input border border-border focus:outline-none focus:border-accent transition-all" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required rows={3}
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-foreground bg-input border border-border focus:outline-none focus:border-accent transition-all resize-none" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-lg text-sm border border-border text-muted-foreground hover:text-foreground transition-all">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #d4a847, #c49437)', color: '#0f172a' }}>
                  {submitting ? <><Loader2 size={14} className="animate-spin" />Adding...</> : 'Add Section'}
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
                <tr>{['Code', 'Act', 'Title', 'Bail', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {sections.map(s => (
                  <tr key={s.id} className="border-b border-border table-row-hover">
                    <td className="px-4 py-3 font-mono text-foreground">{s.code}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded text-foreground" style={{ background: s.actType === 'IPC' ? 'rgba(59,130,246,0.3)' : 'rgba(168,85,247,0.3)' }}>{s.actType}</span>
                    </td>
                    <td className="px-4 py-3 text-foreground max-w-xs truncate">{s.title}</td>
                    <td className="px-4 py-3">
                      {s.isBailable ? <span className="flex items-center gap-1 text-green-400 text-xs"><Shield size={12} />Yes</span> : <span className="flex items-center gap-1 text-red-400 text-xs"><ShieldOff size={12} />No</span>}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(s.id)} className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-500/10 transition-all">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </div>
        )}
      </main>
  );
}