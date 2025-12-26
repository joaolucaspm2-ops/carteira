
export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
  color?: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  categoryId: string;
  description: string;
  installments?: {
    current: number;
    total: number;
  };
}

export interface BudgetConfig {
  income: number;
  splits: {
    needs: number; // 50%
    wants: number; // 30%
    savings: number; // 20%
  };
}

export interface UserSettings {
  name: string;
  initialBalance: number;
  theme: 'dark' | 'light';
}
