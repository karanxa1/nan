import { useEffect, useState } from 'react';
import { firAPI, caseAPI, notifAPI } from '@/api';
import { Briefcase, FileText, Shield, Loader2 } from 'lucide-react';

function StatCard({ label, value, icon: Icon, color, delay }: any) {
  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in" style={{ animationDelay: delay }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}40` }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <p className="text-2xl md:text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}

export default function AdminPanel() {
  const [firs, setFirs] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([firAPI.getAll(), caseAPI.getAll()])
      .then(([f, c]) => { setFirs(f.data); setCases(c.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
      <main className="w-full flex-1 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin" style={{ color: '#d4a847' }} />
      </main>
  );

  return (
      <main className="w-full flex-1">
        <div className="mb-4 md:mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-1">
            <Shield size={22} style={{ color: '#d4a847' }} />
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Admin Control Panel</h1>
          </div>
          <p className="text-muted-foreground">Overview of the entire Legal FIR system</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-8">
          <StatCard label="Total FIRs" value={firs.length} icon={FileText} color="#3b82f6" delay="0s" />
          <StatCard label="Pending FIRs" value={firs.filter(f => f.status === 'PENDING').length} icon={FileText} color="#f59e0b" delay="0.1s" />
          <StatCard label="Active Cases" value={cases.filter(c => c.status !== 'CLOSED').length} icon={Briefcase} color="#d4a847" delay="0.2s" />
          <StatCard label="Closed Cases" value={cases.filter(c => c.status === 'CLOSED').length} icon={Briefcase} color="#22c55e" delay="0.3s" />
        </div>

        {/* Recent FIRs Table */}
        <div className="glass-card rounded-xl p-5 animate-fade-in mb-4 md:mb-6">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2"><FileText size={16} style={{ color: '#d4a847' }} />Recent FIRs</h2>
          <div className="overflow-x-auto"><table className="min-w-[600px] w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-muted-foreground font-medium">ID</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Title</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Submitted By</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Status</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {firs.slice(0, 8).map(fir => (
                <tr key={fir.id} className="border-b border-border table-row-hover">
                  <td className="py-2.5 text-muted-foreground">#{fir.id}</td>
                  <td className="py-2.5 text-foreground font-medium">{fir.title}</td>
                  <td className="py-2.5 text-muted-foreground">{fir.userName || 'N/A'}</td>
                  <td className="py-2.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${fir.status === 'PENDING' ? 'status-pending' : fir.status === 'UNDER_INVESTIGATION' ? 'status-investigation' : 'status-closed'}`}>
                      {fir.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-muted-foreground">{new Date(fir.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      </main>
  );
}