import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { legalAPI } from '@/api';
import { Scale, Search, Shield, ShieldOff, Loader2 } from 'lucide-react';

export default function LegalSearch() {
  const [sections, setSections] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    legalAPI.getAll().then(r => setSections(r.data)).finally(() => setLoading(false));
  }, []);

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setSearching(true);
      legalAPI.getAll().then(r => setSections(r.data)).finally(() => setSearching(false));
      return;
    }
    setSearching(true);
    legalAPI.search(q).then(r => setSections(r.data)).finally(() => setSearching(false));
  };

  return (
      <main className="w-full flex-1">
        <div className="mb-4 md:mb-6 animate-fade-in">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Legal Sections</h1>
          <p className="text-muted-foreground mt-1">Search IPC/CrPC sections and check bail eligibility</p>
        </div>

        {/* Search */}
        <div className="relative mb-4 md:mb-6 animate-fade-in">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" value={query}
            onChange={e => handleSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-foreground bg-input border border-border focus:outline-none focus:border-accent transition-all"
            placeholder="Search by code, title, or description..." />
          {searching && <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground" />}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 size={28} className="animate-spin" style={{ color: '#d4a847' }} /></div>
        ) : (
          <div className="grid grid-cols-2 gap-3 animate-fade-in">
            {sections.map((s, i) => (
              <Link to={`/legal/${s.id}`} key={s.id}
                className="glass-card rounded-xl p-4 hover:border-accent/30 transition-all group"
                style={{ animationDelay: `${i * 0.03}s` }}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                       style={{ background: s.actType === 'IPC' ? 'rgba(59,130,246,0.2)' : 'rgba(168,85,247,0.2)', border: `1px solid ${s.actType === 'IPC' ? 'rgba(59,130,246,0.3)' : 'rgba(168,85,247,0.3)'}` }}>
                    <Scale size={14} style={{ color: s.actType === 'IPC' ? '#3b82f6' : '#a855f7' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-foreground">{s.code}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded text-foreground"
                            style={{ background: s.actType === 'IPC' ? 'rgba(59,130,246,0.3)' : 'rgba(168,85,247,0.3)' }}>{s.actType}</span>
                      {s.isBailable ? (
                        <span className="flex items-center gap-0.5 text-xs text-green-400"><Shield size={10} />Bailable</span>
                      ) : (
                        <span className="flex items-center gap-0.5 text-xs text-red-400"><ShieldOff size={10} />Non-bailable</span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground mb-0.5">{s.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{s.description}</p>
                  </div>
                </div>
              </Link>
            ))}
            {sections.length === 0 && (
              <div className="col-span-2 text-center py-12"><Scale size={48} className="mx-auto mb-4 text-muted-foreground opacity-40" />
                <p className="text-muted-foreground">No sections found for "{query}"</p>
              </div>
            )}
          </div>
        )}
      </main>
  );
}