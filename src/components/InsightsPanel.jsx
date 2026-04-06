import React, { useMemo } from 'react';
import { TriangleAlert, TrendingUp, BarChart3, Lightbulb } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export default function InsightsPanel() {
  const { transactions } = useFinance();

  const insights = useMemo(() => {
    let income = 0;
    let expenses = 0;
    const groupedExp = {};
    const categories = new Set();

    transactions.forEach(tx => {
      const amount = Math.abs(parseFloat(tx.amount.replace(/[^0-9.-]+/g, "")));
      categories.add(tx.category);
      if (tx.type === 'income') {
        income += amount;
      } else {
        expenses += amount;
        groupedExp[tx.category] = (groupedExp[tx.category] || 0) + amount;
      }
    });

    const balance = income - expenses;
    const savings = income > 0 ? ((balance / income) * 100).toFixed(1) : 0;

    let topCategory = 'None';
    let maxSpend = 0;
    Object.keys(groupedExp).forEach(cat => {
      if (groupedExp[cat] > maxSpend) {
        maxSpend = groupedExp[cat];
        topCategory = cat;
      }
    });

    const numTx = transactions.length;
    const avgSize = numTx > 0 ? ((income + expenses) / numTx).toFixed(0) : 0;

    return {
      topCategory,
      maxSpend: formatCurrency(maxSpend),
      savings,
      diversity: categories.size,
      avgSize: formatCurrency(avgSize)
    };

    function formatCurrency(val) {
      return '$' + Number(val).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
  }, [transactions]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-[0_2px_10px_-3px_rgba(251,191,36,0.15)] dark:shadow-none w-full lg:w-80 flex-shrink-0 flex flex-col transition-colors">
      <div className="mb-5">
        <h2 className="text-gray-400 text-xs font-bold tracking-wider uppercase mb-1 transition-colors">Analysis</h2>
        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight transition-colors">Insights</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-1 content-start">
        {/* Top Spend */}
        <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 transition-colors">
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 tracking-wider uppercase mb-3 transition-colors group">
            <div className="p-1.5 bg-gray-900 dark:bg-gray-700 rounded-md group-hover:bg-amber-500 transition-colors">
              <img
                src="/money (1).png"
                alt="Top Spend"
                className="w-3 h-3 object-contain filter brightness-0 invert"
                onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='inline'; }}
              />
              <TriangleAlert size={12} className="text-white hidden" strokeWidth={2.5} />
            </div>
            <span>Top Spend</span>
          </div>
          <div className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1 transition-colors truncate" title={insights.topCategory}>{insights.topCategory}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium transition-colors">{insights.maxSpend}</div>
        </div>

        {/* Savings */}
        <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 transition-colors">
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 tracking-wider uppercase mb-3 transition-colors group">
            <div className="p-1.5 bg-gray-900 dark:bg-gray-700 rounded-md group-hover:bg-amber-500 transition-colors">
              <TrendingUp size={12} className="text-white" strokeWidth={2.5} />
            </div>
            <span>Savings</span>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1 transition-colors">{insights.savings}%</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium transition-colors">{Number(insights.savings) >= 20 ? 'Healthy' : 'Needs attention'}</div>
        </div>

        {/* Avg Size */}
        <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 transition-colors">
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 tracking-wider uppercase mb-3 transition-colors group">
            <div className="p-1.5 bg-gray-900 dark:bg-gray-700 rounded-md group-hover:bg-amber-500 transition-colors">
              <img
                src="/bar-graph.png"
                alt="Avg Tx"
                className="w-3 h-3 object-contain filter brightness-0 invert"
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline'; }}
              />
              <BarChart3 size={12} className="text-white hidden" strokeWidth={2.5} />
            </div>
            <span>Avg Tx</span>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1 transition-colors">{insights.avgSize}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium transition-colors">Per entry</div>
        </div>

        {/* Diversity */}
        <div className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 transition-colors">
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 tracking-wider uppercase mb-3 transition-colors group">
            <div className="p-1.5 bg-gray-900 dark:bg-gray-700 rounded-md group-hover:bg-amber-500 transition-colors">
              <Lightbulb size={12} className="text-white" strokeWidth={2.5} />
            </div>
            <span>Diversity</span>
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-1 transition-colors">{insights.diversity}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium transition-colors">Categories</div>
        </div>
      </div>
    </div>
  );
}
