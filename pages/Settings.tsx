
import React from 'react';
import { UserSettings, Category } from '../types';

interface Props {
  settings: UserSettings;
  onUpdateSettings: (s: UserSettings) => void;
  categories: Category[];
  onUpdateCategories: (cats: Category[]) => void;
  onReset: () => void;
}

const Settings: React.FC<Props> = ({ settings, onUpdateSettings, categories, onUpdateCategories, onReset }) => {
  return (
    <div className="flex flex-col gap-8 pb-20 max-w-[640px] mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-slate-500 dark:text-[#93adc8]">Gerencie suas preferências e configuração de carteira.</p>
      </div>

      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-bold px-1">Aparência</h3>
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-base font-bold leading-tight">Tema do Aplicativo</p>
            <p className="text-slate-500 dark:text-[#93adc8] text-sm">Alternar entre modo claro e escuro.</p>
          </div>
          <div className="flex items-center bg-slate-100 dark:bg-[#243647] rounded-lg p-1">
            <button 
              onClick={() => onUpdateSettings({ ...settings, theme: 'light' })}
              className={`p-2 rounded-md transition-all ${settings.theme === 'light' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
            >
              <span className="material-symbols-outlined text-[20px]">light_mode</span>
            </button>
            <button 
              onClick={() => onUpdateSettings({ ...settings, theme: 'dark' })}
              className={`p-2 rounded-md transition-all ${settings.theme === 'dark' ? 'bg-primary text-white shadow-sm' : 'text-slate-500'}`}
            >
              <span className="material-symbols-outlined text-[20px]">dark_mode</span>
            </button>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-lg font-bold px-1">Configuração da Carteira</h3>
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-500 dark:text-[#93adc8]">Saldo Inicial da Carteira</label>
            <div className="relative flex items-center">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400">account_balance_wallet</span>
              </div>
              <input 
                className="w-full bg-slate-50 dark:bg-[#111a22] border border-slate-200 dark:border-[#344d65] text-slate-900 dark:text-white rounded-lg py-3 pl-12 pr-4 focus:ring-1 focus:ring-primary outline-none font-medium"
                type="number" 
                value={settings.initialBalance}
                onChange={(e) => onUpdateSettings({ ...settings, initialBalance: parseFloat(e.target.value) || 0 })}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <span className="text-slate-400 font-bold">BRL</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium text-sm shadow-lg shadow-primary/20">
              Salvar Alterações
            </button>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold">Categorias</h3>
          <button className="text-primary hover:text-primary/80 text-sm font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nova Categoria
          </button>
        </div>
        <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          {categories.slice(0, 4).map(cat => (
            <div key={cat.id} className="group flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-[#1e293b] transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`size-10 rounded-full flex items-center justify-center bg-primary/10 text-primary`}>
                  <span className="material-symbols-outlined">{cat.icon}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{cat.name}</span>
                  <span className="text-xs text-slate-500 capitalize">{cat.type === 'income' ? 'Receita' : 'Despesa'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-slate-400 hover:text-primary">
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                </button>
                <button className="p-2 text-slate-400 hover:text-red-500">
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4 pt-4">
        <div className="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-base font-bold text-red-700 dark:text-red-400">Zona de Perigo</p>
            <p className="text-red-600/70 dark:text-red-400/70 text-sm">Excluir permanentemente todos os dados locais.</p>
          </div>
          <button 
            onClick={() => { if(confirm('Deseja resetar todos os dados? Esta ação não pode ser desfeita.')) onReset(); }}
            className="bg-white dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 px-4 py-2 rounded-lg font-medium text-sm hover:bg-red-50 transition-colors"
          >
            Limpar Dados
          </button>
        </div>
      </section>
    </div>
  );
};

export default Settings;
