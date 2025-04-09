import { SafeAreaViewCustom, SectionComponent } from "@/components";
import { formatCurrency, formatDate, formatDateMonthYear, formatTime } from "@/helpers/libs";
import { Transaction } from "@/types/transaction.types";
import { EvilIcons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import CalendarView from "./CalendarView";
import TEXT_TRANSLATE_STATISTICAL from "./Statistical.translate";
import useStatistical from "./hooks/useStatistical";
import { Colors } from "@/helpers/constants/color";

export default function Statistical() {
  const { state, handler } = useStatistical();

  const renderTransactionList = () => (
    <View className="mt-4 px-4">
      <Text className="mb-3 text-xl font-bold text-gray-900">
        {TEXT_TRANSLATE_STATISTICAL.LABELS.RECENT_TRANSACTIONS}
      </Text>
      {Object.entries(state.transactionsByDate).map(([date, transactions]) => {
        const transactionData = handler.getTransaction(transactions);
        const netAmount = transactionData.income - transactionData.expense;

        return (
          <View key={date} className="mb-4">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-base font-semibold text-gray-800">
                {formatDate(new Date(date))}
              </Text>
              <Text
                className={`text-base font-bold ${netAmount >= 0 ? "text-emerald-600" : "text-rose-600"}`}
              >
                {netAmount >= 0 ? "+" : ""}{formatCurrency(netAmount)}
              </Text>
            </View>

            {transactions.length > 0 && transactions.map((item: Transaction) => (
              <View
                key={item.id}
                className="mb-2 flex-row items-center justify-between rounded-lg bg-white p-3 pl-1 shadow-sm"
              >
                <View className="flex-row items-center">
                  <View className="flex-[0.6] flex-row items-center">
                    <MaterialIcons
                      name={item.subcategoryIcon ?? "attach-money"}
                      size={36}
                      color={Colors.colors.primary}
                    />
                    <View className="ml-3">
                      <Text className="text-base font-semibold text-gray-900">
                        {item.subcategoryName || item.description}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        {formatDateMonthYear(item.createdDate)}{" "}·{" "}{formatTime(item.createdDate)}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-[0.4] items-end">
                    <Text
                      className={`text-base font-bold ${item.type === "EXPENSE" ? "text-rose-600" : "text-emerald-600"}`}
                    >
                      {item.type === "EXPENSE" ? "-" : "+"}
                      {formatCurrency(item.amount)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-gray-50">
      <SectionComponent rootClassName="h-14 bg-white shadow-sm justify-center">
        <View className="flex-row items-center justify-center relative px-4">
          <Pressable onPress={handler.handleBack} className="p-2 absolute left-4">
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </Pressable>
          <Text className="text-lg font-bold justify-center text-center">
            {TEXT_TRANSLATE_STATISTICAL.TITLE.STATISTICAL}
          </Text>
          <View/>
        </View>
      </SectionComponent>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <CalendarView />
        {renderTransactionList()}
      </ScrollView>
    </SafeAreaViewCustom>
  );
}
