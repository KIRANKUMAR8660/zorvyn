import React from 'react';
import Header from './components/Header';
import StatsRow from './components/StatsRow';
import BalanceTrendChart from './components/BalanceTrendChart';
import SpendingBreakdownChart from './components/SpendingBreakdownChart';
import TransactionsList from './components/TransactionsList';
import InsightsPanel from './components/InsightsPanel';
import CookieConsent from './components/CookieConsent';
import QuickAddTransaction from './components/QuickAddTransaction';

function App() {
  return (
    <div className="min-h-screen transition-colors duration-300 bg-linear-to-br from-pink-50 via-amber-50 to-rose-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-gray-100 p-4 font-sans sm:p-6 lg:p-8">
      <div className="max-w-[1280px] mx-auto">
        <Header />
        
        <StatsRow />
        
        <QuickAddTransaction />
        
        <div className="flex flex-col lg:flex-row gap-6 mb-6 lg:h-[420px]">
          <TransactionsList />
          <InsightsPanel />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <BalanceTrendChart />
          <SpendingBreakdownChart />
        </div>
      </div>
      
      <CookieConsent />

      {/* Footer */}
      <footer className="mt-8 pb-6 text-center">
        <p className="text-xs text-gray-400 dark:text-gray-600 font-medium tracking-wider">
          © {new Date().getFullYear()} <span className="text-amber-500 font-bold">Finance</span><span className="text-pink-500 font-bold">.</span> &nbsp;All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
