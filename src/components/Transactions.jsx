import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Trash2, Search, Filter, ArrowUpDown, Download, Check } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const CATEGORIES = ['Salary', 'Rent', 'Food', 'Utilities', 'Entertainment', 'Transportation', 'Healthcare', 'Side Hustle', 'Other'];

export default function Transactions() {
  const { transactions, addTransaction, deleteTransaction, role, filters, setFilters } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Local state for add form
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'Food',
    type: 'expense'
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.amount || isNaN(formData.amount)) return;
    
    addTransaction({
      date: formData.date,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type
    });
    
    setFormData(prev => ({ ...prev, amount: '' }));
    setShowAddForm(false);
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Amount', 'Category', 'Type'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSorted.map(t => `${t.date},${t.amount},${t.category},${t.type}`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAndSorted = useMemo(() => {
    return transactions
      .filter(t => {
        const matchesSearch = t.category.toLowerCase().includes(filters.search.toLowerCase()) || 
                              t.amount.toString().includes(filters.search);
        const matchesType = filters.type === 'all' || t.type === filters.type;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        switch (filters.sort) {
          case 'date-asc': return new Date(a.date) - new Date(b.date);
          case 'date-desc': return new Date(b.date) - new Date(a.date);
          case 'amount-asc': return a.amount - b.amount;
          case 'amount-desc': return b.amount - a.amount;
          default: return 0;
        }
      });
  }, [transactions, filters]);

  return (
    <div className="space-y-6">
      {/* Actions & Filters Header */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text"
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="pl-9 pr-4 py-2 w-full sm:w-48 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          
          {/* Filter Type */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <select 
              value={filters.type}
              onChange={(e) => setFilters({ type: e.target.value })}
              className="pl-9 pr-8 py-2 w-full sm:w-auto bg-background border border-border rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <select 
              value={filters.sort}
              onChange={(e) => setFilters({ sort: e.target.value })}
              className="pl-9 pr-8 py-2 w-full sm:w-auto bg-background border border-border rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button 
            onClick={handleExportCSV}
            className="flex-1 lg:flex-none flex justify-center items-center gap-2 px-4 py-2 border border-border bg-background rounded-xl text-sm font-semibold hover:bg-muted transition-colors"
          >
            <Download className="w-4 h-4" /> Export
          </button>
          
          {role === 'admin' && (
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex-1 lg:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Record
            </button>
          )}
        </div>
      </div>

      {/* Add Transaction Form (Admin) */}
      {showAddForm && role === 'admin' && (
        <div className="glass-panel p-6 rounded-2xl animate-in slide-in-from-top-4 fade-in duration-300 border-primary/20">
          <h3 className="text-lg font-bold mb-4">Add New Transaction</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Date</label>
              <input 
                type="date" required 
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Amount ($)</label>
              <input 
                type="number" step="0.01" min="0" required 
                placeholder="0.00"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none cursor-pointer"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">Type</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none cursor-pointer"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <button 
              type="submit"
              className="flex justify-center items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors shadow-sm"
            >
              <Check className="w-4 h-4" /> Save
            </button>
          </form>
        </div>
      )}

      {/* Transactions Table/List */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">Amount</th>
                {role === 'admin' && <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-center w-24">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredAndSorted.length > 0 ? (
                filteredAndSorted.map(transaction => (
                  <tr key={transaction.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {format(parseISO(transaction.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold">
                      <span className={transaction.type === 'income' ? 'text-emerald-500' : 'text-foreground'}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </span>
                    </td>
                    {role === 'admin' && (
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button 
                          onClick={() => deleteTransaction(transaction.id)}
                          className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={role === 'admin' ? 4 : 3} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <Filter className="w-8 h-8 mb-3 opacity-20" />
                      <p className="font-medium text-foreground">No transactions available</p>
                      <p className="text-sm">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
