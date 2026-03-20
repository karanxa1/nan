import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { firAPI } from '@/api';
import { FileText, MapPin, Calendar, Loader2, Plus, Eye } from 'lucide-react';

const statusColor: Record<string, string> = {
  PENDING: 'status-pending', UNDER_INVESTIGATION: 'status-investigation', CLOSED: 'status-closed',
};

export default function MyFIRs() {
  const [firs, setFirs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firAPI.getMy().then(r => setFirs(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
      <main className="w-full flex-1">
        <div className="flex items-center justify-between mb-4 md:mb-6 animate-fade-in">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">My FIRs</h1>
            <p className="text-muted-foreground mt-1">{firs.length} total submissions</p>
          </div>
          <Link to="/fir/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: 'linear-gradient(135deg, #d4a847, #c49437)', color: '#0f172a' }}>
            <Plus size={16} />New FIR
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 size={28} className="animate-spin" style={{ color: '#d4a847' }} /></div>
        ) : firs.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center animate-fade-in">
            <FileText size={48} className="mx-auto mb-4 text-muted-foreground opacity-40" />
            <p className="text-muted-foreground">No FIRs submitted yet</p>
            <Link to="/fir/new" className="text-sm font-medium mt-3 inline-block px-4 py-2 rounded-lg"
                  style={{ background: 'rgba(212,168,71,0.15)', color: '#d4a847', border: '1px solid rgba(212,168,71,0.3)' }}>
              Submit your first FIR
            </Link>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in">
            {firs.map((fir, i) => (
              <div key={fir.id} className="glass-card rounded-xl p-5 hover:border-accent/30 transition-all group"
                   style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 icon-box">
                    <span className="text-xs font-bold" style={{ color: '#d4a847' }}>#{fir.id}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-foreground">{fir.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[fir.status] || ''}`}>{fir.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{fir.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {fir.location && <span className="flex items-center gap-1"><MapPin size={10} />{fir.location}</span>}
                      {fir.incidentDate && <span className="flex items-center gap-1"><Calendar size={10} />{fir.incidentDate}</span>}
                    </div>
                  </div>
                  <Link to={`/fir/${fir.id}`}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    style={{ background: 'rgba(212,168,71,0.15)', color: '#d4a847', border: '1px solid rgba(212,168,71,0.3)' }}>
                    <Eye size={12} />View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
  );
}