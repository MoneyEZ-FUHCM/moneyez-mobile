import {
  BudgetSummaryComponent,
  FlatListCustom,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { PieChartCustom } from "@/components/PieChartCustom/PieChartCustom";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { TransactionViewModel } from "@/types/transaction.types";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import usePeriodHistory from "./hooks/usePeriodHistory";
import TEXT_TRANSLATE_PERIOD_HISTORY from "./PeriodHistory.translate";

export default function PeriodHistory() {
  const { state, handler } = usePeriodHistory();
  const { transactions, modelDetails, isLoading, categories } = state;

  const renderTransactionItem = ({ item }: { item: TransactionViewModel }) => (
    <View className="flex-row items-center justify-between border-b border-[#f0f0f0] py-3">
      <View className="flex-row items-center gap-1.5">
        <View className="h-12 w-12 items-center justify-center rounded-full">
          <MaterialIcons name={item?.icon as any} size={30} color="#609084" />
        </View>
        <View>
          <Text className="text-base font-medium text-black">
            {item?.subcategory
              ? item.subcategory.charAt(0).toUpperCase() +
                item.subcategory.slice(1)
              : ""}
          </Text>
          <View className="flex-row">
            <Text className="mr-3 text-sm text-[#929292]">{item?.date}</Text>
            <Text className="text-sm text-[#929292]">• {item?.time}</Text>
          </View>
        </View>
      </View>
      <Text
        className={`text-base font-semibold ${item?.type === "income" ? "text-[#00a010]" : "text-[#cc0000]"}`}
      >
        {item?.type === "income" ? "+" : "-"}{" "}
        {handler.formatCurrency(item?.amount)}
      </Text>
    </View>
  );

  const renderListHeader = () => (
    <>
      {/* Balance Section */}
      <View className="mb-3 items-center">
        <Text className="text-base text-[#929292]">
          {TEXT_TRANSLATE_PERIOD_HISTORY.TITLE.BALANCE}
        </Text>
        <Text className="mt-2 text-3xl font-bold text-primary">
          {handler.formatCurrency(modelDetails.balance)}
        </Text>
      </View>

      {/* Statistics & Chart */}
      <SectionComponent rootClassName="bg-white relative mb-4 rounded-lg">
        <View className="p-4">
          <PieChartCustom data={categories as any} title="Thống kê" />
        </View>
      </SectionComponent>

      <SectionComponent rootClassName="my-3">
        <BudgetSummaryComponent
          summaryText={
            <>
              Chào bạn mình là MewMo. Kỳ này bạn đã tiết kiệm được{" "}
              <Text className="font-medium text-green">100.000đ.</Text>
            </>
          }
          button1Text="Tự động xóa khi chỉ tiêu ngoài hạn mức"
          button2Text="Tự động điều chỉnh ngân sách"
          onPressButton1={() => {}}
          onPressButton2={() => {}}
        />
      </SectionComponent>

      {/* Transactions Header */}
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-bold text-primary">
          {TEXT_TRANSLATE_PERIOD_HISTORY.TITLE.TRANSACTIONS}
        </Text>
        {transactions && transactions.length > 0 && (
          <Pressable onPress={handler.navigateToPeriodHistoryDetail}>
            <Text className="text-base italic text-primary">
              {TEXT_TRANSLATE_PERIOD_HISTORY.BUTTON.SEE_MORE}
            </Text>
          </Pressable>
        )}
      </View>
    </>
  );

  const renderEmptyList = () => (
    <View className="flex-1 items-center justify-center">
      <Text className="text-base text-gray-500">
        {isLoading
          ? COMMON_CONSTANT.LOADING_TRANSLATE.LOADING
          : state.error
            ? COMMON_CONSTANT.LOADING_TRANSLATE.ERROR_LOADING_DATA
            : TEXT_TRANSLATE_PERIOD_HISTORY.MESSAGE_STATUS.NO_TRANSACTIONS}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaViewCustom rootClassName="flex-1 bg-[#fafafa]">
        <SectionComponent rootClassName="h-14 bg-white justify-center">
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
          <Text className="mt-2 text-primary">
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
        data={transactions?.slice(0, 4) ?? []}
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
        className="mx-5 flex-1 rounded-lg bg-white"
        ItemSeparatorComponent={() => <View className="mx-5" />}
        refreshing={isLoading}
        onRefresh={handler.handleRefetch}
      />
    </SafeAreaViewCustom>
  );
}
