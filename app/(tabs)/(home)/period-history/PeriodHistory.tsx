import {
  FlatListCustom,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { BarChartCustom } from "@/components/BarChartCustom/BarChartCustom";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import usePeriodHistory, {
  TransactionViewModel,
} from "./hooks/usePeriodHistory";
import TEXT_TRANSLATE_PERIOD_HISTORY from "./PeriodHistory.translate";

export default function PeriodHistory() {
  const barData = [
    { value: 250, label: "T2" },
    { value: 500, label: "T3" },
    { value: 745, label: "T4" },
    { value: 320, label: "T5" },
    { value: 600, label: "T6" },
    { value: 256, label: "T7" },
    { value: 300, label: "CN" },
  ];

  const { state, handler } = usePeriodHistory();
  const { transactions, modelDetails, isLoading, isModelLoading } = state;

  const renderTransactionItem = ({ item }: { item: TransactionViewModel }) => (
    <View className="flex-row items-center justify-between border-b border-[#f0f0f0] py-4">
      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-[#f5f5f5]">
          <MaterialIcons name={item.icon as any} size={24} color="#609084" />
        </View>
        <View className="gap-1">
          <Text className="text-base font-medium text-black">
            {item.subcategory}
          </Text>
          <View className="flex-row gap-3">
            <Text className="text-xs text-[#929292]">{item.date}</Text>
            <Text className="text-xs text-[#929292]">{item.time}</Text>
          </View>
        </View>
      </View>
      <Text
        className={`text-base font-semibold ${item.type === "income" ? "text-[#00a010]" : "text-[#cc0000]"}`}
      >
        {item.type === "income" ? "+" : "-"}
        {handler.formatCurrency(item.amount)}
      </Text>
    </View>
  );

  const renderListHeader = () => (
    <>
      {/* Balance Section */}
      <View className="mb-4 items-center">
        <Text className="text-base text-[#929292]">
          {TEXT_TRANSLATE_PERIOD_HISTORY.TITLE.BALANCE}
        </Text>
        <Text className="mt-2 text-3xl font-semibold text-[#609084]">
          {handler.formatCurrency(modelDetails.balance)}
        </Text>
      </View>

      {/* Statistics & Chart */}
      <SectionComponent rootClassName="bg-white relative mb-4 rounded-lg">
        <View className="pl-2 pt-3">
          <Text className="text-left text-base font-semibold text-[#609084]">
            {TEXT_TRANSLATE_PERIOD_HISTORY.TITLE.STATISTICS}
          </Text>
        </View>
        {/* <View className="mb-4 flex-row justify-between">
          <View className="items-center">
            <Text className="text-[#929292]">Thu nhập</Text>
            <Text className="text-lg font-semibold text-[#00a010]">
              {handler.formatCurrency(modelDetails.income)}
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-[#929292]">Chi tiêu</Text>
            <Text className="text-lg font-semibold text-[#cc0000]">
              {handler.formatCurrency(modelDetails.expense)}
            </Text>
          </View>
        </View> */}
        {/* <ChartSection
          modelDetails={state.modelDetails}
          formatCurrency={handler.formatCurrency}
        /> */}
        <View className="p-4">
          <BarChartCustom data={barData} />
        </View>
      </SectionComponent>

      {/* Transactions Header */}
      <View className="mb-4 flex-row items-center justify-between px-4">
        <Text className="text-lg font-semibold text-[#609084]">
          {TEXT_TRANSLATE_PERIOD_HISTORY.TITLE.TRANSACTIONS}
        </Text>
        <Pressable onPress={handler.navigateToPeriodHistoryDetail}>
          <Text className="text-base text-[#609084]">
            {TEXT_TRANSLATE_PERIOD_HISTORY.BUTTON.SEE_MORE}
          </Text>
        </Pressable>
      </View>
    </>
  );

  const renderEmptyList = () => (
    <View className="flex-1 items-center justify-center py-8">
      <Text className="text-base text-gray-500">
        {isLoading
          ? COMMON_CONSTANT.LOADING_TRANSLATE.LOADING
          : state.error
            ? COMMON_CONSTANT.LOADING_TRANSLATE.ERROR_LOADING_DATA
            : TEXT_TRANSLATE_PERIOD_HISTORY.MESSAGE_STATUS.NO_TRANSACTIONS}
      </Text>
    </View>
  );

  if (isLoading || isModelLoading) {
    return (
      <SafeAreaViewCustom rootClassName="flex-1 bg-[#fafafa]">
        <SectionComponent rootClassName="h-24 bg-white justify-center">
          <View className="flex-row items-center justify-between px-4">
            <Pressable onPress={handler.handleBack}>
              <MaterialIcons name="arrow-back" size={24} color="black" />
            </Pressable>
            <Text className="text-xl font-semibold text-black">
              {COMMON_CONSTANT.LOADING_TRANSLATE.LOADING}
            </Text>
            <SpaceComponent width={24} />
          </View>
        </SectionComponent>
        <SectionComponent rootClassName="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#609084" />
          <Text className="mt-2 text-[#609084]">
            {COMMON_CONSTANT.LOADING_TRANSLATE.LOADING}
          </Text>
        </SectionComponent>
      </SafeAreaViewCustom>
    );
  }

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-[#fafafa]">
      <SectionComponent rootClassName="h-14 bg-white justify-center">
        <View className="flex-row items-center justify-between px-5">
          <Pressable onPress={handler.handleBack}>
            <MaterialIcons name="arrow-back" size={24} color="#609084" />
          </Pressable>
          <Text className="text-lg font-bold text-primary">
            {modelDetails.startDate} - {modelDetails.endDate}
          </Text>
          <SpaceComponent width={24} />
        </View>
      </SectionComponent>
      <FlatListCustom
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 24,
          backgroundColor: "#fafafa",
          paddingTop: 8,
        }}
        className="mx-4 flex-1 rounded-lg bg-white"
        ItemSeparatorComponent={() => <View className="mx-4" />}
        refreshing={isLoading}
        onRefresh={handler.refetchData}
      />
    </SafeAreaViewCustom>
  );
}
