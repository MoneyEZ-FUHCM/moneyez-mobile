import { MaterialIcons } from "@expo/vector-icons";

export type TransactionType = 'expense' | 'income';

export interface Category {
    id: string;
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
}

const ADD_TRANSACTION_CONSTANTS = {
    CATEGORIES: [
        {
            id: "food",
            label: "Tiền ăn",
            icon: "restaurant",
        },
        {
            id: "electricity",
            label: "Tiền điện",
            icon: "bolt",
        },
        {
            id: "water",
            label: "Tiền nước",
            icon: "water-drop",
        },
        {
            id: "transport",
            label: "Đi lại",
            icon: "directions-bus",
        },
        {
            id: "medical",
            label: "Y tế",
            icon: "local-hospital",
        },
        {
            id: "travel",
            label: "Du lịch",
            icon: "flight",
        },
    ],
};

export default ADD_TRANSACTION_CONSTANTS;
