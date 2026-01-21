import { NavLink, useLocation } from 'react-router-dom';
import { 
  CheckSquare, 
  FileText, 
  Calendar, 
  BookOpen, 
  Bookmark, 
  Flame,
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { path: '/notes', icon: FileText, label: 'Notes' },
  { path: '/calendar', icon: Calendar, label: 'Calendar' },
  { path: '/diary', icon: BookOpen, label: 'Diary' },
  { path: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
  { path: '/habits', icon: Flame, label: 'Habits' },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-background border border-border md:hidden"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-40 transition-transform duration-300",
        "md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <h1 className="text-xl font-semibold tracking-tight">StudyFlow</h1>
          <p className="text-xs text-muted-foreground mt-1">Stay productive</p>
        </div>

        <nav className="px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
