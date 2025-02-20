import { MaterialIcons } from "@expo/vector-icons";

export interface Transaction {
  id: string;
  type: "expense" | "income";
  category: string;
  amount: string;
  date: string;
  time: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

const SAMPLE_TRANSACTIONS = [
  {
    id: "1",
    type: "expense",
    category: "Tiền điện",
    amount: "400000",
    date: "01/01/2025",
    time: "17:02",
    icon: "flash-on",
  },
  {
    id: "2",
    type: "income",
    category: "Tiền lương",
    amount: "500000",
    date: "01/01/2025",
    time: "17:02",
    icon: "account-balance-wallet",
  },
  {
    id: "3",
    type: "income",
    category: "Tiền lương",
    amount: "500000",
    date: "01/01/2025",
    time: "17:02",
    icon: "account-balance-wallet",
  },
  {
    id: "4",
    type: "income",
    category: "Tiền lương",
    amount: "500000",
    date: "01/01/2025",
    time: "17:02",
    icon: "account-balance-wallet",
  },
  {
    id: "5",
    type: "income",
    category: "Tiền lương",
    amount: "500000",
    date: "01/01/2025",
    time: "17:02",
    icon: "account-balance-wallet",
  },
  {
    id: "6",
    type: "income",
    category: "Tiền lương",
    amount: "500000",
    date: "01/01/2025",
    time: "17:02",
    icon: "account-balance-wallet",
  },
  {
    id: "7",
    type: "income",
    category: "Tiền lương",
    amount: "500000",
    date: "01/01/2025",
    time: "17:02",
    icon: "account-balance-wallet",
  },
];

export default SAMPLE_TRANSACTIONS;
