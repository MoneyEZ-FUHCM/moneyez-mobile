import { SafeAreaViewCustom, SectionComponent } from "@/components";
import { Colors } from "@/helpers/constants/color";
import {
  formatCurrency,
  formatDate,
  formatDateMonthYear,
  formatTime,
} from "@/helpers/libs";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import CalendarView from "./CalendarView";
import TEXT_TRANSLATE_STATISTICAL from "./Statistical.translate";
import useStatistical from "./hooks/useStatistical";

export default function Statistical() {
  const { state, handler } = useStatistical();

  const renderTransactionList = () => (
    <View className="mt-6 px-4">
      <Text className="mb-4 text-xl font-bold">
        {TEXT_TRANSLATE_STATISTICAL.LABELS.RECENT_TRANSACTIONS}
      </Text>

      {Object.entries(state.transactionsByDate).length === 0 ? (
        <View className="items-center py-8">
          <Text className="text-base text-gray-500">Chưa có giao dịch</Text>
        </View>
      ) : (
        Object.entries(state.transactionsByDate).map(([date, transactions]) => {
          const transactionData = handler.getTransaction(transactions);
          const netAmount = transactionData.income - transactionData.expense;

          return (
            <View key={date} className="mb-6">
              <View className="mb-3 flex-row items-center justify-between border-b border-gray-100 pb-2">
                <Text className="text-base font-semibold text-gray-700">
                  {formatDate(new Date(date))}
                </Text>
                <Text
                  className={`text-base font-bold ${
                    netAmount >= 0 ? "text-green" : "text-red"
                  }`}
                >
                  {netAmount >= 0 ? "+" : ""}
                  {formatCurrency(netAmount)}
                </Text>
              </View>

              {transactions.length > 0 &&
                transactions.map((item) => (
                  <View
                    key={item.id}
                    className="mb-3 rounded-xl bg-white p-4 shadow-sm"
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1 flex-row items-center">
                        <View className="mr-3 rounded-full bg-gray-50 p-2">
                          <MaterialIcons
                            name={item.subcategoryIcon ?? "attach-money"}
                            size={24}
                            color={Colors.colors.primary}
                          />
                        </View>
                        <View className="flex-1">
                          <Text
                            className="text-base font-semibold"
                            numberOfLines={1}
                          >
                            {item.subcategoryName || item.description}
                          </Text>
                          <Text className="mt-1 text-xs text-gray-500">
                            {formatDateMonthYear(item.createdDate)} ·{" "}
                            {formatTime(item.createdDate)}
                          </Text>
                        </View>
                      </View>
                      <View className="ml-3">
                        <Text
                          className={`text-base font-bold ${
                            item.type === "EXPENSE" ? "text-red" : "text-green"
                          }`}
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
        })
      )}
    </View>
  );

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-gray-50">
      <SectionComponent rootClassName="h-14 bg-white shadow-sm justify-center relative">
        <TouchableOpacity
          onPress={handler.handleBack}
          className="absolute left-4 rounded-full bg-gray-50 p-2"
        >
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="items-center justify-between">
          <Text className="text-lg font-bold">
            {TEXT_TRANSLATE_STATISTICAL.TITLE.STATISTICAL}
          </Text>
        </View>
      </SectionComponent>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <CalendarView />
        {renderTransactionList()}
      </ScrollView>
    </SafeAreaViewCustom>
  );
}
