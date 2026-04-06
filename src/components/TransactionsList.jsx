import React, { useEffect, useMemo } from 'react';
import { Search, ArrowUpRight, ArrowDownRight, Trash2, X } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export default function TransactionsList() {
  const {
    transactions, deleteTransaction, role,
    filterType, setFilterType,
    filterCategory, setFilterCategory,
    filterDate, setFilterDate,
    customStart, setCustomStart,
    customEnd, setCustomEnd,
    sortBy, setSortBy,
    searchTerm, setSearchTerm,
  } = useFinance();

  const categories = useMemo(() => {
    const cats = new Set(transactions.map(tx => tx.category));
    return ['All Categories', ...Array.from(cats)].sort();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const processed = transactions.map(tx => {
      let ts = tx.timestamp;
      if (!ts) {
        if (tx.date === 'Today') ts = Date.now();
        else ts = new Date(`${tx.date} ${new Date().getFullYear()}`).getTime() || 0;
      }
      const numAmount = tx.type === 'expense'
        ? -Math.abs(parseFloat(tx.amount.replace(/[^0-9.-]+/g, "")))
        : Math.abs(parseFloat(tx.amount.replace(/[^0-9.-]+/g, "")));
      return { ...tx, timestamp: ts, numAmount };
    });

    let result = processed;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(tx =>
        tx.name.toLowerCase().includes(lower) ||
        tx.category.toLowerCase().includes(lower) ||
        tx.amount.includes(searchTerm)
      );
    }

    if (filterType !== 'All Types') {
      result = result.filter(tx => tx.type.toLowerCase() === filterType.toLowerCase());
    }

    if (filterCategory !== 'All Categories') {
      result = result.filter(tx => tx.category === filterCategory);
    }

    const now = new Date();
    if (filterDate === 'Today') {
      const startOfToday = new Date(now.setHours(0, 0, 0, 0)).getTime();
      result = result.filter(tx => tx.timestamp >= startOfToday);
    } else if (filterDate === 'This Month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
      result = result.filter(tx => tx.timestamp >= startOfMonth);
    } else if (filterDate === 'This Year') {
      const startOfYear = new Date(now.getFullYear(), 0, 1).getTime();
      result = result.filter(tx => tx.timestamp >= startOfYear);
    } else if (filterDate === 'Custom Date' && customStart && customEnd) {
      const s = new Date(customStart).getTime();
      const e = new Date(customEnd).setHours(23, 59, 59, 999);
      result = result.filter(tx => tx.timestamp >= s && tx.timestamp <= e);
    }

    if (sortBy === 'Newest Date') {
      result.sort((a, b) => b.timestamp - a.timestamp);
    } else if (sortBy === 'Oldest Date') {
      result.sort((a, b) => a.timestamp - b.timestamp);
    } else if (sortBy === 'Highest Amount') {
      result.sort((a, b) => Math.abs(b.numAmount) - Math.abs(a.numAmount));
    } else if (sortBy === 'Least Spent') {
      result.sort((a, b) => Math.abs(a.numAmount) - Math.abs(b.numAmount));
    }

    return result;
  }, [transactions, searchTerm, filterType, filterCategory, filterDate, customStart, customEnd, sortBy]);

  useEffect(() => {
    const handleExport = () => {
      const csvContent = "data:text/csv;charset=utf-8,"
        + "ID,Name,Category,Date,Amount,Type\n"
        + filteredTransactions.map(e => `${e.id},"${e.name}","${e.category}","${e.date}","${e.amount}","${e.type}"`).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "transactions_export.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const handleExportJSON = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredTransactions, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "transactions_export.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    };

    window.addEventListener('export-excel', handleExport);
    window.addEventListener('export-json', handleExportJSON);
    return () => {
      window.removeEventListener('export-excel', handleExport);
      window.removeEventListener('export-json', handleExportJSON);
    };
  }, [filteredTransactions]);

  // Check if any filter is active
  const hasActiveFilters = filterType !== 'All Types' || filterCategory !== 'All Categories' || filterDate !== 'All Time' || searchTerm;

  const clearAllFilters = () => {
    setFilterType('All Types');
    setFilterCategory('All Categories');
    setFilterDate('All Time');
    setCustomStart('');
    setCustomEnd('');
    setSortBy('Newest Date');
    setSearchTerm('');
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-[0_2px_10px_-3px_rgba(244,114,182,0.15)] dark:shadow-none flex-1 min-w-0 flex flex-col relative transition-colors">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-gray-400 text-xs font-bold tracking-wider uppercase mb-1 transition-colors">Activity</h2>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight transition-colors">Transactions</h3>
        </div>
        {/* Active filter badge */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors"
          >
            <X size={12} strokeWidth={3} />
            Clear Filters
          </button>
        )}
      </div>

      <div className="flex flex-col space-y-3 mb-6">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          {/* Search Input */}
          <div className="relative flex-1 group/search">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <div className="w-7 h-7 bg-gray-900 dark:bg-gray-700 rounded-lg flex items-center justify-center group-focus-within/search:bg-amber-500 transition-colors">
                <Search size={14} className="text-white" strokeWidth={2.5} />
              </div>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-11 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder-gray-400 dark:placeholder-gray-500 font-bold"
            />
          </div>

          <div className="flex space-x-3 overflow-x-auto pb-1 sm:pb-0">
            {/* Filter Date Dropdown */}
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 text-sm rounded-lg block px-3 py-2 font-medium outline-none cursor-pointer transition-colors"
            >
              <option>All Time</option>
              <option>Today</option>
              <option>This Month</option>
              <option>This Year</option>
              <option>Custom Date</option>
            </select>
          </div>
        </div>

        {/* Second Row of Filters */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 items-end justify-between">
          <div className="flex space-x-3 flex-wrap gap-y-3 sm:gap-y-0">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 text-sm rounded-lg block px-3 py-2 font-medium outline-none cursor-pointer transition-colors"
            >
              <option>All Types</option>
              <option>Income</option>
              <option>Expense</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 text-sm rounded-lg block px-3 py-2 font-medium outline-none cursor-pointer transition-colors truncate max-w-[140px]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-gray-400 whitespace-nowrap uppercase tracking-wider">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 text-sm rounded-lg block px-3 py-2 font-medium outline-none cursor-pointer transition-colors flex-1"
            >
              <option>Newest Date</option>
              <option>Oldest Date</option>
              <option>Highest Amount</option>
              <option>Least Spent</option>
            </select>
          </div>
        </div>

        {/* Custom Date Inputs */}
        {filterDate === 'Custom Date' && (
          <div className="flex items-center space-x-3 animate-fade-in bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30">
            <div className="flex flex-col flex-1">
              <label className="text-[10px] uppercase font-bold text-gray-500 mb-1">Start Date</label>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 text-sm rounded-md px-3 py-1.5 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="text-[10px] uppercase font-bold text-gray-500 mb-1">End Date</label>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 text-sm rounded-md px-3 py-1.5 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <div className="w-12 h-12 rounded-xl bg-gray-900 dark:bg-gray-700 flex items-center justify-center mb-3 shadow-md shadow-gray-200/50">
              <Search size={24} className="text-white" strokeWidth={3} />
            </div>
            <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">No transactions found.</p>
            <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">Try adjusting your filters.</p>
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="mt-3 text-xs font-bold text-amber-500 hover:underline">
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <ul className="space-y-4">
            {filteredTransactions.map((tx) => (
              <li key={tx.id} className="flex justify-between items-center p-3 hover:bg-amber-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors border border-transparent hover:border-amber-200 dark:hover:border-slate-700/80 group relative">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-900 dark:bg-gray-700 rounded-lg flex items-center justify-center transition-all group-hover:bg-amber-500 shadow-sm flex-shrink-0">
                    {tx.type === 'income' ? <ArrowUpRight size={18} className="text-white" strokeWidth={3} /> : <ArrowDownRight size={18} className="text-white" strokeWidth={3} />}
                  </div>
                  <div className="truncate">
                    <h4 className="text-gray-900 dark:text-white font-extrabold text-sm transition-colors truncate">{tx.name}</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-medium transition-colors truncate">{tx.category} &bull; {tx.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 flex-shrink-0">
                  <div className={`font-extrabold transition-colors ${tx.type === 'income' ? 'text-emerald-500 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {tx.amount.startsWith('+') || tx.amount.startsWith('-') ? tx.amount : (tx.type === 'income' ? '+' : '-') + '$' + tx.amount}
                  </div>

                  {role === 'admin' && (
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-700 dark:hover:text-red-400 rounded transition-all focus:opacity-100"
                      title="Delete Transaction"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
        .animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
