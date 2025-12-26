
import React, { useState } from 'react';
import { Transaction, Category } from '../types';

interface Props {
  transactions: Transaction[];
  categories: Category[];
  onDelete: (id: string) => void;
}

const History: React.FC<Props> = ({ transactions, categories, onDelete }) => {
  const [filter, setFilter] = useState('');

  const filtered = transactions.filter(t => 
    t.description.toLowerCase().includes(filter.toLowerCase()) ||
    categories.find(c => c.id === t.categoryId)?.name.toLowerCase().includes(filter.toLowerCase())
  );

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const net = totalIncome - totalExpense;

  const formatBRL = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="flex flex-col gap-6 pb-20">
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm z-10 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-lg bg-primary/20 text-primary">
            <span className="material-symbols-outlined text-[24px]">receipt_long</span>
          </div>
          <h2 className="text-2xl font-bold">Histórico de Transações</h2>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2">
           <div className="relative flex-1 sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
              />
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <StatCard label="Total Receitas" value={totalIncome} color="text-emerald-500" icon="arrow_upward" />
        <StatCard label="Total Despesas" value={totalExpense} color="text-rose-500" icon="arrow_downward" />
        <StatCard label="Saldo Líquido" value={net} color="text-primary" icon="account_balance" />
      </div>

      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-surface-dark rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
            <span className="material-symbols-outlined text-slate-400 text-5xl mb-4">history</span>
            <p className="text-slate-500">Nenhuma transação encontrada com esses critérios.</p>
          </div>
        ) : (
          filtered.map(t => {
            const cat = categories.find(c => c.id === t.categoryId);
            return (
              <div key={t.id} className="group relative flex items-center justify-between p-4 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center shrink-0 size-12 rounded-full bg-slate-100 dark:bg-surface-highlight text-slate-500">
                    <span className="material-symbols-outlined">{cat?.icon || 'payments'}</span>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-base font-bold leading-none mb-1">{t.description}</p>
                    <p className="text-slate-500 text-sm font-medium">{cat?.name || 'Sem Categoria'} • {new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className={`text-base font-bold tabular-nums ${t.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatBRL(t.amount)}
                  </p>
                  <button 
                    onClick={() => onDelete(t.id)}
                    className="sm:opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string, value: number, color: string, icon: string }> = ({ label, value, color, icon }) => (
  <div className="flex flex-col gap-1 p-5 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 shadow-sm">
    <div className="flex items-center gap-2 mb-1">
      <span className={`material-symbols-outlined ${color} text-[20px]`}>{icon}</span>
      <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">{label}</p>
    </div>
    <p className="text-2xl font-bold tracking-tight">{value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
  </div>
);

export default History;
