import { MaterialIcons } from "@expo/vector-icons";

export type TransactionType = 'expense' | 'income';

export interface Category {
    id: string;
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
}