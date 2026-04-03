import { useStore } from '../store/useStore';
import { TrendingUp, TrendingDown, Target, Lightbulb } from 'lucide-react';

export default function Insights() {
  const transactions = useStore((state) => state.transactions);

  const calculateInsights = () => {
    if (transactions.length === 0) return null;

    let totalIncome = 0;
    const expensesByCategory = {};

    transactions.forEach(t => {
      if (t.type === 'income') {
        totalIncome += t.amount;
      } else {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      }
    });

    const totalExpenses = Object.values(expensesByCategory).reduce((a, b) => a + b, 0);
    
    let highestCategory = { name: 'None', amount: 0 };
    for (const [name, amount] of Object.entries(expensesByCategory)) {
      if (amount > highestCategory.amount) {
        highestCategory = { name, amount };
      }
    }

    const netAmount = totalIncome - totalExpenses;
    let savingsRate = 0;
    if (totalIncome > 0) {
      savingsRate = ((netAmount / totalIncome) * 100).toFixed(1);
    } else if (totalIncome === 0 && totalExpenses === 0) {
      savingsRate = 0;
    }

    return { totalIncome, totalExpenses, highestCategory, netAmount, savingsRate };
  };

  const insights = calculateInsights();

  if (!insights) {
    return (
      <div className="glass-panel rounded-3xl p-6 text-center text-muted-foreground">
        <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Add some transactions to see your financial insights!</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-3xl p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-colors duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mr-10 -mt-10 rounded-full pointer-events-none"></div>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-500/10 rounded-xl">
          <Lightbulb className="w-6 h-6 text-amber-500" />
        </div>
        <h3 className="text-xl font-bold text-foreground">AI Financial Insights</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-card/40 border border-white/5 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
          <div className="bg-background/80 p-3 rounded-xl shadow-sm border border-border">
            <Target className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Top Spend Category</p>
            <p className="text-xl font-extrabold text-foreground tracking-tight">{insights.highestCategory.name}</p>
            <p className="text-sm font-bold text-rose-500 mt-1">
              ${insights.highestCategory.amount.toLocaleString()} <span className="text-muted-foreground font-normal">spent</span>
            </p>
          </div>
        </div>

        <div className="bg-card/40 border border-white/5 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
          <div className="bg-background/80 p-3 rounded-xl shadow-sm border border-border">
            {insights.netAmount >= 0 ? (
              <TrendingUp className="w-6 h-6 text-emerald-500" />
            ) : (
              <TrendingDown className="w-6 h-6 text-rose-500" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">Net Flow & Savings</p>
            <p className={`text-xl font-extrabold tracking-tight ${insights.netAmount >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
              {insights.netAmount >= 0 ? "+" : ""}${insights.netAmount.toLocaleString()}
            </p>
            <p className="text-sm font-bold text-foreground mt-1">
              {insights.savingsRate}% <span className="text-muted-foreground font-normal">Saved</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
