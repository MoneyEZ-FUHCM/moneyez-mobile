import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import TEXT_TRANSLATE_INVIDUAL_HOME from "./InvidualHome.translate";
import { SafeAreaViewCustom } from "@/components";

export default function InvidualHome() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleHistoryPress = () => {
    // Navigate or show history
  };

  const handleAddExpense = () => {
    // Navigate to Add Expense
  };

  const handleAddIncome = () => {
    // Navigate to Add Income
  };

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* HEADER */}
        <View className="flex-row items-center p-4 bg-white">
          <Pressable onPress={handleGoBack} className="pr-2">
            <Text className="text-black text-lg">←</Text>
          </Pressable>
          <Text className="text-lg font-semibold text-black ml-2">
            {TEXT_TRANSLATE_INVIDUAL_HOME.TITLE.PERSONAL_EXPENSES}
          </Text>
        </View>

        {/* BALANCE CARD */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-4 shadow-sm">
          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-black">
              {TEXT_TRANSLATE_INVIDUAL_HOME.TITLE.TOTAL_BALANCE}
            </Text>
            <Pressable onPress={handleHistoryPress}>
              <Text className="text-xs text-gray-500">
                {TEXT_TRANSLATE_INVIDUAL_HOME.LABEL.TRANSACTION_HISTORY}
              </Text>
            </Pressable>
          </View>
          <Text className="text-2xl font-medium text-black mt-2">
            {TEXT_TRANSLATE_INVIDUAL_HOME.LABEL.BALANCE_AMOUNT}
          </Text>
        </View>

        {/* ACTION BUTTONS */}
        <View className="flex-row justify-between mx-4 mt-4">
          <Pressable
            className="w-1/2 bg-white border border-gray-300 rounded-lg p-3 flex-row justify-center items-center mr-2"
            onPress={handleAddExpense}
          >
            <Text className="text-red-600 text-lg mr-2">↓</Text>
            <Text className="text-sm text-black">
              {TEXT_TRANSLATE_INVIDUAL_HOME.LABEL.ADD_EXPENSE}
            </Text>
          </Pressable>
          <Pressable
            className="w-1/2 bg-white border border-gray-300 rounded-lg p-3 flex-row justify-center items-center ml-2"
            onPress={handleAddIncome}
          >
            <Text className="text-green-600 text-lg mr-2">↑</Text>
            <Text className="text-sm text-black">
              {TEXT_TRANSLATE_INVIDUAL_HOME.LABEL.ADD_INCOME}
            </Text>
          </Pressable>
        </View>

        {/* PLACEHOLDER FOR CHART */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-4 shadow-sm items-center justify-center">
          <Text className="text-gray-500">
            {TEXT_TRANSLATE_INVIDUAL_HOME.PLACEHOLDER.CHART}
          </Text>
        </View>

        {/* PLACEHOLDER FOR CHAT BOT */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-4 shadow-sm items-center justify-center">
          <Text className="text-gray-500">
            {TEXT_TRANSLATE_INVIDUAL_HOME.PLACEHOLDER.CHAT_BOT}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaViewCustom>
  );
}
