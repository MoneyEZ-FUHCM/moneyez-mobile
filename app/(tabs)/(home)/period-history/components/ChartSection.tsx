import React from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

interface ChartSectionProps {
  modelDetails: {
    income: number;
    expense: number;
    balance: number;
    startDate: string | string[];
    endDate: string | string[];
  };
  formatCurrency: (value: number) => string;
}

const ChartSection = ({ modelDetails, formatCurrency }: ChartSectionProps) => {
  // Prepare chart data with income and expense values
  const chartData = [
    { value: modelDetails.income, color: '#00a010', label: 'Thu nhập', labelColor: '#00a010', labelFontSize: 12 },
    { value: modelDetails.expense, color: '#cc0000', label: 'Chi tiêu', labelColor: '#cc0000', labelFontSize: 12 },
  ];

  return (
    <View style={{ alignItems: 'center', marginVertical: 20 }}>
      <PieChart
        data={chartData}
        donut
        innerRadius={50}
        centerLabelComponent={() => (
            <Text className="text-base font-bold">
              {formatCurrency(modelDetails.balance)}
            </Text>
            )}
        showTooltip={false}
          />
      <Text style={{ marginTop: 10, fontSize: 14, color: '#555' }}>
        {modelDetails.startDate} - {modelDetails.endDate}
      </Text>
    </View>
  );
};

export default ChartSection;
