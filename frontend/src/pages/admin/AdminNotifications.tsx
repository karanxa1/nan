import { useEffect, useState } from 'react';
import { notifAPI } from '@/api';
import { Bell, Send, Loader2, CheckCircle, Users } from 'lucide-react';

export default function AdminNotifications() {
  const [notifs, setNotifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ userId: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');
  const [recent, setRecent] = useState<any[]>([]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (form.userId) await notifAPI.send(Number(form.userId), form.message);
      else await notifAPI.broadcast(form.message);
      setForm({ userId: '', message: '' });
      setMsg('Notification sent!'); setTimeout(() => setMsg(''), 2000);
    } finally { setSubmitting(false); }
  };

  return (
      <main className="w-full flex-1">
        <div className="mb-4 md:mb-6 animate-fade-in">
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Send Notifications</h1>
          <p className="text-muted-foreground mt-1">Send targeted or broadcast notifications to users</p>
        </div>

        <div className="max-w-xl">
          <div className="glass-card rounded-xl p-6 animate-fade-in">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Send size={16} style={{ color: '#d4a847' }} />Compose Notification
            </h2>
            {msg && (
              <div className="mb-4 p-3 rounded-lg flex items-center gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20">
                <CheckCircle size={16} />{msg}
              </div>
            )}
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                  <Users size={12} />User ID (leave blank for broadcast)
                </label>
                <input type="number" value={form.userId} onChange={e => setForm(f => ({ ...f, userId: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-foreground bg-input border border-border focus:outline-none focus:border-accent transition-all"
                  placeholder="Enter user ID or leave empty for all users" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">Message *</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required rows={4}
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-foreground bg-input border border-border focus:outline-none focus:border-accent transition-all resize-none"
                  placeholder="Write your notification message..." />
              </div>
              <button type="submit" disabled={submitting}
                className="w-full py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #d4a847, #c49437)', color: '#0f172a' }}>
                {submitting ? <><Loader2 size={14} className="animate-spin" />Sending...</> : <><Bell size={14} />{form.userId ? 'Send to User' : 'Broadcast to All'}</>}
              </button>
            </form>
          </div>
        </div>
      </main>
  );
}