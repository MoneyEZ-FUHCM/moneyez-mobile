import { MaterialIcons } from "@expo/vector-icons";

export type ModelId = "6jars" | "50-30-20" | "80-20";

export interface SpendingModel {
  id: ModelId;
  name: string;
  description: string;
}

export interface ChartDataItem {
  value: number;
  color: string;
  text: string;
  label: string;
}

export const spendingModels: SpendingModel[] = [
  { id: "6jars", name: "6-Jars", description: "Phân bổ tiền vào sáu hũ khác nhau cho các mục đích cụ thể." },
  { id: "50-30-20", name: "50-30-20", description: "Phân bổ 50% cho nhu cầu thiết yếu, 30% cho nhu cầu cá nhân, và 20% cho tiết kiệm." },
  { id: "80-20", name: "80-20", description: "Phân bổ 80% cho chi tiêu thiết yếu và 20% cho chi tiêu tùy ý." },
];

// Chart data for each model
export const chartData: Record<ModelId, ChartDataItem[]> = {
  "6jars": [
    { value: 10, color: "#F44336", text: "10%", label: "Play" },
    { value: 10, color: "#2196F3", text: "10%", label: "Education" },
    { value: 10, color: "#FFEB3B", text: "10%", label: "Savings" },
    { value: 10, color: "#4CAF50", text: "10%", label: "Long-term" },
    { value: 10, color: "#9C27B0", text: "10%", label: "Giving" },
    { value: 50, color: "#FF9800", text: "50%", label: "Necessities" },
  ],
  "50-30-20": [
    { value: 50, color: "#FF9800", text: "50%", label: "Needs" },
    { value: 30, color: "#2196F3", text: "30%", label: "Wants" },
    { value: 20, color: "#4CAF50", text: "20%", label: "Savings" },
  ],
  "80-20": [
    { value: 80, color: "#FF9800", text: "80%", label: "Essentials" },
    { value: 20, color: "#4CAF50", text: "20%", label: "Discretionary" },
  ],
};

export const examples: Record<ModelId, string> = {
  "6jars": "Ví dụ: Thu nhập 10 triệu VND → 5 triệu VND cho chi phí thiết yếu, 1 triệu VND cho tiết kiệm, 1 triệu VND cho giáo dục...",
  "50-30-20": "Ví dụ: Thu nhập 10 triệu VND → 5 triệu VND cho các nhu cầu thiết yếu, 3 triệu VND cho các nhu cầu cá nhân, 2 triệu VND cho tiết kiệm.",
  "80-20": "Ví dụ: Thu nhập 10 triệu VND → 8 triệu VND cho chi tiêu thiết yếu, 2 triệu VND cho chi tiêu tùy ý.",
};

// Icons for each model
export const modelIcons: Record<ModelId, keyof typeof MaterialIcons.glyphMap> = {
  "6jars": "account-balance-wallet",
  "50-30-20": "pie-chart",
  "80-20": "donut-large",
};