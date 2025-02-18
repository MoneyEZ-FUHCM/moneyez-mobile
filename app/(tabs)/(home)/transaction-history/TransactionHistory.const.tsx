export const TRANSACTION_HISTORY_CONSTANTS = {
  FILTER_TABS: [
    { id: 'all', label: 'Tất cả' },
    { id: 'jars', label: 'JARs' },
    { id: '80-20', label: '80-20' },
    { id: '50-20-30', label: '50-20-30' },
    { id: 'custom', label: 'Tùy chọn' },
  ],
  SAMPLE_TRANSACTIONS: {
    '2025': [
      {
        modelName: '80-20',
        period: '01/12 - 31/12/2024',
        income: '800000',
        expense: '180000',
      },
      {
        modelName: '80-20',
        period: '01/12 - 31/12/2024',
        income: '800000',
        expense: '180000',
      },
      {
        modelName: '80-20',
        period: '01/12 - 31/12/2024',
        income: '800000',
        expense: '180000',
      },
    ],
    '2024': [
      {
        modelName: '80-20',
        period: '01/12 - 31/12/2024',
        income: '800000',
        expense: '180000',
      },
      {
        modelName: '80-20',
        period: '01/12 - 31/12/2024',
        income: '800000',
        expense: '180000',
      },
      {
        modelName: '80-20',
        period: '01/12 - 31/12/2024',
        income: '800000',
        expense: '180000',
      },
    ],
  }
};

export interface Transaction {
  modelName: string;
  period: string;
  income: string;
  expense: string;
}

export interface TransactionsByYear {
  [year: string]: Transaction[];
}