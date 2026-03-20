import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { firAPI } from '@/api';
import { Loader2, FileText, MapPin, Calendar, ArrowLeft, Briefcase } from 'lucide-react';

const statusColor: Record<string, string> = {
  PENDING: 'status-pending', UNDER_INVESTIGATION: 'status-investigation', CLOSED: 'status-closed',
};

export default function FIRDetail() {
  const { id } = useParams();
  const [fir, setFir] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firAPI.getById(Number(id)).then(r => setFir(r.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
      <main className=" flex-1 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin" style={{ color: '#d4a847' }} />
      </main>
    
  );


  return (
      <main className="w-full flex-1">
        <div className="max-w-2xl mx-auto">
          <Link to="/fir/my" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 md:mb-6">
            <ArrowLeft size={16} />Back to My FIRs
          </Link>
          <div className="glass-card rounded-xl p-6 animate-fade-in">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center icon-box">
                  <FileText size={22} style={{ color: '#d4a847' }} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">{fir.title}</h1>
                  <p className="text-sm text-muted-foreground">FIR #{fir.id}</p>
                </div>
              </div>
              <span className={`text-sm px-3 py-1 rounded-full ${statusColor[fir.status] || ''}`}>{fir.status}</span>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Description</p>
                <p className="text-sm text-foreground leading-relaxed">{fir.description}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-input">
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><MapPin size={10} />Location</p>
                  <p className="text-sm text-foreground">{fir.location || 'N/A'}</p>
                </div>
                <div className="p-3 rounded-lg bg-input">
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><Calendar size={10} />Incident Date</p>
                  <p className="text-sm text-foreground">{fir.incidentDate || 'N/A'}</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-input">
                <p className="text-xs text-muted-foreground mb-1">Submitted</p>
                <p className="text-sm text-foreground">{new Date(fir.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}