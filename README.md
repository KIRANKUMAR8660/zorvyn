# Zorvyn Finance Dashboard

A comprehensive, fully-functional modern web dashboard for tracking personal or enterprise finances. Built as an interactive frontend project displaying advanced UI techniques and dynamic state management.

## 🚀 Features

### 1. Dashboard Overview
- **Summary Cards**: Track Total Balance, Income, Expenses, and Savings automatically aggregated.
- **Dynamic Data Visualization**:
  - `Balance Trend`: Dynamic Area Chart depicting transaction volume sequentially over time.
  - `Spending Breakdown`: Dynamic Pie Chart displaying the proportion of spending by category.

### 2. Transactions Section
- **Live Transaction Feed**: Lists transactions by date, amount, category, and type (income/expense).
- **Interactive Controls**:
  - Semantic Search filtering by name, category, or amount.
  - Type Filter (Income vs Expenses).
  - Category Filter dynamically generated from available transaction history.
- **Data Export**: Export your currently filtered view directly to CSV.

### 3. Basic Role-Based UI
- Toggle between **Admin** and **Viewer** roles instantly from the top-right Header dropdown.
- **Viewer**: Read-only access to charts, stats, and search.
- **Admin**: Full control to Add and Delete transactions individually. 

### 4. Smart Insights Panel 
- **Top Spend Category**: Identifies your highest spending bracket dynamically.
- **Savings Analysis**: Automatically determines metric health and tracks savings %.
- **Average Size & Diversity**: Summarizes the number of categories and the average transaction volume dynamically.

### 5. Seamless State Management (Context + LocalStorage)
- Uses React Context (`FinanceContext`) to share transaction activity, app roles, and user decisions globally.
- Features **Data Persistence**: Reloading the page safely preserves all customized transactions and active role configurations using Local Storage.

### Optional Enhancements Evaluated:
- ✅ High-End UI with Figma-styled Custom Cursor.
- ✅ Graceful Empty States for all widgets.
- ✅ Export Functionality (CSV).
- ✅ Persistent App State & Memory.
- ✅ Fully Responsive layout tailored for mobile & super-widescreens.

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)

## ⚡ Getting Started

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Visit Locally**
   Open `http://localhost:5173/` in your browser.

## 🎨 Theme Support

Zorvyn relies on OS-level preferences to alternate intelligently between light and dark modes, but this can be overriden using the sun/moon toggle in the dashboard header!
