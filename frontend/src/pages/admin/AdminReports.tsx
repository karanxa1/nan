import { useEffect, useState } from 'react';
import { reportAPI } from '@/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { BarChart2, Loader2, FileText, Briefcase, Users, TrendingUp } from 'lucide-react';

const COLORS = ['#d4a847', '#3b82f6', '#22c55e', '#ef4444', '#a855f7'];

export default function AdminReports() {
  const [summary, setSummary] = useState<any>(null);
  const [firStats, setFirStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([reportAPI.getSummary(), reportAPI.getFirStats()])
      .then(([s, f]) => { 
        setSummary(s.data); 
        const statsArray = Object.entries(f.data).map(([status, count]) => ({ status, count }));
        setFirStats(statsArray); 
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
      <main className="w-full flex-1 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin" style={{ color: '#d4a847' }} />
      </main>
  );

  const pieData = firStats.map(f => ({ name: f.status, value: f.count }));

  return (
      <main className="w-full flex-1">
        <div className="mb-4 md:mb-6 animate-fade-in">
          <h1 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2"><BarChart2 size={22} style={{ color: '#d4a847' }} />Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">System-wide statistics and insights</p>
        </div>

        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-8 animate-fade-in">
            {[
              { label: 'Total FIRs', value: summary.totalFIRs, icon: FileText, color: '#3b82f6' },
              { label: 'Total Cases', value: summary.totalCases, icon: Briefcase, color: '#d4a847' },
              { label: 'Total Users', value: summary.totalUsers, icon: Users, color: '#a855f7' },
              { label: 'Pending FIRs', value: summary.pendingFIRs, icon: TrendingUp, color: '#f59e0b' },
            ].map((s, i) => (
              <div key={s.label} className="glass-card rounded-xl p-5" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <s.icon size={18} style={{ color: s.color }} />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">{s.value ?? '—'}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* FIR Status Bar Chart */}
          {firStats.length > 0 && (
            <div className="glass-card rounded-xl p-5 animate-fade-in">
              <h2 className="font-semibold text-foreground mb-4">FIR Status Distribution</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={firStats} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                  <XAxis dataKey="status" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} labelStyle={{ color: '#fff' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {firStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Pie Chart */}
          {pieData.length > 0 && (
            <div className="glass-card rounded-xl p-5 animate-fade-in">
              <h2 className="font-semibold text-foreground mb-4">FIR Status Breakdown</h2>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={(props: any) => `${props.name} ${((props.percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </main>
  );
}