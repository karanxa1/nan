import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { firAPI } from '@/api';
import { FileText, MapPin, Calendar, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function FIRForm() {
  const [form, setForm] = useState({ title: '', description: '', location: '', incidentDate: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await firAPI.create(form);
      setSuccess(true);
      setTimeout(() => navigate('/fir/my'), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <main className="w-full flex-1">
        <div className="max-w-2xl mx-auto">
          <div className="mb-4 md:mb-6 animate-fade-in">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Submit New FIR</h1>
            <p className="text-muted-foreground mt-1">File a First Information Report</p>
          </div>

          <div className="glass-card rounded-xl p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {error && (
              <div className="mb-4 p-3 rounded-lg flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20">
                <AlertCircle size={16} />{error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 rounded-lg flex items-center gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20">
                <CheckCircle size={16} />FIR submitted successfully! Redirecting...
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  <span className="flex items-center gap-2"><FileText size={14} style={{ color: '#d4a847' }} />Title *</span>
                </label>
                <input type="text" value={form.title} onChange={set('title')} required
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-foreground bg-input border border-border focus:outline-none focus:border-accent transition-all"
                  placeholder="Brief title of the incident" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Description *</label>
                <textarea value={form.description} onChange={set('description')} required rows={4}
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-foreground bg-input border border-border focus:outline-none focus:border-accent transition-all resize-none"
                  placeholder="Describe the incident in detail..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    <span className="flex items-center gap-2"><MapPin size={14} style={{ color: '#d4a847' }} />Location *</span>
                  </label>
                  <input type="text" value={form.location} onChange={set('location')} required
                    className="w-full px-4 py-2.5 rounded-lg text-sm text-foreground bg-input border border-border focus:outline-none focus:border-accent transition-all"
                    placeholder="Incident location" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    <span className="flex items-center gap-2"><Calendar size={14} style={{ color: '#d4a847' }} />Incident Date *</span>
                  </label>
                  <input type="date" value={form.incidentDate} onChange={set('incidentDate')} required
                    className="w-full px-4 py-2.5 rounded-lg text-sm text-foreground bg-input border border-border focus:outline-none focus:border-accent transition-all"
                    max={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => navigate('/fir/my')}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-border text-muted-foreground hover:text-foreground hover:bg-input transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #d4a847, #c49437)', color: '#0f172a' }}>
                  {loading ? <><Loader2 size={14} className="animate-spin" />Submitting...</> : 'Submit FIR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
  );
}