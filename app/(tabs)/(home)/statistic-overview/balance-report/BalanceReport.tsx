import {
  SafeAreaViewCustom,
  SectionComponent,
  YearMonthSelector,
} from "@/components";
import { Colors } from "@/helpers/constants/color";
import { formatCurrency } from "@/helpers/libs";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import TEXT_TRANSLATE_BALANCE_REPORT from "./BalanceReport.translate";
import useBalanceReport from "./hooks/useBalanceReport";

const BalanceReport = () => {
  const { state, handler } = useBalanceReport();

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-gray-50">
      <SectionComponent rootClassName="h-14 bg-white shadow-sm justify-center relative">
        <Pressable onPress={handler.handleBack} className="absolute left-4 p-2">
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </Pressable>
        <View className="items-center justify-between">
          <Text className="text-lg font-bold text-gray-900">
            {TEXT_TRANSLATE_BALANCE_REPORT.TITLE.BALANCE_REPORT}
          </Text>
        </View>
      </SectionComponent>

      <ScrollView className="flex-1">
        <SectionComponent rootClassName="bg-white overflow-hidden rounded-lg m-4">
          <YearMonthSelector
            currentYear={state.currentYear}
            onPrevious={handler.handlePreviousYear}
            onNext={handler.handleNextYear}
          />
        </SectionComponent>
        <SectionComponent rootClassName=" bg-white overflow-hidden p-4 rounded-lg mx-4">
          <LineChart
            areaChart
            data={state.lineData ?? []}
            height={220}
            spacing={25.3}
            initialSpacing={10}
            color={Colors.colors.primary}
            thickness={3}
            startFillColor={Colors.colors.thirdly}
            endFillColor="rgba(135, 206, 235, 0.2)"
            startOpacity={0.9}
            endOpacity={0.1}
            noOfSections={3}
            yAxisThickness={0}
            maxValue={state.chartMaxValue}
            xAxisThickness={0}
            hideDataPoints={false}
            verticalLinesColor="rgba(0, 0, 0, 0.05)"
            xAxisLabelTextStyle={{
              color: "gray",
              textAlign: "center",
              fontSize: 12,
            }}
            yAxisOffset={0}
            yAxisTextStyle={{ color: "gray", fontSize: 12 }}
            formatYLabel={(value) => {
              const absValue = Math.abs(Number(value));
              if (absValue >= 1000000)
                return `${(absValue / 1000000).toFixed(0)}M`;
              if (absValue >= 1000) return `${(absValue / 1000).toFixed(0)}K`;
              return `${absValue}`;
            }}
            hideYAxisText={false}
            dataPointsColor={Colors.colors.primary}
            dataPointsRadius={5}
            pointerConfig={{
              showPointerStrip: true,
              pointerStripHeight: 90,
              pointerStripColor: Colors.colors.primary,
              pointerStripWidth: 2,
              pointerColor: Colors.colors.primary,
              radius: 6,
              pointerLabelWidth: 90,
              pointerLabelHeight: 30,
              activatePointersInstantlyOnTouch: true,
              autoAdjustPointerLabelPosition: true,
              pointerLabelComponent: (items: any) => {
                return (
                  <View className="rounded-md bg-superlight py-1">
                    <Text>{items[0].label}</Text>
                    <Text
                      className={`font-bold ${items[0].value >= 0 ? "text-green" : "text-red"}`}
                    >
                      {formatCurrency(items[0].value)}
                    </Text>
                  </View>
                );
              },
            }}
          />
        </SectionComponent>

        <SectionComponent rootClassName="mx-4 mb-6 mt-5 overflow-hidden rounded-xl shadow-sm">
          <View className="bg-primary px-4 py-3">
            <Text className="text-base font-semibold text-white">
              {TEXT_TRANSLATE_BALANCE_REPORT.LABELS.RECENT_TRANSACTIONS}
            </Text>
          </View>
          {state.monthlyDetails.map((item, index) => (
            <View
              key={index}
              className={`flex-row justify-between border-b border-gray-100 bg-white px-5 py-4 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <Text className="text-base font-medium text-gray-700">
                {item?.month}
              </Text>
              <Text
                className={`text-base font-semibold ${
                  parseFloat(item?.balance as any) >= 0
                    ? "text-green"
                    : "text-red"
                }`}
              >
                {formatCurrency(item?.balance)}
              </Text>
            </View>
          ))}
        </SectionComponent>
      </ScrollView>
    </SafeAreaViewCustom>
  );
};

export default BalanceReport;
