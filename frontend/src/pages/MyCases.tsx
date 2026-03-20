import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { caseAPI } from '@/api';
import { Briefcase, Loader2, ArrowRight } from 'lucide-react';

const statusColor: Record<string, string> = {
  OPEN: 'status-open', ACTIVE: 'status-active', CLOSED: 'status-closed',
};

export default function MyCases() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    caseAPI.getMy().then(r => setCases(r.data)).finally(() => setLoading(false));
  }, []);

  return (
      <main className="w-full flex-1">
        <div className="mb-4 md:mb-6 animate-fade-in">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">My Cases</h1>
          <p className="text-muted-foreground mt-1">{cases.length} total cases linked to your FIRs</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 size={28} className="animate-spin" style={{ color: '#d4a847' }} /></div>
        ) : cases.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center animate-fade-in">
            <Briefcase size={48} className="mx-auto mb-4 text-muted-foreground opacity-40" />
            <p className="text-muted-foreground">No cases linked to your FIRs yet</p>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in">
            {cases.map((c, i) => (
              <div key={c.id} className="glass-card rounded-xl p-5 hover:border-accent/30 transition-all group"
                   style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 icon-box">
                    <Briefcase size={16} style={{ color: '#d4a847' }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-foreground">{c.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[c.status] || ''}`}>{c.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">FIR: {c.firTitle}</p>
                    {c.assignedTo && <p className="text-xs text-muted-foreground mt-0.5">Assigned to: {c.assignedTo}</p>}
                  </div>
                  <Link to={`/case/${c.id}`}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    style={{ background: 'rgba(212,168,71,0.15)', color: '#d4a847', border: '1px solid rgba(212,168,71,0.3)' }}>
                    View <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
  );
}