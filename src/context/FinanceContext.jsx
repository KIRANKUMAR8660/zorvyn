/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

const FinanceContext = createContext();

const initialTransactions = [
  { id: 1, name: 'Investment Return', category: 'Investment', date: 'Apr 19', amount: '+180.00', type: 'income' },
  { id: 2, name: 'Weekend Trip', category: 'Travel', date: 'Apr 18', amount: '-320.00', type: 'expense' },
  { id: 3, name: 'Clothing Store', category: 'Shopping', date: 'Apr 17', amount: '-189.00', type: 'expense' },
  { id: 4, name: 'Movie Tickets', category: 'Entertainment', date: 'Apr 16', amount: '-28.00', type: 'expense' },
  { id: 5, name: 'Internet Bill', category: 'Utilities', date: 'Apr 15', amount: '-65.00', type: 'expense' },
  { id: 6, name: 'Freelance Bonus', category: 'Freelance', date: 'Apr 14', amount: '+500.00', type: 'income' },
];

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    try {
      const stored = localStorage.getItem('zorvyn_transactions');
      return stored ? JSON.parse(stored) : initialTransactions;
    } catch {
      return initialTransactions;
    }
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('zorvyn_role') || 'admin';
  });

  // ── Shared Filter & Sort State ────────────────────────────────────────────
  const [filterType, setFilterType] = useState('All Types');
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [filterDate, setFilterDate] = useState('All Time');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [sortBy, setSortBy] = useState('Newest Date');
  const [searchTerm, setSearchTerm] = useState('');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('zorvyn_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('zorvyn_role', role);
  }, [role]);

  const addTransaction = (newTx) => {
    setTransactions((prev) => [newTx, ...prev]);
    // Snap filters so the newly added transaction is immediately visible
    setFilterType(newTx.type === 'income' ? 'Income' : 'Expense');
    setFilterCategory('All Categories');
    setFilterDate('All Time');
    setSearchTerm('');
    setSortBy('Newest Date');
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter(tx => tx.id !== id));
  };

  const toggleRole = () => {
    setRole((prev) => (prev === 'admin' ? 'viewer' : 'admin'));
  };

  return (
    <FinanceContext.Provider value={{
      transactions, setTransactions,
      addTransaction, deleteTransaction,
      role, toggleRole,
      // shared filters
      filterType, setFilterType,
      filterCategory, setFilterCategory,
      filterDate, setFilterDate,
      customStart, setCustomStart,
      customEnd, setCustomEnd,
      sortBy, setSortBy,
      searchTerm, setSearchTerm,
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
