
import React, { useState } from 'react';
import { Category, TransactionType } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSave: (t: any) => void;
}

const TransactionModal: React.FC<Props> = ({ isOpen, onClose, categories, onSave }) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!amount || !categoryId || !description) return;
    onSave({
      type,
      amount: parseFloat(amount),
      categoryId,
      date,
      description
    });
  };

  if (!isOpen) return null;

  const filteredCategories = categories.filter(c => c.type === type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-[520px] bg-white dark:bg-surface-dark rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        <header className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <button onClick={onClose} className="text-slate-500 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
          <h2 className="text-lg font-bold">Nova Transação</h2>
          <div className="w-6"></div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex p-1 bg-slate-100 dark:bg-[#111a22] rounded-lg">
            <button 
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === 'income' ? 'bg-white dark:bg-background-dark text-primary shadow-sm' : 'text-slate-500'}`}
              onClick={() => setType('income')}
            >Receita</button>
            <button 
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${type === 'expense' ? 'bg-white dark:bg-background-dark text-primary shadow-sm' : 'text-slate-500'}`}
              onClick={() => setType('expense')}
            >Despesa</button>
          </div>

          <div className="flex flex-col items-center justify-center py-4">
            <label className="text-sm font-medium text-slate-500 mb-2">Valor da transação</label>
            <div className="flex items-center">
              <span className="text-3xl font-bold text-slate-400 mr-2">R$</span>
              <input 
                autoFocus 
                className="bg-transparent border-none text-center text-5xl font-bold text-slate-900 dark:text-white focus:ring-0 p-0 w-48"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-500">Data</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">calendar_today</span>
                <input 
                  type="date"
                  className="w-full bg-slate-50 dark:bg-[#111a22] border border-slate-200 dark:border-slate-800 rounded-lg py-3 pl-10 pr-4 text-sm"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-500">Categoria</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">category</span>
                <select 
                  className="w-full bg-slate-50 dark:bg-[#111a22] border border-slate-200 dark:border-slate-800 rounded-lg py-3 pl-10 pr-4 text-sm appearance-none"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">Select</option>
                  {filteredCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-500">Descrição</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute top-3 left-3 text-slate-400 text-sm">description</span>
              <textarea 
                className="w-full bg-slate-50 dark:bg-[#111a22] border border-slate-200 dark:border-slate-800 rounded-lg py-3 pl-10 pr-4 text-sm min-h-[100px]"
                placeholder="Adicione notas..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        <footer className="p-6 shrink-0 flex gap-4">
          <button onClick={onClose} className="flex-1 py-3 text-sm font-bold bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200">Cancelar</button>
          <button onClick={handleSave} className="flex-[2] py-3 text-sm font-bold bg-primary text-white rounded-lg hover:bg-blue-600 shadow-lg shadow-primary/20">Salvar Transação</button>
        </footer>
      </div>
    </div>
  );
};

export default TransactionModal;
