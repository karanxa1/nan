import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authAPI } from '@/api';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Scale, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

const AuroraBackground = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-background transition-colors duration-300" />
    <div className="absolute -top-1/2 -left-1/4 w-[60vw] h-[60vw] rounded-full opacity-20 animate-pulse"
         style={{ background: isDark ? 'radial-gradient(circle, #1e2a4a 0%, transparent 70%)' : 'radial-gradient(circle, #e2e8f0 0%, transparent 70%)', animationDuration: '4s' }} />
    <div className="absolute -bottom-1/4 -right-1/4 w-[70vw] h-[70vw] rounded-full opacity-15 animate-pulse"
         style={{ background: 'radial-gradient(circle, #d4a847 0%, transparent 70%)', animationDuration: '6s', animationDelay: '2s' }} />
    <div className="absolute top-1/4 left-1/2 w-[40vw] h-[40vw] rounded-full opacity-10 animate-pulse"
         style={{ background: isDark ? 'radial-gradient(circle, #1e4a6e 0%, transparent 70%)' : 'radial-gradient(circle, #94a3b8 0%, transparent 70%)', animationDuration: '5s', animationDelay: '1s' }} />
    {/* Grid overlay */}
    <div className="absolute inset-0 opacity-5"
         style={{ backgroundImage: 'linear-gradient(rgba(212,168,71,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,71,0.2) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
  </div>
  );
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isReset, setIsReset] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await authAPI.login({ email, password });
      const { token, role, userId, name } = res.data;
      login(token, role, userId, name);
      navigate(role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      await authAPI.resetPassword({ email, contact, newPassword });
      setSuccessMsg('Password reset successfully. Please login.');
      setIsReset(false);
      setPassword('');
      setContact('');
      setNewPassword('');
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
        {/* Card */}
        <div className="glass rounded-2xl p-8 shadow-2xl transition-all duration-300" style={{ border: '1px solid rgba(212,168,71,0.25)' }}>
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                 style={{ background: 'linear-gradient(135deg, #d4a847, #f0c96f)' }}>
              <Scale size={28} className="text-[#0f172a]" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{isReset ? 'Reset Password' : 'Welcome Back'}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isReset ? 'Verify your identity to reset password' : 'Sign in to Legal FIR Management'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg flex items-center gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20">
              {successMsg}
            </div>
          )}

          {!isReset ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-foreground bg-input border border-border 
                             focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  style={{ '--tw-ring-color': '#d4a847' } as any}
                  placeholder="officer@police.gov.in" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-foreground">Password</label>
                  <button type="button" onClick={() => { setIsReset(true); setError(''); setSuccessMsg(''); setPassword(''); }} className="text-xs hover:underline" style={{ color: '#d4a847' }}>
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                    className="w-full px-4 py-2.5 rounded-lg text-sm text-foreground bg-input border border-border
                               focus:outline-none focus:border-accent focus:ring-1 transition-all pr-10"
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 mt-4"
                style={{ background: 'linear-gradient(135deg, #d4a847, #c49437)', color: '#0f172a' }}>
                {loading ? <><Loader2 size={16} className="animate-spin" />Signing in...</> : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleReset} className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-foreground bg-input border border-border focus:ring-1 focus:outline-none focus:border-accent transition-all"
                  style={{ '--tw-ring-color': '#d4a847' } as any}
                  placeholder="Enter your registered email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Registered Contact Number</label>
                <input type="text" value={contact} onChange={e => setContact(e.target.value)} required
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-foreground bg-input border border-border focus:ring-1 focus:outline-none focus:border-accent transition-all"
                  style={{ '--tw-ring-color': '#d4a847' } as any}
                  placeholder="Enter your registered phone number" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
                <div className="relative">
                  <input type={showPwd ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6}
                    className="w-full px-4 py-2.5 rounded-lg text-sm text-foreground bg-input border border-border focus:ring-1 focus:outline-none focus:border-accent transition-all pr-10"
                    style={{ '--tw-ring-color': '#d4a847' } as any}
                    placeholder="Enter new password" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 mt-4"
                style={{ background: 'linear-gradient(135deg, #d4a847, #c49437)', color: '#0f172a' }}>
                {loading ? <><Loader2 size={16} className="animate-spin" />Resetting...</> : 'Reset Password'}
              </button>
              <button type="button" disabled={loading} onClick={() => { setIsReset(false); setError(''); setSuccessMsg(''); }}
                className="w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 border border-border hover:bg-input text-foreground flex items-center justify-center mt-2">
                Back to Login
              </button>
            </form>
          )}

          {!isReset && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{' '}
              <a href="/register" className="font-medium hover:underline" style={{ color: '#d4a847' }}>Register</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}