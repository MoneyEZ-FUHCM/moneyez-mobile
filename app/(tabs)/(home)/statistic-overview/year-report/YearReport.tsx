import { SafeAreaViewCustom, SectionComponent } from "@/components";
import YearMonthSelector from "@/components/YearMonthSelector";
import { formatCurrency } from "@/helpers/libs";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import useYearReport from "./hooks/useYearReport";
import TEXT_TRANSLATE_YEAR_REPORT from "./YearReport.translate";

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

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <SectionComponent rootClassName="bg-white overflow-hidden rounded-lg m-4">
          <YearMonthSelector
            currentYear={state.currentYear}
            onPrevious={handler.handlePreviousYear}
            onNext={handler.handleNextYear}
          />
        </SectionComponent>

        <View className="mx-4 mt-4 flex-row overflow-hidden rounded-lg bg-gray-200">
          <Pressable
            onPress={() => handler.setActiveTab("EXPENSE")}
            className={`flex-1 py-2 ${state.activeTab === "EXPENSE" ? "bg-primary" : "bg-gray-200"}`}
          >
            <Text
              className={`text-center font-medium ${state.activeTab === "EXPENSE" ? "text-white" : ""}`}
            >
              {TEXT_TRANSLATE_YEAR_REPORT.LABELS.EXPENSE}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handler.setActiveTab("INCOME")}
            className={`flex-1 border border-b-0 border-t-0 border-gray-300 py-2 ${state.activeTab === "INCOME" ? "bg-primary" : "bg-gray-200"}`}
          >
            <Text
              className={`text-center font-medium ${state.activeTab === "INCOME" ? "text-white" : ""}`}
            >
              {TEXT_TRANSLATE_YEAR_REPORT.LABELS.INCOME}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handler.setActiveTab("TOTAL")}
            className={`flex-1 py-2 ${state.activeTab === "TOTAL" ? "bg-primary" : "bg-gray-200"}`}
          >
            <Text
              className={`text-center font-medium ${state.activeTab === "TOTAL" ? "text-white" : "text-gray-700"}`}
            >
              {TEXT_TRANSLATE_YEAR_REPORT.LABELS.TOTAL}
            </Text>
          </Pressable>
        </View>

        <SectionComponent rootClassName="mt-4 bg-white p-4 rounded-lg mx-4 overflow-hidden">
          <BarChart
            data={state.updateBarData ?? []}
            height={200}
            width={350}
            barWidth={35}
            spacing={10}
            initialSpacing={5}
            minHeight={1}
            isAnimated
            noOfSections={5}
            barBorderRadius={4}
            yAxisThickness={0}
            xAxisThickness={0}
            verticalLinesColor="rgba(0, 0, 0, 0.1)"
            yAxisTextStyle={{ color: "gray" }}
          />
        </SectionComponent>

        <View className="mx-4 my-6 overflow-hidden rounded-lg">
          {state.quarterlyDetails?.map((item, index) => (
            <View
              key={index}
              className={`flex-row items-center justify-between px-5 py-4 ${
                index === 0
                  ? "bg-blue-100"
                  : index % 2 === 0
                    ? "bg-gray-50"
                    : "bg-white"
              } ${index !== state.quarterlyDetails.length - 1 ? "border-b border-gray-200" : ""}`}
            >
              <Text
                className={`${index === 0 ? "font-bold" : "font-medium text-gray-700"} text-base`}
              >
                {item.month}
              </Text>
              <Text
                className={`${
                  index === 0
                    ? "font-bold"
                    : state.activeTab === "EXPENSE" ||
                        (state.activeTab === "TOTAL" &&
                          parseFloat(
                            item.amount.toString().replace(/[^0-9.-]+/g, ""),
                          ) < 0)
                      ? "font-medium text-red"
                      : state.activeTab === "INCOME" ||
                          (state.activeTab === "TOTAL" &&
                            parseFloat(
                              item.amount.toString().replace(/[^0-9.-]+/g, ""),
                            ) > 0)
                        ? "font-medium text-green"
                        : "font-medium text-gray-800"
                } text-base`}
              >
                {formatCurrency(item?.amount)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaViewCustom>
  );
};

export default YearReportScreen;
