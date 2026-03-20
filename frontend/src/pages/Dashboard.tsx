import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { firAPI, notifAPI, caseAPI } from '@/api';
import { useAuth } from '@/context/AuthContext';
import { FileText, Briefcase, Bell, Plus, ArrowRight, Clock, MapPin, Loader2 } from 'lucide-react';

function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const start = useRef(Date.now());
  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Date.now() - start.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span>{count}</span>;
}

const statusColor = {
  PENDING: 'status-pending',
  UNDER_INVESTIGATION: 'status-investigation',
  CLOSED: 'status-closed',
  OPEN: 'status-open',
  ACTIVE: 'status-active',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [firs, setFirs] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([firAPI.getMy(), caseAPI.getMy(), notifAPI.getMy()])
      .then(([f, c, n]) => { setFirs(f.data); setCases(c.data); setNotifs(n.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const unread = notifs.filter(n => !n.isRead && !n.read).length;

  if (loading) return (
    <div className="flex h-full items-center justify-center">
      <Loader2 size={32} className="animate-spin" style={{ color: '#d4a847' }} />
    </div>
  );

  const stats = [
    { label: 'Total FIRs', value: firs.length, icon: FileText, color: '#3b82f6' },
    { label: 'Active Cases', value: cases.filter(c => c.status !== 'CLOSED').length, icon: Briefcase, color: '#d4a847' },
    { label: 'Unread Alerts', value: unread, icon: Bell, color: '#ef4444' },
  ];

  return (
    <>
      {/* Header Banner */}
      <div className="mb-4 md:mb-8 animate-fade-in glass-card rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Welcome back, <span className="gold-gradient">{user?.name}</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-base">Here's an overview of your legal activities</p>
          </div>
          <div className="hidden md:flex gap-3">
            <Link to="/fir/new"
              className="flex items-center gap-2 font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm"
              style={{ background: '#d4a847', color: '#000' }}>
              <Plus size={17} /> File New FIR
            </Link>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-4 md:mb-8">
        {stats.map((stat, i) => (
          <div key={stat.label} className="glass-card relative overflow-hidden group rounded-2xl p-6 animate-counter-up"
               style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="flex flex-col h-full justify-between">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300"
                     style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}40` }}>
                  <stat.icon size={22} style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-4xl font-black text-foreground tracking-tight">
                <AnimatedCounter value={stat.value} />
              </p>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-0.5 opacity-60" style={{ background: `linear-gradient(90deg, ${stat.color}, transparent)` }} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent FIRs */}
        <div className="glass-card rounded-2xl overflow-hidden animate-fade-in flex flex-col" style={{ animationDelay: '0.3s' }}>
          <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <FileText size={17} style={{ color: '#d4a847' }} /> Recent FIRs
            </h2>
            <Link to="/fir/my" className="text-xs font-semibold hover:underline" style={{ color: '#d4a847' }}>View All</Link>
          </div>
          <div className="p-3 space-y-1 flex-1 overflow-y-auto max-h-[380px]">
            {firs.slice(0, 5).map(fir => (
              <Link to={`/fir/${fir.id}`} key={fir.id}
                className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-[var(--color-muted)] transition-all group border border-transparent hover:border-[var(--color-border)]">
                <div className="w-9 h-9 rounded-lg icon-box flex items-center justify-center flex-shrink-0">
                  <FileText size={15} style={{ color: '#d4a847' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate group-hover:text-amber-400 transition-colors">{fir.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${statusColor[fir.status as keyof typeof statusColor] || ''}`}>
                      {fir.status.replace('_', ' ')}
                    </span>
                    {fir.location && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin size={11} />{fir.location}
                      </span>
                    )}
                  </div>
                </div>
                <ArrowRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" style={{ color: '#d4a847' }} />
              </Link>
            ))}
            {firs.length === 0 && (
              <div className="text-center py-14">
                <div className="w-14 h-14 rounded-full icon-box flex items-center justify-center mx-auto mb-3">
                  <FileText size={22} className="text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">No FIRs submitted yet</p>
                <Link to="/fir/new" className="text-xs font-bold mt-3 inline-flex items-center px-4 py-1.5 rounded-lg" style={{ background: 'rgba(212,168,71,0.12)', color: '#d4a847' }}>Submit your first FIR</Link>
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card rounded-2xl overflow-hidden animate-fade-in flex flex-col" style={{ animationDelay: '0.4s' }}>
          <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Bell size={17} style={{ color: '#d4a847' }} /> Notifications
            </h2>
            {unread > 0 && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
                {unread} unread
              </span>
            )}
          </div>
          <div className="p-3 space-y-2 flex-1 overflow-y-auto max-h-[380px]">
            {notifs.slice(0, 5).map(notif => (
              <div key={notif.id} className={`p-3.5 rounded-xl border transition-all ${!notif.isRead && !notif.read ? 'border-amber-500/25' : 'border-[var(--color-border)]'}`}
                   style={!notif.isRead && !notif.read ? { background: 'rgba(212,168,71,0.06)' } : { background: 'var(--color-muted)' }}>
                <p className={`text-sm ${!notif.isRead && !notif.read ? 'text-amber-200' : 'text-foreground'}`}>{notif.message}</p>
                <p className="text-[10px] font-medium text-muted-foreground mt-1.5 flex items-center gap-1">
                  <Clock size={11} />
                  {new Date(notif.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
            {notifs.length === 0 && (
              <div className="text-center py-14">
                <div className="w-14 h-14 rounded-full icon-box flex items-center justify-center mx-auto mb-3">
                  <Bell size={22} className="text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">All caught up!</p>
                <p className="text-xs text-muted-foreground mt-1">No new notifications</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}