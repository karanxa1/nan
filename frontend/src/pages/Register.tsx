import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authAPI } from '@/api';
import { useTheme } from '@/context/ThemeContext';
import { Scale, Eye, EyeOff, AlertCircle, Loader2, CheckCircle } from 'lucide-react';

const AuroraBackground = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-background transition-colors duration-300" />
    <div className="absolute -top-1/2 -right-1/4 w-[60vw] h-[60vw] rounded-full opacity-20 animate-pulse"
         style={{ background: isDark ? 'radial-gradient(circle, #1e2a4a 0%, transparent 70%)' : 'radial-gradient(circle, #e2e8f0 0%, transparent 70%)', animationDuration: '5s' }} />
    <div className="absolute -bottom-1/4 -left-1/4 w-[70vw] h-[70vw] rounded-full opacity-15 animate-pulse"
         style={{ background: 'radial-gradient(circle, #d4a847 0%, transparent 70%)', animationDuration: '7s' }} />
    <div className="absolute inset-0 opacity-5"
         style={{ backgroundImage: 'linear-gradient(rgba(212,168,71,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,71,0.2) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
  </div>
  );
};

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', contact: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authAPI.register(form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <AuroraBackground />
      <div className="relative z-10 w-full max-w-md px-4 animate-fade-in">
        <div className="glass rounded-2xl p-8 shadow-2xl" style={{ border: '1px solid rgba(212,168,71,0.25)' }}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                 style={{ background: 'linear-gradient(135deg, #d4a847, #f0c96f)' }}>
              <Scale size={28} className="text-[#0f172a]" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
            <p className="text-sm text-muted-foreground mt-1">Legal FIR Management System</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20">
              <AlertCircle size={16} />{error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-lg flex items-center gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20">
              <CheckCircle size={16} />Registration successful! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { k: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
              { k: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
              { k: 'contact', label: 'Contact Number', type: 'tel', placeholder: '+91 9876543210' },
            ].map(({ k, label, type, placeholder }) => (
              <div key={k}>
                <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
                <input type={type} value={form[k as keyof typeof form]} onChange={set(k)} required
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-foreground bg-input border border-border focus:outline-none focus:border-accent transition-all"
                  placeholder={placeholder} />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={set('password')} required
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-foreground bg-input border border-border focus:outline-none focus:border-accent transition-all pr-10"
                  placeholder="Min 6 characters" minLength={6} />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              style={{ background: 'linear-gradient(135deg, #d4a847, #c49437)', color: '#0f172a' }}>
              {loading ? <><Loader2 size={16} className="animate-spin" />Creating Account...</> : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <a href="/login" className="font-medium hover:underline" style={{ color: '#d4a847' }}>Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
}