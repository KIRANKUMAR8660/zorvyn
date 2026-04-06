import React, { useState, useEffect } from 'react';
import { Moon, Sun, Download, Shield, FileText, Code, FileSpreadsheet, ChevronDown, Eye } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

export default function Header() {
  const [isDark, setIsDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [isExportOpen, setIsExportOpen] = useState(false);
  const { role, toggleRole } = useFinance();

  // Sync dark class to <html> whenever isDark changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Listen for OS-level theme changes and auto-update
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleExportJSON = () => {
    window.dispatchEvent(new Event('export-json'));
    setIsExportOpen(false);
  };

  const handleExportExcel = () => {
    window.dispatchEvent(new Event('export-excel'));
    setIsExportOpen(false);
  };

  return (
    <header className="flex flex-col sm:flex-row items-center sm:items-end justify-between py-6 space-y-6 sm:space-y-0">
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left w-full sm:w-auto">
        {/* Logo Image */}
        <img 
          src="/Modern%20finance%20logo%20with%20vibrant%20gradient.png" 
          alt="Finance Logo" 
          className="w-16 h-16 object-contain flex-shrink-0 hover:scale-105 transition-transform drop-shadow-lg"
        />

        <div className="flex flex-col items-center sm:items-start">
          <div className="text-gray-400 dark:text-gray-500 text-xs font-semibold tracking-wider mb-1 uppercase">Dashboard</div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-baseline transition-colors">
            Finance<span className="relative inline-flex items-center leading-[0]">
              <span className="text-amber-500 text-5xl animate-pulse">.</span>
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">Track income, expenses, and financial insights at a glance.</p>
        </div>
      </div>

      <div className="flex items-start justify-center sm:justify-end space-x-5 md:space-x-8 w-full sm:w-auto">
        
        {/* Toggle Theme */}
        <div className="flex flex-col items-center relative z-10">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="w-10 h-10 flex flex-shrink-0 items-center justify-center bg-gray-900 dark:bg-gray-800 rounded-lg text-white hover:bg-amber-500 dark:hover:bg-amber-500 transition-all shadow-sm shadow-gray-200/50 dark:shadow-none outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
          >
            {isDark ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
          </button>
          <span className="whitespace-nowrap text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-2 uppercase tracking-widest text-center">
            Theme
          </span>
        </div>

        {/* Export Data */}
        <div className="flex flex-col items-center relative z-20">
          <button 
            onClick={() => setIsExportOpen(!isExportOpen)}
            className="w-10 h-10 flex flex-shrink-0 items-center justify-center bg-gray-900 dark:bg-gray-800 rounded-lg text-white hover:bg-amber-500 dark:hover:bg-amber-500 transition-all shadow-sm shadow-gray-200/50 dark:shadow-none outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
          >
            <Download size={18} strokeWidth={2.5} />
          </button>
          <span className="whitespace-nowrap text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-2 uppercase tracking-widest text-center">
            Export
          </span>

          {isExportOpen && (
            <div className="absolute right-0 top-12 mt-2 w-48 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-lg shadow-pink-100/20 dark:shadow-none overflow-hidden z-50">
              <div className="py-1">
                <button
                  onClick={handleExportJSON}
                  className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-slate-700/50 hover:text-amber-600 dark:hover:text-amber-400 group transition-colors text-left"
                >
                  <div className="p-1.5 bg-gray-900 dark:bg-gray-700 rounded-md group-hover:bg-amber-500 transition-colors">
                    <Code size={14} className="text-white" strokeWidth={2.5} />
                  </div>
                  <span className="font-bold">Export as JSON</span>
                </button>
                <button
                  onClick={handleExportExcel}
                  className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-slate-700/50 hover:text-amber-600 dark:hover:text-amber-400 group transition-colors text-left"
                >
                  <div className="p-1.5 bg-gray-900 dark:bg-gray-700 rounded-md group-hover:bg-amber-500 transition-colors">
                    <FileSpreadsheet size={14} className="text-white" strokeWidth={2.5} />
                  </div>
                  <span className="font-bold">Export as CSV</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Role */}
        <div className="flex flex-col items-center relative z-10">
          <button 
            onClick={toggleRole}
            className="w-10 h-10 flex flex-shrink-0 items-center justify-center bg-gray-900 dark:bg-gray-800 rounded-lg text-white hover:bg-amber-500 dark:hover:bg-amber-500 transition-all shadow-sm shadow-gray-200/50 dark:shadow-none outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
          >
            {/* Fixed-size icon wrapper — prevents layout shift on role toggle */}
            <span className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
              {role === 'admin' ? (
                <img
                  src="/profile.png"
                  alt="Admin"
                  className="w-5 h-5 object-contain filter brightness-0 invert"
                  onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
                />
              ) : (
                <Eye size={18} strokeWidth={2.5} className="flex-shrink-0" />
              )}
            </span>
          </button>
          <span className="whitespace-nowrap text-[10px] font-bold text-gray-400 dark:text-gray-500 mt-2 uppercase tracking-widest text-center">
            {role === 'admin' ? 'Admin' : 'View Only'}
          </span>
         </div>
      </div>
    </header>
  );
}
