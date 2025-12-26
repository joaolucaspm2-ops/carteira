
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Transaction, Category, UserSettings, BudgetConfig, TransactionType } from './types';
import { DEFAULT_CATEGORIES, AVATAR_URL } from './constants';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Budget from './pages/Budget';
import Settings from './pages/Settings';
import TransactionModal from './components/TransactionModal';

const STORAGE_KEY = 'fintrack_data';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [settings, setSettings] = useState<UserSettings>({
    name: 'Alex Morgan',
    initialBalance: 12500,
    theme: 'dark'
  });
  const [budget, setBudget] = useState<BudgetConfig>({
    income: 4200,
    splits: { needs: 2100, wants: 1260, savings: 840 }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTransactions(parsed.transactions || []);
        setCategories(parsed.categories || DEFAULT_CATEGORIES);
        setSettings(parsed.settings || settings);
        setBudget(parsed.budget || budget);
      } catch (e) {
        console.error("Erro ao carregar dados", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ transactions, categories, settings, budget }));
  }, [transactions, categories, settings, budget]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...t, id: Date.now().toString() };
    setTransactions(prev => [newTransaction, ...prev]);
    setIsModalOpen(false);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <HashRouter>
      <div className={`${settings.theme === 'dark' ? 'dark' : ''} flex h-screen overflow-hidden`}>
        <div className="flex w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
          <Sidebar settings={settings} />
          
          <main className="flex-1 overflow-y-auto relative">
            <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-[#111a22] sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded bg-primary text-white">
                  <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                </div>
                <span className="font-bold text-lg">FinTrack</span>
              </div>
              <button className="p-2 text-slate-600 dark:text-white" onClick={() => setIsModalOpen(true)}>
                <span className="material-symbols-outlined">add</span>
              </button>
            </header>

            <div className="max-w-[1000px] mx-auto p-4 md:p-8">
              <Routes>
                <Route path="/" element={
                  <Dashboard 
                    transactions={transactions} 
                    categories={categories} 
                    settings={settings} 
                    budget={budget}
                    onAddClick={() => setIsModalOpen(true)}
                  />
                } />
                <Route path="/history" element={
                  <History 
                    transactions={transactions} 
                    categories={categories} 
                    onDelete={deleteTransaction}
                  />
                } />
                <Route path="/budget" element={
                  <Budget 
                    transactions={transactions} 
                    categories={categories} 
                    budget={budget}
                    onUpdateBudget={setBudget}
                  />
                } />
                <Route path="/settings" element={
                  <Settings 
                    settings={settings} 
                    onUpdateSettings={setSettings}
                    categories={categories}
                    onUpdateCategories={setCategories}
                    onReset={() => {
                      setTransactions([]);
                      setCategories(DEFAULT_CATEGORIES);
                      setSettings({ name: 'Alex Morgan', initialBalance: 12500, theme: 'dark' });
                    }}
                  />
                } />
              </Routes>
            </div>
          </main>

          {isModalOpen && (
            <TransactionModal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
              categories={categories}
              onSave={addTransaction}
            />
          )}
        </div>
      </div>
    </HashRouter>
  );
};

const Sidebar: React.FC<{ settings: UserSettings }> = ({ settings }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-[#111a22] border-r border-slate-200 dark:border-slate-800 h-full flex-shrink-0 transition-all duration-300">
      <div className="flex flex-col h-full p-4 justify-between">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3 px-2">
            <div className="flex items-center justify-center w-8 h-8 rounded bg-primary text-white">
              <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
            </div>
            <div>
              <h1 className="text-base font-bold leading-none tracking-tight">FinTrack</h1>
              <p className="text-xs text-slate-500 dark:text-[#93adc8] mt-1">Minha Carteira</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <NavLink to="/" icon="dashboard" label="Painel" active={isActive('/')} />
            <NavLink to="/history" icon="receipt_long" label="Transações" active={isActive('/history')} />
            <NavLink to="/budget" icon="pie_chart" label="Orçamento" active={isActive('/budget')} />
            <NavLink to="/settings" icon="settings" label="Configurações" active={isActive('/settings')} />
          </nav>
        </div>

        <div className="flex items-center gap-3 px-3 py-3 mt-auto rounded-lg hover:bg-slate-100 dark:hover:bg-[#1e2a36] cursor-pointer transition-colors group">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
            <img alt="Usuário" className="w-full h-full object-cover" src={AVATAR_URL} />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium leading-none">{settings.name}</p>
            <p className="text-xs text-slate-500 dark:text-[#93adc8] mt-1">Plano Pro</p>
          </div>
          <span className="material-symbols-outlined text-slate-400 text-[18px] ml-auto group-hover:text-red-500 transition-colors">logout</span>
        </div>
      </div>
    </aside>
  );
};

const NavLink: React.FC<{ to: string, icon: string, label: string, active: boolean }> = ({ to, icon, label, active }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
      active 
        ? 'bg-primary/10 text-primary dark:bg-[#243647] dark:text-white' 
        : 'text-slate-600 dark:text-[#93adc8] hover:bg-slate-100 dark:hover:bg-[#1e2a36]'
    }`}
  >
    <span className={`material-symbols-outlined text-[20px] ${active ? 'filled' : ''}`}>{icon}</span>
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

export default App;
