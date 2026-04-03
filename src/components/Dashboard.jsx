import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Wallet, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LineTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend
} from 'recharts';
import { format, parseISO } from 'date-fns';

const COLORS = ['#3b82f6', '#22c55e', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function Dashboard() {
  const transactions = useStore((state) => state.transactions);

  const { totalBalance, totalIncome, totalExpenses } = useMemo(() => {
    let income = 0;
    let expenses = 0;
    transactions.forEach(t => {
      if (t.type === 'income') income += t.amount;
      else expenses += t.amount;
    });
    return {
      totalBalance: income - expenses,
      totalIncome: income,
      totalExpenses: expenses
    };
  }, [transactions]);

  // Transform data for line chart
  const lineChartData = useMemo(() => {
    // Sort transactions by date ascending for line chart
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const dataMap = {};
    let runningBalance = 0;

    sorted.forEach(t => {
      const formattedDate = format(parseISO(t.date), 'MMM dd');
      if (t.type === 'income') {
        runningBalance += t.amount;
      } else {
        runningBalance -= t.amount;
      }
      dataMap[formattedDate] = runningBalance;
    });

    return Object.keys(dataMap).map(date => ({
      date,
      balance: dataMap[date]
    }));
  }, [transactions]);

  // Transform data for pie chart
  const pieChartData = useMemo(() => {
    const expensesByCategory = {};
    transactions.forEach(t => {
      if (t.type === 'expense') {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      }
    });

    return Object.entries(expensesByCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-3xl p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-colors duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-10 -mt-10 rounded-full pointer-events-none"></div>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-4 rounded-2xl text-primary">
              <Wallet className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Total Balance</p>
              <h2 className="text-3xl font-extrabold text-foreground tracking-tight">${totalBalance.toLocaleString()}</h2>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-colors duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -mr-10 -mt-10 rounded-full pointer-events-none"></div>
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500/10 p-4 rounded-2xl text-emerald-500">
              <ArrowUpRight className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Total Income</p>
              <h2 className="text-3xl font-extrabold text-emerald-500 tracking-tight">${totalIncome.toLocaleString()}</h2>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 relative overflow-hidden group hover:border-rose-500/30 transition-colors duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-3xl -mr-10 -mt-10 rounded-full pointer-events-none"></div>
          <div className="flex items-center gap-4">
            <div className="bg-rose-500/10 p-4 rounded-2xl text-rose-500">
              <ArrowDownRight className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Total Expenses</p>
              <h2 className="text-3xl font-extrabold text-rose-500 tracking-tight">${totalExpenses.toLocaleString()}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold">Balance Trend</h3>
          </div>
          <div className="h-[300px] w-full">
            {lineChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#8884d8" opacity={0.2} vertical={false} />
                  <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <LineTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                  />
                  <Line type="monotone" dataKey="balance" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">Not enough data for chart</div>
            )}
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-bold">Expenses by Category</h3>
          </div>
          <div className="h-[300px] w-full flex-1">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <PieTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                    formatter={(value) => `$${value}`}
                  />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-full flex items-center justify-center text-muted-foreground">No expenses recorded</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
