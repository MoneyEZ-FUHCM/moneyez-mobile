import React from 'react';
import { SafeAreaViewCustom, SectionComponent } from "@/components";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, ScrollView, View, Pressable } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import TEXT_TRANSLATE_YEAR_REPORT from './YearReport.translate';
import YearMonthSelector from '@/components/YearMonthSelector';
import useYearReport from './hooks/useYearReport';

const YearReportScreen = () => {

    const { state, handler } = useYearReport();

    return (
        <SafeAreaViewCustom rootClassName="flex-1 bg-gray-50">
            <SectionComponent rootClassName="h-14 bg-white shadow-sm justify-center">
                <View className="flex-row items-center justify-between px-4">
                    <Pressable onPress={handler.handleBack} className="p-2">
                        <MaterialIcons name="arrow-back" size={24} color="black" />
                    </Pressable>
                    <Text className="text-lg font-bold text-gray-900">
                        {TEXT_TRANSLATE_YEAR_REPORT.TITLE.YEAR_REPORT}
                    </Text>
                    <View className="p-2" style={{ width: 24 }} />
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

                <View className="flex-row mx-4 mt-4 bg-gray-200 rounded-lg overflow-hidden">
                    <Pressable
                        onPress={() => handler.setActiveTab('expense')}
                        className={`flex-1 py-2 ${state.activeTab === 'expense' ? 'bg-gray-700' : 'bg-gray-200'}`}
                    >
                        <Text className={`text-center font-medium ${state.activeTab === 'expense' ? 'text-white' : 'text-gray-700'}`}>
                            {TEXT_TRANSLATE_YEAR_REPORT.LABELS.EXPENSE}
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => handler.setActiveTab('income')}
                        className={`flex-1 py-2 ${state.activeTab === 'income' ? 'bg-gray-700' : 'bg-gray-200'}`}
                    >
                        <Text className={`text-center font-medium ${state.activeTab === 'income' ? 'text-white' : 'text-gray-700'}`}>
                            {TEXT_TRANSLATE_YEAR_REPORT.LABELS.INCOME}
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => handler.setActiveTab('total')}
                        className={`flex-1 py-2 ${state.activeTab === 'total' ? 'bg-gray-700' : 'bg-gray-200'}`}
                    >
                        <Text className={`text-center font-medium ${state.activeTab === 'total' ? 'text-white' : 'text-gray-700'}`}>
                            {TEXT_TRANSLATE_YEAR_REPORT.LABELS.TOTAL}
                        </Text>
                    </Pressable>
                </View>

                <SectionComponent rootClassName="mt-4 bg-white p-4 rounded-lg mx-4">
                    <BarChart
                        data={state.barData}
                        height={200}
                        width={350}
                        barWidth={30}
                        spacing={20}
                        initialSpacing={10}
                        noOfSections={5}
                        barBorderRadius={4}
                        yAxisThickness={0}
                        xAxisThickness={0}
                        showVerticalLines={true}
                        verticalLinesColor="rgba(0, 0, 0, 0.1)"
                        xAxisLabelTextStyle={{ color: 'gray', textAlign: 'center' }}
                        yAxisTextStyle={{ color: 'gray' }}
                    />
                </SectionComponent>

                <View className="mt-4 mb-4">
                    {state.quarterlyDetails.map((item, index) => (
                        <View
                            key={index}
                            className={`flex-row justify-between px-4 py-3 bg-white border-b border-gray-200 ${index === 0 ? 'bg-blue-50' : ''
                                }`}
                        >
                            <Text className={`text-base ${index === 0 ? 'font-bold' : 'font-medium'}`}>
                                {item.month}
                            </Text>
                            <Text className={`text-base ${index === 0 ? 'font-bold text-blue-500' : 'font-medium'}`}>
                                {item.amount}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaViewCustom>
    );
};

export default YearReportScreen;