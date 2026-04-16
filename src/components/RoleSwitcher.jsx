import { useState } from 'react';
import { useStore } from '../store/useStore';
import { User, ShieldBan, ShieldCheck, Moon, Sun, Lock, Unlock } from 'lucide-react';

export default function RoleSwitcher() {
  const { role, adminUnlocked, setRole, unlockAdmin, lockAdmin, theme, toggleTheme } = useStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);

  const handleUnlock = () => {
    if (pin.length !== 4) {
      setError('Enter a 4-digit PIN');
      return;
    }

    if (unlockAdmin(pin)) {
      setError('');
      setShowPin(false);
      setPin('');
      return;
    }

    setError('Incorrect PIN, try again');
    setPin('');
  };

  return (
    <div className="flex flex-col gap-2 bg-card px-4 py-3 rounded-3xl border border-white/10 dark:border-white/5 shadow-md">
      <div className="flex items-center gap-4">
        <div className="flex bg-muted rounded-full p-1 border border-border/50">
          <button
            onClick={() => {
              lockAdmin();
              setShowPin(false);
            }}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200 ${
              role === 'viewer' ? 'bg-background shadow-sm text-primary ring-1 ring-border' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <User className="w-4 h-4" /> Viewer
          </button>
          <button
            onClick={() => {
              if (role === 'admin' && adminUnlocked) return;
              setShowPin(true);
              setError('');
            }}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200 ${
              role === 'admin' ? 'bg-background shadow-sm text-indigo-600 dark:text-indigo-400 ring-1 ring-border' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {role === 'admin' ? <ShieldCheck className="w-4 h-4" /> : <ShieldBan className="w-4 h-4" />} Admin
          </button>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          {theme === 'light' ? <Moon className="w-5 h-5 fill-current" /> : <Sun className="w-5 h-5 fill-current" />}
        </button>
      </div>

      {showPin && role !== 'admin' && (
        <div className="flex flex-col gap-2 p-3 rounded-2xl bg-surface border border-border">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Lock className="w-4 h-4" /> Admin unlock
          </div>
          <div className="flex items-center gap-2">
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="Enter 4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              type="button"
              onClick={handleUnlock}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <Unlock className="w-4 h-4" /> Unlock
            </button>
          </div>
          {error ? <p className="text-xs text-rose-500">{error}</p> : null}
        </div>
      )}

      {role === 'admin' && adminUnlocked && (
        <div className="flex items-center gap-2 text-xs text-emerald-400">
          <ShieldCheck className="w-4 h-4" /> Admin panel unlocked
        </div>
      )}
    </div>
  );
}
