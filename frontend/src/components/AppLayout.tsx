import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) { setIsCollapsed(true); setMobileOpen(false); }
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar: on mobile, show only when mobileOpen */}
      <div className={`${isMobile ? (mobileOpen ? 'block' : 'hidden') : 'block'}`}>
        <Sidebar 
          isCollapsed={isMobile ? false : isCollapsed} 
          setIsCollapsed={(v) => {
            if (isMobile) setMobileOpen(!v);
            else setIsCollapsed(v);
          }}
          onNavigate={() => isMobile && setMobileOpen(false)}
        />
      </div>

      {/* Main content */}
      <motion.main 
        className="flex-1 overflow-y-auto"
        initial={false}
        animate={{ 
          marginLeft: isMobile ? 0 : (isCollapsed ? '5rem' : '16rem'),
          width: isMobile ? '100%' : `calc(100% - ${isCollapsed ? '5rem' : '16rem'})`
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Mobile top bar */}
        {isMobile && (
          <div className="sticky top-0 z-20 flex items-center h-14 px-4 border-b border-[var(--color-border)]" style={{ background: 'var(--color-sidebar)' }}>
            <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-[var(--color-muted)] text-foreground transition-colors">
              <Menu size={22} />
            </button>
            <span className="ml-3 font-bold text-sm text-foreground">LegalFIR</span>
          </div>
        )}
        <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
          {children}
        </div>
      </motion.main>
    </div>
  );
};
