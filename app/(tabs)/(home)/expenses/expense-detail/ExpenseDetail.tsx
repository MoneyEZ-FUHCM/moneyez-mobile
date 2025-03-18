import React from "react";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { ProgressBar } from "react-native-paper";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  BarChartCustom,
  FlatListCustom,
  LoadingSectionWrapper,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import NoData from "@/assets/images/InviteMemberAssets/not-found-result.png";
import TEXT_TRANSLATE_EXPENSE_DETAIL from "./ExpenseDetail.translate";
import { useExpenseDetail } from "./hooks/useExpenseDetail";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { router } from "expo-router";

export default function ExpenseDetail() {
  const { state, handler } = useExpenseDetail();
  const { TRANSACTIONS, CHART_DATA, isLoading } = state;
  const { loadMoreData } = handler;

  return (
    <SafeAreaViewCustom>
      {/* HEADER */}
      <SectionComponent rootClassName="h-14 bg-white justify-center mb-2">
        <View className="flex-row items-center justify-between px-5">
          <Pressable onPress={handler.handleGoBack}>
            <MaterialIcons name="arrow-back" size={24} color="#609084" />
          </Pressable>
          <Text className="text-lg font-bold text-black">
            {TEXT_TRANSLATE_EXPENSE_DETAIL.headerTitle}
          </Text>
          <Text></Text>
        </View>
      </SectionComponent>
      <SectionComponent rootClassName="bg-white p-5 rounded-lg mb-2">
        <View className="mb-2 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="h-14 w-14 items-center justify-center rounded-full border-[7px] border-primary bg-white">
              <Ionicons name="fast-food" size={24} color="#609084" />
            </View>
            <View className="ml-4">
              <View>
                <Text className="text-lg font-bold">
                  {TEXT_TRANSLATE_EXPENSE_DETAIL.budgetTitle}
                </Text>
                <Text className="text-sm text-gray-500">
                  {TEXT_TRANSLATE_EXPENSE_DETAIL.budgetSubtitle}
                </Text>
                <Text className="text-sm font-bold">
                  {TEXT_TRANSLATE_EXPENSE_DETAIL.budgetRemaining}{" "}
                  <Text className="text-green-500">2.000.000đ</Text>
                </Text>
                <View className="my-1 h-[1px] w-full bg-gray-300" />
                <Text className="flex-wrap text-sm text-gray-500">
                  {TEXT_TRANSLATE_EXPENSE_DETAIL.budgetSpent}{" "}
                  <Text className="text-green-500 font-bold">1.600.000đ</Text> /
                  2.000.000đ
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() =>
              router.navigate(PATH_NAME.HOME.UPDATE_EXPENSE as any)
            }
          >
            <Ionicons
              name="ellipsis-vertical-outline"
              size={24}
              color="#609084"
            />
          </TouchableOpacity>
        </View>

        <ProgressBar
          progress={1.6 / 2}
          color="#609084"
          className="mt-2 h-2 rounded-full"
        />
      </SectionComponent>
      {/* Xu hướng chi tiêu */}
      <SectionComponent rootClassName="bg-white p-5 rounded-lg mb-4">
        <BarChartCustom
          data={CHART_DATA}
          categories={["Theo Tuần", "Theo Tháng"]}
          screenWidth={Dimensions.get("window").width}
        />
      </SectionComponent>
      {/* Danh sách giao dịch */}
      <SectionComponent rootClassName="bg-white p-5 ">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-lg font-bold">
            {TEXT_TRANSLATE_EXPENSE_DETAIL.transactionListTitle}
          </Text>
          <TouchableOpacity
            className="rounded-lg bg-primary p-3"
            onPress={() =>
              router.navigate(PATH_NAME.HOME.PERIOD_HISTORY_DETAIL as any)
            }
          >
            <Text className="text-center font-bold text-white">
              {TEXT_TRANSLATE_EXPENSE_DETAIL.more}
            </Text>
          </TouchableOpacity>
        </View>
        <SectionComponent rootClassName="bg-white rounded-lg mb-14">
          <LoadingSectionWrapper isLoading={isLoading}>
            {TRANSACTIONS && TRANSACTIONS.length > 0 ? (
              <FlatListCustom
                className="mx-5 pt-5"
                showsVerticalScrollIndicator={false}
                data={TRANSACTIONS}
                isBottomTab={true}
                isLoading={isLoading}
                hasMore={TRANSACTIONS.length === 5}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity className="mb-2 flex-row items-center bg-white shadow-lg">
                    <Ionicons name="flash-outline" size={20} color="blue" />
                    <View className="ml-4 flex-1 space-y-1">
                      <Text className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </Text>
                      <View className="flex-row items-center justify-between">
                        <Text className="text-base text-gray-700">
                          {item.date} • {item.time}
                        </Text>
                        <Text
                          className={`text-base font-semibold ${
                            item.amount < 0 ? "text-red" : "text-primary"
                          }`}
                        >
                          {item.amount.toLocaleString()}đ
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                onLoadMore={loadMoreData}
              />
            ) : (
              <View className="mt-36 items-center justify-center px-5">
                <Image
                  source={NoData}
                  className="h-[400px] w-full"
                  resizeMode="contain"
                />
              </View>
            )}
          </LoadingSectionWrapper>
        </SectionComponent>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
}
