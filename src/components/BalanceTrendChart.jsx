import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinance } from '../context/FinanceContext';

export default function BalanceTrendChart() {
  const { transactions } = useFinance();

  const { data, totalExpenses } = useMemo(() => {
    // Group transactions by date and accumulate total expenses
    const grouped = {};
    let totalExpenses = 0;
    transactions.forEach(tx => {
      if (!grouped[tx.date]) {
        grouped[tx.date] = { name: tx.date, income: 0, expenses: 0 };
      }
      const amount = Math.abs(parseFloat(tx.amount.replace(/[^0-9.-]+/g, "")));
      if (tx.type === 'income') {
        grouped[tx.date].income += amount;
      } else {
        grouped[tx.date].expenses += amount;
        totalExpenses += amount;
      }
    });

    const arr = Object.values(grouped).reverse();
    return { data: arr, totalExpenses };
  }, [transactions]);

  const formatCurrency = (val) =>
    val >= 1000
      ? `$${(val / 1000).toFixed(1)}k`
      : `$${val.toFixed(2)}`;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-[0_2px_10px_-3px_rgba(244,114,182,0.15)] dark:shadow-none flex-1 min-w-0 transition-colors">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-gray-400 text-xs font-bold tracking-wider uppercase mb-1">Overview</h2>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight transition-colors">Balance Trend</h3>
          {/* Total Expenses badge */}
          <div className="flex items-center gap-1.5 mt-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Expenses:</span>
            <span className="text-xs font-extrabold text-red-500 tracking-tight">{formatCurrency(totalExpenses)}</span>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-xs font-semibold text-gray-600 dark:text-gray-300 transition-colors">
          <div className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-pink-400 mr-2"></span> Income
          </div>
          <div className="flex items-center">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span> 
            Expenses
          </div>
        </div>
      </div>
      
      {data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 min-h-[250px]">
          <p className="text-sm font-semibold">No data for trend yet.</p>
        </div>
      ) : (
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f472b6" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#f472b6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#9ca3af' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickFormatter={(value) => `$${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="income" stroke="#f472b6" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
              <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpenses)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
