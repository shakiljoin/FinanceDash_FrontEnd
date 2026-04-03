import { useEffect } from 'react';
import { useStore } from './store/useStore';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Insights from './components/Insights';
import RoleSwitcher from './components/RoleSwitcher';
import { Activity } from 'lucide-react';

function App() {
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Decorative background blob
  const BackgroundBlob = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[150px]" />
    </div>
  );

  return (
    <div className="min-h-screen relative font-sans text-foreground pb-12">
      <BackgroundBlob />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground p-2 rounded-xl shadow-lg shadow-primary/30">
                <Activity className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-extrabold tracking-tight">Finance<span className="text-primary">Dash</span></h1>
            </div>
            
            <RoleSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Top Section: Dashboard + Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Overview</h2>
            <Dashboard />
          </div>
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold mb-6 opacity-0 md:opacity-100 hidden lg:block">&nbsp;</h2>
            <Insights />
          </div>
        </div>

        {/* Bottom Section: Transactions */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Transactions</h2>
          </div>
          <Transactions />
        </section>
        
      </main>
    </div>
  );
}

export default App;
