import React, { useState } from 'react';
import { Plus, X, DollarSign, Tag, LayoutList, CheckCircle } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export default function QuickAddTransaction() {
  const [isOpen, setIsOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: '', amount: '', type: 'expense' });
  const { addTransaction, role } = useFinance();

  if (role === 'viewer') {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return;
    const now = new Date();
    const newTx = {
      id: Date.now(),
      name: formData.name,
      category: formData.category || 'General',
      date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      timestamp: now.getTime(),
      amount: formData.type === 'expense' ? `-${formData.amount}` : `+${formData.amount}`,
      type: formData.type,
    };
    addTransaction(newTx); // context also snaps filters automatically
    setJustAdded({ name: formData.name, type: formData.type });
    setFormData({ name: '', category: '', amount: '', type: 'expense' });
    setIsOpen(false);
    setTimeout(() => setJustAdded(null), 4000);
  };

  return (
    <div className="mb-6">
      {/* Success banner linking to Activity Transactions */}
      {justAdded && (
        <div className="flex items-center gap-3 mb-3 px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl animate-fade-in">
          <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            <span className="font-extrabold">&ldquo;{justAdded.name}&rdquo;</span> added &mdash; Activity Transactions is now filtered to show your {justAdded.type}s.
          </p>
          <button onClick={() => setJustAdded(null)} className="ml-auto text-emerald-400 hover:text-emerald-600 transition-colors">
            <X size={14} />
          </button>
        </div>
      )}
      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      {!isOpen ? (
        /* Collapsed: Prompt bar */
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center gap-3 px-5 py-4 rounded-xl bg-white dark:bg-slate-800 border border-dashed border-gray-300 dark:border-slate-600 text-left group hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-md hover:shadow-gray-100/50 dark:hover:shadow-none transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-gray-900 dark:bg-gray-700 flex items-center justify-center shadow-sm shadow-gray-200 group-hover:bg-amber-500 transition-all flex-shrink-0 group-hover:scale-110">
            <Plus size={16} strokeWidth={3} className="text-white" />
          </div>
          <span className="text-sm font-bold text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
            Add a new transaction...
          </span>
          <span className="ml-auto text-[10px] font-bold tracking-widest uppercase text-gray-300 dark:text-gray-600 hidden sm:block">
            Quick Add
          </span>
        </button>
      ) : (
        /* Expanded: Inline form */
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-lg shadow-gray-100/30 dark:shadow-none p-4 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gray-900 dark:bg-gray-700 flex items-center justify-center shadow-sm">
                <Plus size={14} strokeWidth={3} className="text-white" />
              </div>
              <h3 className="font-extrabold text-gray-900 dark:text-white text-sm">Add Transaction</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex flex-wrap gap-3 items-end">
            {/* Name */}
            <div className="flex-1 min-w-[140px]">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Name</label>
              <div className="relative group/input">
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-900 dark:bg-gray-700 rounded-md flex items-center justify-center group-focus-within/input:bg-amber-500 transition-colors">
                  <LayoutList size={12} strokeWidth={2.5} className="text-white" />
                </div>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Groceries"
                  className="w-full pl-10 pr-3 py-2 text-sm bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder-gray-400"
                />
              </div>
            </div>

            {/* Amount */}
            <div className="w-32">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Amount</label>
              <div className="relative group/input">
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-900 dark:bg-gray-700 rounded-md flex items-center justify-center group-focus-within/input:bg-amber-500 transition-colors">
                  <DollarSign size={12} strokeWidth={2.5} className="text-white" />
                </div>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full pl-10 pr-3 py-2 text-sm bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder-gray-400"
                />
              </div>
            </div>

            {/* Category */}
            <div className="flex-1 min-w-[120px]">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Category</label>
              <div className="relative group/input">
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-900 dark:bg-gray-700 rounded-md flex items-center justify-center group-focus-within/input:bg-amber-500 transition-colors">
                  <Tag size={12} strokeWidth={2.5} className="text-white" />
                </div>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Food"
                  className="w-full pl-10 pr-3 py-2 text-sm bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder-gray-400"
                />
              </div>
            </div>

            {/* Type */}
            <div className="w-32">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-bold"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="px-5 py-2 bg-gray-900 dark:bg-gray-800 hover:bg-amber-500 dark:hover:bg-amber-500 text-white text-sm font-bold rounded-lg shadow-md shadow-gray-200/50 dark:shadow-none transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Plus size={15} strokeWidth={3} />
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
