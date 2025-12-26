
import React, { useState } from 'react';
import { Transaction, Category, BudgetConfig } from '../types';

interface Props {
  transactions: Transaction[];
  categories: Category[];
  budget: BudgetConfig;
  onUpdateBudget: (b: BudgetConfig) => void;
}

const Budget: React.FC<Props> = ({ transactions, categories, budget, onUpdateBudget }) => {
  const [editingIncome, setEditingIncome] = useState(budget.income.toString());

  const handleIncomeUpdate = () => {
    const val = parseFloat(editingIncome.replace(',', '.'));
    if (!isNaN(val)) {
      onUpdateBudget({
        income: val,
        splits: {
          needs: val * 0.5,
          wants: val * 0.3,
          savings: val * 0.2
        }
      });
    }
  };

  const spentNeeds = 1850; 
  const spentWants = 640;
  const spentSavings = 150;

  const formatBRL = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="flex flex-col gap-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">Meta de Orçamento Mensal</h1>
          <p className="text-slate-500 dark:text-[#93adc8] text-base font-normal">Gerencie sua regra 50/30/20 com base em sua renda líquida.</p>
        </div>
        <div className="flex flex-col w-full md:w-auto min-w-[280px]">
          <label className="text-slate-500 dark:text-[#93adc8] text-sm font-medium pb-2">Renda Líquida Mensal</label>
          <div className="flex items-stretch rounded-lg group focus-within:ring-2 focus-within:ring-primary/50 transition-all overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-center px-4 bg-slate-50 dark:bg-surface-dark text-slate-500">
              <span className="text-lg font-medium">R$</span>
            </div>
            <input 
              className="flex-1 bg-white dark:bg-surface-dark h-12 text-lg font-bold outline-none border-none p-3"
              type="text" 
              value={editingIncome}
              onChange={(e) => setEditingIncome(e.target.value)}
            />
            <button 
              onClick={handleIncomeUpdate}
              className="bg-primary hover:bg-blue-600 text-white flex items-center justify-center px-4 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">check</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
         <BudgetOverviewBlock label="Necessidades (50%)" target={budget.splits.needs} color="bg-slate-400" />
         <BudgetOverviewBlock label="Desejos (30%)" target={budget.splits.wants} color="bg-violet-500" />
         <BudgetOverviewBlock label="Investimentos (20%)" target={budget.splits.savings} color="bg-primary" />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Detalhamento por Categoria</h2>
        <BudgetCard 
          title="Necessidades" 
          desc="Aluguel, Mercado, Contas, Saúde" 
          spent={spentNeeds} 
          target={budget.splits.needs} 
          percentage={50} 
          icon="home" 
          color="bg-slate-500" 
        />
        <BudgetCard 
          title="Desejos" 
          desc="Restaurantes, Lazer, Compras, Assinaturas" 
          spent={spentWants} 
          target={budget.splits.wants} 
          percentage={30} 
          icon="local_dining" 
          color="bg-violet-600" 
        />
        <BudgetCard 
          title="Investimentos" 
          desc="Reserva de Emergência, Ações, FIIs" 
          spent={spentSavings} 
          target={budget.splits.savings} 
          percentage={20} 
          icon="savings" 
          color="bg-primary" 
        />
      </div>
    </div>
  );
};

const BudgetOverviewBlock: React.FC<{ label: string, target: number, color: string }> = ({ label, target }) => (
  <div className={`flex flex-col gap-1 border-l-2 border-slate-200 dark:border-slate-800 pl-4`}>
    <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold">{label}</span>
    <span className="text-2xl font-bold">{target.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</span>
    <span className="text-slate-400 text-sm">Limite Sugerido</span>
  </div>
);

const BudgetCard: React.FC<{ title: string, desc: string, spent: number, target: number, percentage: number, icon: string, color: string }> = ({ title, desc, spent, target, icon, color, percentage }) => {
  const progress = Math.min((spent / target) * 100, 100);
  const isBehind = spent < target * 0.2;

  const formatBRL = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="flex flex-col md:flex-row items-stretch gap-6 rounded-xl bg-white dark:bg-surface-dark p-5 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1.5 h-full ${color}`}></div>
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${color} bg-opacity-10 text-slate-500 dark:text-white`}>
              <span className="material-symbols-outlined">{icon}</span>
            </div>
            <div>
              <h3 className="text-lg font-bold leading-tight">{title}</h3>
              <p className="text-slate-500 dark:text-[#93adc8] text-sm">{desc}</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">{percentage}%</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <span className="text-3xl font-bold">{formatBRL(spent)} <span className="text-lg text-slate-400 font-medium">/ {formatBRL(target)}</span></span>
            <span className={`text-sm font-medium ${isBehind && title === 'Investimentos' ? 'text-orange-400' : 'text-slate-400'}`}>
               {title === 'Investimentos' && isBehind ? 'Abaixo da meta' : `${formatBRL(target - spent)} restantes`}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
            <div className={`${color} h-full rounded-full transition-all duration-500`} style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
      <div className="flex md:flex-col justify-end items-end gap-3 md:border-l border-slate-100 dark:border-slate-800 md:pl-6">
         <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-[#243647] hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors border border-slate-200 dark:border-transparent">
            <span className="material-symbols-outlined text-base">edit</span>
            <span>Ajustar Categorias</span>
         </button>
      </div>
    </div>
  );
};

export default Budget;
