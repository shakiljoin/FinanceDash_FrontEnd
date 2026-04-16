import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

const getInitialDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

const initialTransactions = [
  { id: uuidv4(), date: getInitialDate(15), amount: 5000, category: 'Salary', type: 'income' },
  { id: uuidv4(), date: getInitialDate(12), amount: 1200, category: 'Rent', type: 'expense' },
  { id: uuidv4(), date: getInitialDate(10), amount: 150, category: 'Food', type: 'expense' },
  { id: uuidv4(), date: getInitialDate(5), amount: 300, category: 'Utilities', type: 'expense' },
  { id: uuidv4(), date: getInitialDate(2), amount: 1000, category: 'Side Hustle', type: 'income' },
  { id: uuidv4(), date: getInitialDate(1), amount: 50, category: 'Entertainment', type: 'expense' },
];

const ADMIN_PIN = '1234';

export const useStore = create(
  persist(
    (set) => ({
      transactions: initialTransactions,
      role: 'viewer', // 'admin' | 'viewer'
      adminUnlocked: false,
      theme: 'light',
      filters: {
        search: '',
        type: 'all', // 'all' | 'income' | 'expense'
        sort: 'date-desc', // 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'
      },

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [{ id: uuidv4(), ...transaction }, ...state.transactions],
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      editTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.id === id ? { ...transaction, ...updates } : transaction
          ),
        })),

      setRole: (role) =>
        set((state) => {
          if (role === 'admin') return { role: 'admin', adminUnlocked: true };
          return { role: 'viewer', adminUnlocked: false };
        }),

      unlockAdmin: (pin) => {
        const isValid = pin === ADMIN_PIN;
        if (!isValid) return false;
        set({ role: 'admin', adminUnlocked: true });
        return true;
      },

      lockAdmin: () => set({ role: 'viewer', adminUnlocked: false }),
      
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
    }),
    {
      name: 'finance-dashboard-storage',
    }
  )
);
