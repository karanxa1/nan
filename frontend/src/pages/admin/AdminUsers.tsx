import { useEffect, useState } from 'react';
import { adminAPI } from '@/api';
import { Users, Loader2, Shield, User } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getUsers().then(r => setUsers(r.data)).finally(() => setLoading(false));
  }, []);

  return (
      <main className="w-full flex-1">
        <div className="mb-4 md:mb-6 animate-fade-in">
          <h1 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2"><Users size={22} style={{ color: '#d4a847' }} />Manage Users</h1>
          <p className="text-muted-foreground mt-1">{users.length} registered users</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 size={28} className="animate-spin" style={{ color: '#d4a847' }} /></div>
        ) : (
          <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
            <div className="overflow-x-auto"><table className="min-w-[600px] w-full text-sm">
              <thead className="border-b border-border">
                <tr>{['ID', 'Name', 'Email', 'Contact', 'Role', 'Joined'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-border table-row-hover">
                    <td className="px-4 py-3 text-muted-foreground">#{u.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                             style={{ background: '#1e2a4a', border: '1px solid rgba(212,168,71,0.2)', color: '#d4a847' }}>
                          {u.name?.charAt(0)}
                        </div>
                        <span className="text-foreground font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.contact || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full w-fit ${u.role === 'ADMIN' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {u.role === 'ADMIN' ? <Shield size={10} /> : <User size={10} />}{u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </div>
        )}
      </main>
  );
}