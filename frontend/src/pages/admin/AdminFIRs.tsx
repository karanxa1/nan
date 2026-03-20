import { useEffect, useState } from 'react';
import { firAPI } from '@/api';
import { FileText, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const STATUS_OPTIONS = ['PENDING', 'UNDER_INVESTIGATION', 'CLOSED'];
const statusColor: Record<string, string> = {
  PENDING: 'status-pending', UNDER_INVESTIGATION: 'status-investigation', CLOSED: 'status-closed',
};

export default function AdminFIRs() {
  const [firs, setFirs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => { firAPI.getAll().then(r => setFirs(r.data)).finally(() => setLoading(false)); }, []);

  const updateStatus = async (id: number, status: string) => {
    setUpdating(id);
    try {
      await firAPI.updateStatus(id, status);
      setFirs(prev => prev.map(f => f.id === id ? { ...f, status } : f));
      setMsg('Status updated');
      setTimeout(() => setMsg(''), 2000);
    } catch (e) {
      setMsg('Failed to update');
    } finally { setUpdating(null); }
  };

  return (
      <main className="w-full flex-1">
        <div className="flex items-center justify-between mb-4 md:mb-6 animate-fade-in">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Manage FIRs</h1>
            <p className="text-muted-foreground mt-1">{firs.length} total FIRs</p>
          </div>
          {msg && (
            <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
              <CheckCircle size={14} />{msg}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 size={28} className="animate-spin" style={{ color: '#d4a847' }} /></div>
        ) : (
          <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
            <div className="overflow-x-auto"><table className="min-w-[600px] w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  {['ID', 'Title', 'Submitted By', 'Location', 'Status', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {firs.map(fir => (
                  <tr key={fir.id} className="border-b border-border table-row-hover">
                    <td className="px-4 py-3 text-muted-foreground">#{fir.id}</td>
                    <td className="px-4 py-3 text-foreground font-medium max-w-xs truncate">{fir.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{fir.userName || 'N/A'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{fir.location || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[fir.status] || ''}`}>{fir.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <select value={fir.status}
                        onChange={e => updateStatus(fir.id, e.target.value)}
                        disabled={updating === fir.id}
                        className="text-xs px-2.5 py-1.5 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:border-accent transition-all cursor-pointer">
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
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