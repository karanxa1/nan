import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { notifAPI } from '@/api';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, Scale, Briefcase, FileUp, Bell,
  Users, BarChart2, Shield, LogOut, ChevronRight, Menu, X, Sun, Moon
} from 'lucide-react';

const navUser = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'My FIRs', icon: FileText, path: '/fir/my' },
  { label: 'New FIR', icon: FileText, path: '/fir/new' },
  { label: 'Legal Sections', icon: Scale, path: '/legal' },
  { label: 'My Cases', icon: Briefcase, path: '/case/my' },
  { label: 'Documents', icon: FileUp, path: '/documents' },
];

const navAdmin = [
  { label: 'Admin Panel', icon: Shield, path: '/admin' },
  { label: 'Manage FIRs', icon: FileText, path: '/admin/firs' },
  { label: 'Manage Cases', icon: Briefcase, path: '/admin/cases' },
  { label: 'Legal Sections', icon: Scale, path: '/admin/legal' },
  { label: 'Users', icon: Users, path: '/admin/users' },
  { label: 'Reports', icon: BarChart2, path: '/admin/reports' },
  { label: 'Notifications', icon: Bell, path: '/admin/notifications' },
];

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
  onNavigate?: () => void;
}

export const Sidebar = ({ isCollapsed, setIsCollapsed, onNavigate }: SidebarProps) => {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!isAdmin) {
      notifAPI.getMy().then(res => {
        setUnread(res.data.filter((n: { isRead: boolean; read: boolean }) => !n.isRead && !n.read).length);
      }).catch(() => {});
    }
  }, [isAdmin]);

  const items = isAdmin ? navAdmin : navUser;

  return (
    <motion.aside 
      className="sidebar-bg fixed left-0 top-0 h-full flex flex-col z-40" 
      initial={false}
      animate={{ width: isCollapsed ? '5rem' : '16rem' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Top Header / Logo */}
      <div className={`p-4 border-b border-border flex items-center h-[73px] ${isCollapsed ? 'justify-center cursor-pointer hover:bg-input transition-colors' : 'justify-between'}`}
           onClick={() => isCollapsed && setIsCollapsed(false)}
           title={isCollapsed ? "Expand Sidebar" : undefined}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-lg flex items-center justify-center shrink-0" 
               style={{ background: 'linear-gradient(135deg, #d4a847, #f0c96f)' }}>
            <Scale size={18} className="text-[#0f172a]" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="whitespace-nowrap"
              >
                <p className="font-bold text-sm text-foreground">LegalFIR</p>
                <p className="text-xs text-muted-foreground">System</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {!isCollapsed && (
          <button 
            onClick={(e) => { e.stopPropagation(); setIsCollapsed(true); }}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* User Info */}
      <div className={`py-3 border-b border-border h-[57px] flex items-center overflow-hidden ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full icon-box flex items-center justify-center text-xs font-bold shrink-0"
               style={{ border: '1px solid #d4a847', color: '#d4a847' }}
               title={isCollapsed ? user?.name : undefined}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex-1 min-w-0 whitespace-nowrap"
              >
                <p className="text-sm font-medium text-foreground truncate w-[130px]">{user?.name}</p>
                <p className="text-xs" style={{ color: '#d4a847' }}>{user?.role}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 space-y-1 overflow-y-auto overflow-x-hidden ${isCollapsed ? 'p-2' : 'p-3'}`}>
        {items.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}
              onClick={() => onNavigate?.()}
              className={`flex items-center rounded-lg text-sm font-medium transition-all duration-200 group relative
                ${active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-input'}
                ${isCollapsed ? 'justify-center py-3' : 'gap-3 px-3 py-2.5'}`}
              style={active ? { 
                background: 'rgba(212, 168, 71, 0.1)', 
                borderLeft: isCollapsed ? 'none' : '3px solid #d4a847' 
              } : {}}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon size={isCollapsed ? 22 : 18} className={`shrink-0 ${active ? 'text-accent' : 'group-hover:text-accent transition-colors'}`} style={{ color: active ? '#d4a847' : undefined }} />
              
              {isCollapsed && item.label === 'My FIRs' && unread > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500"></span>
              )}

              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex flex-1 items-center whitespace-nowrap overflow-hidden"
                  >
                    <span>{item.label}</span>
                    {item.label === 'My FIRs' && unread > 0 && (
                      <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full"
                            style={{ background: '#d4a847', color: '#0f172a' }}>{unread}</span>
                    )}
                    {active && <ChevronRight size={14} className="ml-auto shrink-0" style={{ color: '#d4a847' }} />}
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle */}
      <div className={`border-t border-border mt-auto pt-3 ${isCollapsed ? 'px-2' : 'px-3'}`}>
        <button onClick={toggleTheme}
          className={`flex items-center rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-input transition-all ${isCollapsed ? 'justify-center py-3 w-full' : 'gap-3 px-3 py-2.5 w-full'}`}
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? <Sun size={isCollapsed ? 22 : 18} className="shrink-0 text-yellow-400" /> : <Moon size={isCollapsed ? 22 : 18} className="shrink-0" />}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="whitespace-nowrap overflow-hidden"
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Logout */}
      <div className={`border-t border-border mt-2 mb-2 ${isCollapsed ? 'px-2' : 'px-3'}`}>
        <button onClick={() => { logout(); navigate('/login'); }}
          className={`flex items-center rounded-lg text-sm text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all ${isCollapsed ? 'justify-center py-3 w-full' : 'gap-3 px-3 py-2.5 w-full'}`}
          title="Logout"
        >
          <LogOut size={isCollapsed ? 22 : 18} className="shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="whitespace-nowrap overflow-hidden"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};
