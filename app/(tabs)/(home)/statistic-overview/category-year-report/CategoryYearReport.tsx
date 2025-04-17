import {
  SafeAreaViewCustom,
  SectionComponent,
  YearMonthSelector,
} from "@/components";
import { TRANSACTION_TYPE_TEXT } from "@/enums/globals";
import { formatCurrency } from "@/helpers/libs";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import TEXT_TRANSLATE_CATEGORY_YEAR_REPORT from "./CategoryYearReport.translate";
import useCategoryYearReport from "./hooks/useCategoryYearReport";

const CategoryYearReport = () => {
  const { state, handler } = useCategoryYearReport();

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-gray-50">
      <SectionComponent rootClassName="h-14 bg-white shadow-sm justify-center relative">
        <Pressable onPress={handler.handleBack} className="absolute left-4 p-2">
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </Pressable>
        <View className="items-center justify-between">
          <Text className="text-lg font-bold text-gray-900">
            {TEXT_TRANSLATE_CATEGORY_YEAR_REPORT.TITLE.YEAR_REPORT}
          </Text>
        </View>
      </SectionComponent>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        ref={state.chartRef}
      >
        <SectionComponent rootClassName="bg-white overflow-hidden rounded-lg m-4">
          <YearMonthSelector
            currentYear={state.currentYear}
            onPrevious={handler.handlePreviousYear}
            onNext={handler.handleNextYear}
          />
        </SectionComponent>

        <View className="mx-4 flex-row rounded-lg border-b border-gray-200 bg-white">
          <Pressable
            className={`flex-1 rounded-lg border-b-2 py-2 ${state.type === TRANSACTION_TYPE_TEXT.EXPENSE ? "border-primary" : "border-transparent"}`}
            onPress={() => handler.setType(TRANSACTION_TYPE_TEXT.EXPENSE)}
          >
            <Text
              className={`text-center font-medium ${state.type === TRANSACTION_TYPE_TEXT.EXPENSE ? "font-bold text-primary" : "text-gray-400"}`}
            >
              {TEXT_TRANSLATE_CATEGORY_YEAR_REPORT.LABELS.EXPENSE}
            </Text>
          </Pressable>
          <Pressable
            className={`flex-1 rounded-lg border-b-2 py-2 ${state.type === TRANSACTION_TYPE_TEXT.INCOME ? "border-primary" : "border-transparent"}`}
            onPress={() => handler.setType(TRANSACTION_TYPE_TEXT.INCOME)}
          >
            <Text
              className={`text-center font-medium ${state.type === TRANSACTION_TYPE_TEXT.INCOME ? "font-bold text-primary" : "text-gray-400"}`}
            >
              {TEXT_TRANSLATE_CATEGORY_YEAR_REPORT.LABELS.INCOME}
            </Text>
          </Pressable>
        </View>

        <SectionComponent rootClassName="mt-4 bg-white p-4 rounded-lg mx-4">
          <View className="items-center">
            <PieChart
              data={state.pieData ?? []}
              donut
              showText
              radius={145}
              innerRadius={90}
              textSize={12}
              textColor="#000"
              showTextBackground={false}
              showValuesAsLabels={false}
              showGradient={false}
              isAnimated
              focusOnPress
              onPress={(item: any) => {
                if (item && item.icon) {
                  handler.handleSelectCategory(item.icon);
                }
              }}
              centerLabelComponent={() => {
                const selectedItem = state.detailItems.find(
                  (item) => item.icon === state.selectedCategory,
                );

                if (!selectedItem) {
                  return null;
                }

                return (
                  <View className="items-center">
                    <Text
                      className="text-base font-semibold"
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {selectedItem.name}
                    </Text>
                    <Text
                      className={`text-xl font-bold ${state.type === TRANSACTION_TYPE_TEXT.INCOME ? "text-green" : "text-red"}`}
                    >
                      {formatCurrency(selectedItem.amount)}
                    </Text>
                    <Text className="text-sm font-bold text-gray-500">
                      {selectedItem.percentage}%
                    </Text>
                  </View>
                );
              }}
            />
          </View>
        </SectionComponent>
        <View className="mx-4 mt-6 overflow-hidden rounded-xl bg-white shadow-md">
          <View className="flex-row items-center justify-between px-5 pb-2 pt-4">
            <Text className="text-lg font-semibold text-gray-800">
              Danh mục ({state.detailItems?.length || 0})
            </Text>
            {state.type === TRANSACTION_TYPE_TEXT.TOTAL && (
              <View className="flex-row space-x-2">
                <View className="h-3 w-3 self-center rounded-full bg-red" />
                <Text className="mr-2 text-xs text-red">Chi tiêu</Text>
                <View className="h-3 w-3 self-center rounded-full bg-green" />
                <Text className="text-xs text-green">Thu nhập</Text>
              </View>
            )}
          </View>
          <View className="flex-row justify-between border-b border-gray-200 bg-blue-100/50 px-4 py-3">
            <Text className="text-base font-bold">
              {TEXT_TRANSLATE_CATEGORY_YEAR_REPORT.LABELS.TOTAL}
            </Text>
            <Text className={`text-blue text-base font-bold`}>
              {formatCurrency(handler.getTotalAmount())}
            </Text>
          </View>
          {state.detailItems?.length > 0 &&
            state.detailItems?.map((item, index) => (
              <Pressable
                key={index}
                className={`flex-row items-center justify-between px-5 py-4 ${
                  index < state.detailItems.length - 1
                    ? "border-b border-gray-100"
                    : ""
                } ${state.selectedCategory === item.icon ? "bg-superlight" : ""}`}
                onPress={() => handler.handleSelectCategory(item.icon)}
              >
                <View className="flex-row items-center">
                  <View
                    className="mr-4 h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <MaterialIcons
                      name={item.icon as any}
                      size={20}
                      color={item.color}
                    />
                  </View>
                  <Text className="text-base font-medium text-gray-800">
                    {item.name}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <View className="items-end">
                    <Text
                      className={`text-base font-semibold ${state.type === TRANSACTION_TYPE_TEXT.INCOME ? "text-green" : "text-red"}`}
                    >
                      {formatCurrency(item.amount)}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {item.percentage}%
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
        </View>
      </ScrollView>
    </SafeAreaViewCustom>
  );
};

export default CategoryYearReport;
