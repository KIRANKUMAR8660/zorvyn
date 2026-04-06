import React from 'react';
import { ArrowUpRight, ArrowDownRight, Percent, Wallet } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export default function StatsRow() {
  const { transactions } = useFinance();

  let income = 0;
  let expenses = 0;

  transactions.forEach(tx => {
    const amount = parseFloat(tx.amount.replace(/[^0-9.-]+/g, ""));
    if (tx.type === 'income') {
      income += Math.abs(amount);
    } else {
      expenses += Math.abs(amount);
    }
  });

  const balance = income - expenses;
  const savingsPercent = income > 0 ? ((balance / income) * 100).toFixed(1) : 0;

  const formatCurrency = (val) => '$' + val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <div className="flex flex-wrap items-center gap-2 mb-8 bg-white dark:bg-slate-800 backdrop-blur-sm p-2 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm dark:shadow-none transition-colors">

      {/* Income */}
      <button className="flex-1 min-w-[120px] flex flex-col items-center py-3 px-4 rounded-lg relative group hover:bg-amber-50 dark:hover:bg-slate-700/40 transition-all focus:outline-none border-b-2 border-transparent hover:border-amber-500 dark:hover:border-amber-400">
        <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-3 mb-2 group-hover:bg-amber-500 dark:group-hover:bg-amber-500 transition-colors shadow-sm shadow-gray-300/50 dark:shadow-none">
          <img
            src="/income.png"
            alt="Income"
            className="w-6 h-6 object-contain filter brightness-0 invert"
            onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }}
          />
          <ArrowUpRight size={20} className="text-white hidden" />
        </div>
        <div className="text-[11px] font-bold text-gray-700 dark:text-gray-300 tracking-wide group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Income</div>
        <div className="text-sm font-extrabold text-gray-900 dark:text-white mt-0.5">{formatCurrency(income)}</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-[3px] bg-amber-500 rounded-full transition-all duration-300"></div>
      </button>

      <div className="w-px h-12 bg-gray-100 dark:bg-slate-700 flex-shrink-0" />

      {/* Balance */}
      <button className="flex-1 min-w-[120px] flex flex-col items-center py-3 px-4 rounded-lg relative group hover:bg-amber-50 dark:hover:bg-slate-700/40 transition-all focus:outline-none border-b-2 border-transparent hover:border-amber-500 dark:hover:border-amber-400">
        <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-3 mb-2 group-hover:bg-amber-500 dark:group-hover:bg-amber-500 transition-colors shadow-sm shadow-gray-300/50 dark:shadow-none">
          <img
            src="/income-icon-11161-512.png"
            alt="Balance"
            className="w-6 h-6 object-contain filter brightness-0 invert"
            onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }}
          />
          <Wallet size={20} className="text-white hidden" />
        </div>
        <div className="text-[11px] font-bold text-gray-700 dark:text-gray-300 tracking-wide group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Balance</div>
        <div className="text-sm font-extrabold text-gray-900 dark:text-white mt-0.5">{formatCurrency(balance)}</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-[3px] bg-amber-500 rounded-full transition-all duration-300"></div>
      </button>

      <div className="w-px h-12 bg-gray-100 dark:bg-slate-700 flex-shrink-0" />

      {/* Expenses */}
      <button className="flex-1 min-w-[120px] flex flex-col items-center py-3 px-4 rounded-lg relative group hover:bg-amber-50 dark:hover:bg-slate-700/40 transition-all focus:outline-none border-b-2 border-transparent hover:border-amber-500 dark:hover:border-amber-400">
        <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-3 mb-2 group-hover:bg-amber-500 dark:group-hover:bg-amber-500 transition-colors shadow-sm shadow-gray-300/50 dark:shadow-none">
          <img
            src="/spending.png"
            alt="Expenses"
            className="w-6 h-6 object-contain filter brightness-0 invert"
            onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }}
          />
          <ArrowDownRight size={22} className="text-white hidden" />
        </div>
        <div className="text-[11px] font-bold text-gray-700 dark:text-gray-300 tracking-wide group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Expenses</div>
        <div className="text-sm font-extrabold text-gray-900 dark:text-white mt-0.5">{formatCurrency(expenses)}</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-[3px] bg-amber-500 rounded-full transition-all duration-300"></div>
      </button>

      <div className="w-px h-12 bg-gray-100 dark:bg-slate-700 flex-shrink-0" />

      {/* Savings */}
      <button className="flex-1 min-w-[120px] flex flex-col items-center py-3 px-4 rounded-lg relative group hover:bg-amber-50 dark:hover:bg-slate-700/40 transition-all focus:outline-none border-b-2 border-transparent hover:border-amber-500 dark:hover:border-amber-400">
        <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-3 mb-2 group-hover:bg-amber-500 dark:group-hover:bg-amber-500 transition-colors shadow-sm shadow-gray-300/50 dark:shadow-none">
          <img
            src="/save-energy.png"
            alt="Savings"
            className="w-6 h-6 object-contain filter brightness-0 invert"
            onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }}
          />
          <Percent size={22} className="text-white hidden" />
        </div>
        <div className="text-[11px] font-bold text-gray-700 dark:text-gray-300 tracking-wide group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Savings</div>
        <div className="text-sm font-extrabold text-gray-900 dark:text-white mt-0.5">{savingsPercent}%</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-[3px] bg-amber-500 rounded-full transition-all duration-300"></div>
      </button>

    </div>
  );
}
