export type LineChartDataPoint = {
  value: number;
  label: string;
};

export type PieChartDataPoint = {
  icon: string | null;
  value: number;
  text: string;
  color: string;
  legend: string;
};
