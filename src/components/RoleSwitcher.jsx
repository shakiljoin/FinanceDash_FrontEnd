import { useStore } from '../store/useStore';
import { User, ShieldBan, ShieldCheck, Moon, Sun } from 'lucide-react';

export default function RoleSwitcher() {
  const { role, setRole, theme, toggleTheme } = useStore();

  return (
    <div className="flex items-center gap-4 bg-card px-4 py-2 rounded-full border border-white/10 dark:border-white/5 shadow-md">
      <div className="flex bg-muted rounded-full p-1 border border-border/50">
        <button
          onClick={() => setRole('viewer')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200 ${
            role === 'viewer' ? 'bg-background shadow-sm text-primary ring-1 ring-border' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <User className="w-4 h-4" /> Viewer
        </button>
        <button
          onClick={() => setRole('admin')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200 ${
            role === 'admin' ? 'bg-background shadow-sm text-indigo-600 dark:text-indigo-400 ring-1 ring-border' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {role === 'admin' ? <ShieldCheck className="w-4 h-4" /> : <ShieldBan className="w-4 h-4" />} Admin
        </button>
      </div>
      
      <div className="w-px h-6 bg-border"></div>

      <button
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
      >
        {theme === 'light' ? <Moon className="w-5 h-5 fill-current" /> : <Sun className="w-5 h-5 fill-current" />}
      </button>
    </div>
  );
}
