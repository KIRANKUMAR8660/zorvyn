import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinance } from '../context/FinanceContext';

const COLORS = ['#f43f5e', '#ec4899', '#d946ef', '#8b5cf6', '#f59e0b', '#fbbf24', '#fcd34d', '#fca5a5', '#fbcfe8'];

export default function SpendingBreakdownChart() {
  const { transactions } = useFinance();

  const data = useMemo(() => {
    const expenses = transactions.filter(tx => tx.type === 'expense');
    const grouped = {};
    expenses.forEach(tx => {
      const amount = Math.abs(parseFloat(tx.amount.replace(/[^0-9.-]+/g, "")));
      grouped[tx.category] = (grouped[tx.category] || 0) + amount;
    });

    const chartData = Object.keys(grouped).map((cat, idx) => ({
      name: cat,
      value: grouped[cat],
      color: COLORS[idx % COLORS.length]
    })).sort((a, b) => b.value - a.value);

    return chartData;
  }, [transactions]);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-[0_2px_10px_-3px_rgba(244,114,182,0.15)] dark:shadow-none w-full lg:w-80 flex-shrink-0 flex flex-col transition-colors">
      <div className="mb-4">
        <h2 className="text-gray-400 text-xs font-bold tracking-wider uppercase mb-1">Breakdown</h2>
        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight transition-colors">Spending</h3>
      </div>
      
      {data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 min-h-[200px]">
          <p className="text-sm font-semibold">No expenses yet.</p>
        </div>
      ) : (
        <>
          <div className="h-[200px] w-full flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  itemStyle={{ color: '#1f2937', fontWeight: 600, fontSize: '13px' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                  formatter={(value) => `$${value}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <ul className="space-y-3">
              {data.map((item, index) => {
                const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
                return (
                  <li key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-700 dark:text-gray-300 font-semibold transition-colors">
                      <span 
                        className="w-2.5 h-2.5 rounded-full mr-3" 
                        style={{ backgroundColor: item.color }}
                      ></span>
                      {item.name}
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-400 text-xs mr-3 font-medium">{percentage}%</span>
                      <span className="font-extrabold text-gray-900 dark:text-white w-12 text-right transition-colors">${item.value}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af; 
        }
      `}</style>
    </div>
  );
}
