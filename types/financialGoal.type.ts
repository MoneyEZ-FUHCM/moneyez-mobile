import { MaterialIcons } from "@expo/vector-icons";

export interface FinancialGoal {
  id: string;
  userId: string;
  subcategoryId: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  name: string;
  targetAmount: number;
  currentAmount: number;
  status: number;
  deadline: string;
}