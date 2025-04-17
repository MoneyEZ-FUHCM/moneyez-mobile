import React from 'react';
import { SafeAreaViewCustom, SectionComponent } from "@/components";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, ScrollView, View, Pressable } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import useBalanceReport from './hooks/useBalanceReport';
import YearMonthSelector from '@/components/YearMonthSelector';
import TEXT_TRANSLATE_BALANCE_REPORT from './BalanceReport.translate';
import { formatCurrency } from '@/helpers/libs';

const BalanceReport = () => {
    const { state, handler } = useBalanceReport();

    return (
        <SafeAreaViewCustom rootClassName="flex-1 bg-gray-50">
            <SectionComponent rootClassName="h-14 bg-white shadow-sm justify-center">
                <View className="flex-row items-center justify-between px-4">
                    <Pressable onPress={handler.handleBack} className="p-2">
                        <MaterialIcons name="arrow-back" size={24} color="black" />
                    </Pressable>
                    <Text className="text-lg font-bold text-gray-900">
                        {state.currentYear} {TEXT_TRANSLATE_BALANCE_REPORT.TITLE.BALANCE_REPORT}
                    </Text>
                    <Pressable className="p-2">
                        {/* <EvilIcons name="search" size={24} color="black" /> */}
                    </Pressable>
                </View>
            </SectionComponent>

            <ScrollView className="flex-1">
                <View className="mt-4">
                    <YearMonthSelector
                        currentYear={state.currentYear}
                        onPrevious={handler.handlePreviousYear}
                        onNext={handler.handleNextYear}
                    />
                </View>

                <SectionComponent rootClassName="mt-4 bg-white p-4 rounded-lg mx-4">
                    <LineChart
                        areaChart
                        data={state.lineData}
                        height={200}
                        width={350}
                        spacing={30}
                        initialSpacing={10}
                        color="#1E90FF"
                        thickness={2}
                        startFillColor="#87CEEB"
                        endFillColor="rgba(135, 206, 235, 0.2)"
                        startOpacity={0.8}
                        endOpacity={0.1}
                        noOfSections={5}
                        yAxisThickness={0}
                        xAxisThickness={0}
                        hideDataPoints={false}
                        showVerticalLines={true}
                        verticalLinesColor="rgba(0, 0, 0, 0.1)"
                        xAxisLabelTextStyle={{ color: 'gray', textAlign: 'center', fontSize: 10 }}
                        yAxisTextStyle={{ color: 'gray' }}
                        hideYAxisText={false}
                        dataPointsColor="#1E90FF"
                        dataPointsRadius={5}
                        curved
                        formatYLabel={(value) => {
                            const absValue = Math.abs(Number(value));
                            if (absValue >= 1000000) return `${(absValue / 1000000).toFixed(0)}M`;
                            if (absValue >= 1000) return `${(absValue / 1000).toFixed(0)}K`;
                            return `${absValue}`;
                        }}
                        maxValue={15000000}
                        minValue={-20000000}
                        yAxisLabelSuffix=""
                        yAxisLabelPrefix=""
                        rulesType="solid"
                        rulesColor="rgba(0, 0, 0, 0.05)"
                        yAxisColor="transparent"
                        xAxisColor="transparent"
                        pointerConfig={{
                            pointerStripHeight: 160,
                            pointerStripColor: 'rgba(0, 0, 0, 0.1)',
                            pointerStripWidth: 2,
                            pointerColor: '#1E90FF',
                            radius: 6,
                            pointerLabelWidth: 100,
                            pointerLabelHeight: 30,
                            activatePointersOnLongPress: true,
                            autoAdjustPointerLabelPosition: true,
                            pointerLabelComponent: (items: any) => {
                                return (
                                    <View style={{
                                        backgroundColor: 'white',
                                        borderRadius: 8,
                                        padding: 8,
                                        borderWidth: 1,
                                        borderColor: '#ddd',
                                        shadowColor: "#000",
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 2,
                                    }}>
                                        <Text style={{ color: '#333', fontWeight: '600' }}>
                                            {items[0].label}
                                        </Text>
                                        <Text style={{
                                            color: items[0].value < 0 ? 'red' : '#1E90FF',
                                            fontWeight: 'bold'
                                        }}>
                                            {new Intl.NumberFormat('vi-VN').format(items[0].value)} đ
                                        </Text>
                                    </View>
                                );
                            }
                        }}
                    />
                </SectionComponent>

                <View className="mt-4 mb-4">
                    {state.monthlyDetails.map((item, index) => (
                        <View
                            key={index}
                            className="flex-row justify-between px-4 py-3 bg-white border-b border-gray-200"
                        >
                            <Text className="text-base font-medium">{item.month}</Text>
                            <Text className="text-base font-medium text-blue-500">{formatCurrency(item.balance)}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaViewCustom>
    );
};

export default BalanceReport;