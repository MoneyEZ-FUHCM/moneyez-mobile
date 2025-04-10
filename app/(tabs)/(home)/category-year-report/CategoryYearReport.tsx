import React from 'react';
import { SafeAreaViewCustom, SectionComponent } from "@/components";
import { MaterialIcons, EvilIcons } from "@expo/vector-icons";
import { Text, ScrollView, View, Pressable } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import useCategoryYearReport from './hooks/useCategoryYearReport';
import { TRANSACTION_TYPE } from '@/enums/globals';
import { formatCurrency } from '@/helpers/libs';
import YearMonthSelector from '@/components/YearMonthSelector';
import TEXT_TRANSLATE_CATEGORY_YEAR_REPORT from './CategoryYearReport.translate';

const CategoryYearReport = () => {
    const { state, handler } = useCategoryYearReport();

    return (
        <SafeAreaViewCustom rootClassName="flex-1 bg-gray-50">
            <SectionComponent rootClassName="h-14 bg-white shadow-sm justify-center">
                <View className="flex-row items-center justify-between px-4">
                    <Pressable onPress={handler.handleBack} className="p-2">
                        <MaterialIcons name="arrow-back" size={24} color="black" />
                    </Pressable>
                    <Text className="text-lg font-bold text-gray-900">
                        {TEXT_TRANSLATE_CATEGORY_YEAR_REPORT.TITLE.YEAR_REPORT}
                    </Text>
                    <Pressable className="p-2">
                        <EvilIcons name="camera" size={24} color="black" />
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

                <View className="flex-row mx-4 mt-4 border-b border-gray-200">
                    <Pressable
                        className={`flex-1 py-2 border-b-2 ${state.type === TRANSACTION_TYPE.EXPENSE ? 'border-gray-800' : 'border-transparent'}`}
                        onPress={() => handler.setType(TRANSACTION_TYPE.EXPENSE)}
                    >
                        <Text className={`text-center font-medium ${state.type === TRANSACTION_TYPE.EXPENSE ? 'text-gray-800' : 'text-gray-400'}`}>
                            {TEXT_TRANSLATE_CATEGORY_YEAR_REPORT.LABELS.EXPENSE}
                        </Text>
                    </Pressable>
                    <Pressable
                        className={`flex-1 py-2 border-b-2 ${state.type === TRANSACTION_TYPE.INCOME ? 'border-gray-800' : 'border-transparent'}`}
                        onPress={() => handler.setType(TRANSACTION_TYPE.INCOME)}
                    >
                        <Text className={`text-center font-medium ${state.type === TRANSACTION_TYPE.INCOME ? 'text-gray-800' : 'text-gray-400'}`}>
                            {TEXT_TRANSLATE_CATEGORY_YEAR_REPORT.LABELS.INCOME}
                        </Text>
                    </Pressable>
                </View>

                <SectionComponent rootClassName="mt-4 bg-white p-4 rounded-lg mx-4">
                    <View className="items-center">
                        <PieChart
                            data={state.pieData}
                            donut
                            showText
                            radius={120}
                            innerRadius={60}
                            textSize={12}
                            textColor="#000"
                            showTextBackground={false}
                            showValuesAsLabels={false}
                            showGradient={false}
                            focusOnPress
                            centerLabelComponent={() => {
                                return <View />;
                            }}
                        />
                    </View>
                </SectionComponent>

                <View className="mt-4 mb-4">
                    <View className="flex-row justify-between px-4 py-3 bg-white border-b border-gray-200">
                        <Text className="text-base font-bold">{TEXT_TRANSLATE_CATEGORY_YEAR_REPORT.LABELS.TOTAL}</Text>
                        <Text className={`text-base font-bold ${state.type === TRANSACTION_TYPE.EXPENSE ? 'text-blue-500' : 'text-green-500'}`}>
                            {formatCurrency(handler.getTotalAmount())}
                        </Text>
                    </View>

                    {state?.detailItems?.map((item, index) => (
                        <View
                            key={index}
                            className="flex-row justify-between items-center px-4 py-3 bg-white border-b border-gray-200"
                        >
                            <View className="flex-row items-center">
                                <Text className="mr-2 text-xl"><MaterialIcons name={item.icon} size={20} color={item.color || "gray"} /></Text>
                                <Text className="text-base">{item.name}</Text>
                            </View>
                            <View className="flex-row">
                                <Text className="text-base mr-2">{formatCurrency(item.amount)}</Text>
                                <Text className="text-xs text-gray-500 self-center">{item.percentage}</Text>
                                <MaterialIcons name="chevron-right" size={20} color="gray" />
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaViewCustom>
    );
};

export default CategoryYearReport;