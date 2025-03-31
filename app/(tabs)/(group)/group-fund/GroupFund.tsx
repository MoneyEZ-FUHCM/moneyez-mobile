import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaViewCustom, SectionComponent } from "@/components";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import GROUP_FUND_CONSTANTS from "./GroupFund.constants";
import TEXT_TRANSLATE_GROUP_FUND from "./GroupFund.translate";

const GroupFund = () => {
  const { CHART_DATA, EXPENSES } = GROUP_FUND_CONSTANTS;
  const {
    CURRENT_FUND,
    STATISTICS,
    MEWMO,
    MEWMO_MESSAGE,
    EXPENSES: EXPENSES_TEXT,
    EXPENSE_QUESTION_1,
    EXPENSE_QUESTION_2,
  } = TEXT_TRANSLATE_GROUP_FUND;

  return (
    <SafeAreaViewCustom>
      <SectionComponent rootClassName="flex-row justify-between items-center h-14 px-4">
        <TouchableOpacity onPress={router.back}>
          <AntDesign name="arrowleft" size={24} color="#000000" />
        </TouchableOpacity>
        <View className="flex-row items-center gap-1">
          <Text className="text-lg font-bold text-black">
            01/01/2025 - 01/02/2025
          </Text>
        </View>
        <TouchableOpacity></TouchableOpacity>
      </SectionComponent>
      <ScrollView className="flex-1 bg-gray-100 p-4">
        <Text className="text-center text-xs font-normal text-gray-600">
          {CURRENT_FUND}
        </Text>
        <Text className="text-center text-2xl font-bold text-primary">
          1.000.000đ
        </Text>

        {/* Statistics Section */}
        <View className="mt-4 rounded-xl bg-white p-4">
          <Text className="text-base font-bold text-primary">{STATISTICS}</Text>
          {/* <BarChart
            data={CHART_DATA}
            width={360} // Adjusted width to account for padding
            height={250}
            fromZero={true}
            yAxisLabel="đ"
            yAxisSuffix="k"
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity = 1) => `rgba(96, 144, 132, ${opacity})`,
              propsForBackgroundLines: {
                strokeWidth: 0, // removes the lines
              },
            }}
            style={{ borderRadius: 12, marginLeft: 10, marginRight: 10 }}
          /> */}
        </View>
        {/* MewMo Reminder Section */}
        <View className="mt-2 rounded-xl border border-primary bg-superlight p-4">
          <View className="mb-3 flex-row items-center">
            <Image
              source={{
                uri: "https://file.hstatic.net/1000357256/article/meotai_badf1bea5286422db06b593f2700f94b_1024x1024.jpg",
              }}
              className="mr-2 h-8 w-8 rounded-full"
            />
            <Text className="font-bold text-primary">{MEWMO}</Text>
          </View>
          <View className="round bg-white">
            <Text className="text-sm text-gray-700">
              {MEWMO_MESSAGE}{" "}
              <Text className="text-green-600 font-bold">100.000đ</Text>.
            </Text>
          </View>
          <View className="mt-4 flex-row justify-between">
            <TouchableOpacity className="border-green-300 mr-2 w-1/2 rounded-lg border px-2 py-2">
              <Text className="text-xs text-gray-700">
                {EXPENSE_QUESTION_1}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="border-green-300 w-1/2 rounded-lg border px-2 py-2">
              <Text className="text-xs text-gray-700">
                {EXPENSE_QUESTION_2}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Expense Section */}
        <View className="mb-28 mt-2 rounded-xl bg-superlight p-4">
          <Text className="mb-4 text-xl font-bold">{EXPENSES_TEXT}</Text>
          {EXPENSES.map((expense) => (
            <View
              key={expense.id}
              className="mb-4 flex-row items-center justify-between"
            >
              <View className="flex-row items-center space-x-3">
                <View className="relative h-12 w-12 items-center justify-center rounded-full border-4 border-light">
                  <View
                    className={`absolute h-full w-full rounded-full border-4 border-primary`}
                    style={{
                      transform: [
                        { rotateZ: `${(expense.value * 360) / 100}deg` },
                      ],
                      borderRightColor: "transparent",
                      borderBottomColor: "transparent",
                    }}
                  />
                  <Text className="text-xs font-bold">{expense.value}%</Text>
                </View>

                {/* Thông tin chi tiêu */}
                <View>
                  <Text className="text-lg font-semibold">{expense.name}</Text>
                  <Text className="text-gray-500">ATB {expense.atb}</Text>
                </View>
              </View>

              {/* Số tiền */}
              <Text className="text-base font-semibold text-primary">
                {expense.amount}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaViewCustom>
  );
};

export default GroupFund;
