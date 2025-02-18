import { SafeAreaViewCustom, SpaceComponent } from "@/components";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import TEXT_TRANSLATE_INVIDUAL_HOME from "./InvidualHome.translate";
import { PATH_NAME } from "@/helpers/constants/pathname";

export default function InvidualHome() {
  const router = useRouter();
  const { HOME } = PATH_NAME;


  const handleGoBack = () => {
    router.back();
  };

  const handleHistoryPress = () => {
    router.navigate(HOME.TRANSACTION_HISTORY as any)
  };

  const handleAddExpense = () => {
    router.navigate(HOME.ADD_TRANSACTION as any)
  };

  const handleAddIncome = () => {
    router.navigate(HOME.ADD_TRANSACTION as any)
  };

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* HEADER */}
        <View className="flex-row items-center bg-white p-4">
          <Pressable onPress={handleGoBack} className="pr-2">
            <Text className="text-lg text-black">←</Text>
          </Pressable>
          <Text className="ml-2 text-lg font-semibold text-black">
            {TEXT_TRANSLATE_INVIDUAL_HOME.TITLE.PERSONAL_EXPENSES}
          </Text>
        </View>

        {/* BALANCE CARD */}
        <View className="mx-4 mt-4 rounded-lg bg-white p-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-black">
              {TEXT_TRANSLATE_INVIDUAL_HOME.TITLE.TOTAL_BALANCE}
            </Text>
            <Pressable onPress={handleHistoryPress}>
              <Text className="text-xs text-gray-500">
                {TEXT_TRANSLATE_INVIDUAL_HOME.LABEL.TRANSACTION_HISTORY}
              </Text>
            </Pressable>
          </View>
          <Text className="mt-2 text-2xl font-medium text-black">
            {TEXT_TRANSLATE_INVIDUAL_HOME.LABEL.BALANCE_AMOUNT}
          </Text>
        </View>

        {/* ACTION BUTTONS */}
        <View className="mx-4 flex-row justify-between">
          <Pressable
            className="flex-1 flex-row items-center justify-center rounded-lg border border-gray-300 bg-white p-3"
            onPress={handleAddExpense}
          >
            <Text className="text-red-600 mr-2 text-lg">↓</Text>
            <Text className="text-sm text-black">
              {TEXT_TRANSLATE_INVIDUAL_HOME.LABEL.ADD_EXPENSE}
            </Text>
          </Pressable>
          <SpaceComponent width={20} />
          <Pressable
            className="flex-1 flex-row items-center justify-center rounded-lg border border-gray-300 bg-white p-3"
            onPress={handleAddIncome}
          >
            <Text className="text-green-600 mr-2 text-lg">↑</Text>
            <Text className="text-sm text-black">
              {TEXT_TRANSLATE_INVIDUAL_HOME.LABEL.ADD_INCOME}
            </Text>
          </Pressable>
        </View>

        {/* PLACEHOLDER FOR CHART */}
        <View className="mx-4 mt-4 items-center justify-center rounded-lg bg-white p-4 shadow-sm">
          <Text className="text-gray-500">
            {TEXT_TRANSLATE_INVIDUAL_HOME.PLACEHOLDER.CHART}
          </Text>
        </View>

        {/* PLACEHOLDER FOR CHAT BOT */}
        <View className="mx-4 mt-4 items-center justify-center rounded-lg bg-white p-4 shadow-sm">
          <Text className="text-gray-500">
            {TEXT_TRANSLATE_INVIDUAL_HOME.PLACEHOLDER.CHAT_BOT}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaViewCustom>
  );
}
