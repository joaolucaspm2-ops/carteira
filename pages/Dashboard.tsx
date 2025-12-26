
import React from 'react';
import { Transaction, Category, UserSettings, BudgetConfig } from '../types';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

interface Props {
  transactions: Transaction[];
  categories: Category[];
  settings: UserSettings;
  budget: BudgetConfig;
  onAddClick: () => void;
}

const Dashboard: React.FC<Props> = ({ transactions, categories, settings, budget, onAddClick }) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = settings.initialBalance + totalIncome - totalExpense;

  const chartData = [
    { name: '1', amount: 45 },
    { name: '5', amount: 70 },
    { name: '10', amount: 30 },
    { name: '15', amount: 85 },
    { name: '20', amount: 55 },
    { name: '25', amount: 40 },
    { name: 'Hoje', amount: 20 },
  ];

  const formatCurrency = (val: number) => 
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="flex flex-col gap-6 md:gap-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">Painel</h1>
          <p className="text-slate-500 dark:text-[#93adc8] text-base font-normal">Bem-vindo de volta, {settings.name.split(' ')[0]}</p>
        </div>
        <button 
          onClick={onAddClick}
          className="flex items-center gap-2 bg-primary hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-lg transition-colors shadow-lg shadow-blue-500/20"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span className="text-sm">Nova Transação</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 flex flex-col">
          <div className="bg-white dark:bg-[#243647] rounded-xl p-6 shadow-sm flex flex-col h-full justify-between gap-6 relative overflow-hidden group border border-transparent dark:border-slate-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="flex justify-between items-start z-10">
              <div>
                <p className="text-slate-500 dark:text-[#93adc8] text-sm font-medium mb-1">Saldo Total</p>
                <div className="flex items-center gap-3">
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {formatCurrency(currentBalance)}
                  </h2>
                </div>
              </div>
              <div className="bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                +12%
              </div>
            </div>
            
            <div className="z-10 mt-auto">
              <details className="group/accordion rounded-lg border border-slate-200 dark:border-[#344d65] bg-slate-50 dark:bg-[#1a2835] overflow-hidden transition-all duration-300">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-4 py-3 select-none hover:bg-slate-100 dark:hover:bg-[#203040] transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">account_balance</span>
                    <p className="text-slate-700 dark:text-white text-sm font-medium">Divisão por Contas</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-open/accordion:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-4 pb-4 pt-2 border-t border-slate-200 dark:border-[#344d65] flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      <span className="text-sm text-slate-600 dark:text-[#93adc8]">Conta Corrente</span>
                    </div>
                    <span className="text-sm font-mono font-medium text-slate-900 dark:text-white">{formatCurrency(currentBalance * 0.2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-sm text-slate-600 dark:text-[#93adc8]">Reserva / Poupança</span>
                    </div>
                    <span className="text-sm font-mono font-medium text-slate-900 dark:text-white">{formatCurrency(currentBalance * 0.8)}</span>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-white dark:bg-[#1e2a36] rounded-xl p-6 shadow-sm h-full border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Status do Orçamento</h3>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Mensal</span>
            </div>
            <div className="flex flex-col gap-5">
              <BudgetProgress label="Necessidades (50%)" current={1200} target={budget.splits.needs} color="bg-rose-500" />
              <BudgetProgress label="Desejos (30%)" current={850} target={budget.splits.wants} color="bg-amber-400" />
              <BudgetProgress label="Investimentos (20%)" current={200} target={budget.splits.savings} color="bg-primary" />
              <div className="mt-2 pt-4 border-t border-slate-100 dark:border-slate-700">
                <p className="text-xs text-center text-slate-400 dark:text-slate-500">
                  Você ainda tem <span className="text-slate-900 dark:text-white font-bold">{formatCurrency(1750)}</span> para gastar este mês.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-white dark:bg-[#1e2a36] rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Visão de Gastos</h3>
              <select className="bg-slate-50 dark:bg-[#111a22] border-none text-xs rounded px-2 py-1 text-slate-600 dark:text-slate-300 cursor-pointer focus:ring-1 focus:ring-primary">
                <option>Últimos 30 Dias</option>
                <option>Últimos 3 Meses</option>
                <option>Este Ano</option>
              </select>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(25, 127, 230, 0.1)' }}
                    formatter={(val: number) => formatCurrency(val)}
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === 'Hoje' ? '#10b981' : '#197fe6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col">
          <div className="bg-white dark:bg-[#1e2a36] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full">
            <div className="p-6 pb-2 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recentes</h3>
              <a className="text-xs font-medium text-primary hover:text-blue-400" href="#/history">Ver Tudo</a>
            </div>
            <div className="flex flex-col overflow-y-auto max-h-[300px] p-2">
              {transactions.slice(0, 5).map(t => {
                const cat = categories.find(c => c.id === t.categoryId);
                return (
                  <div key={t.id} className="group flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-[#243647] transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-[#111a22] flex items-center justify-center text-slate-500 dark:text-[#93adc8]">
                        <span className="material-symbols-outlined text-[20px]">{cat?.icon || 'payments'}</span>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[120px]">{t.description}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(t.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <p className={`text-sm font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </p>
                  </div>
                );
              })}
              {transactions.length === 0 && (
                <div className="p-8 text-center text-slate-400 italic text-sm">Nenhuma transação registrada.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BudgetProgress: React.FC<{ label: string, current: number, target: number, color: string }> = ({ label, current, target, color }) => (
  <div className="flex flex-col gap-2">
    <div className="flex justify-between text-sm">
      <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <span className="text-slate-500 dark:text-slate-400">{current.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})} / {target.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
    </div>
    <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
      <div className={`${color} h-full rounded-full transition-all duration-500`} style={{ width: `${Math.min((current / target) * 100, 100)}%` }}></div>
    </div>
  </div>
);

export default Dashboard;
