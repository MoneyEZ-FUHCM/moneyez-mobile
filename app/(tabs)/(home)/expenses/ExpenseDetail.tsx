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

  const renderTransactionItem = ({ item }: any) => (
    <View className="mb-4 flex-row items-center bg-white py-2">
      <Ionicons name="flash-outline" size={20} color="blue" />
      <View className="ml-2 flex-1">
        <Text className="text-base font-normal">{item.name}</Text>
        <Text className="text-sm text-gray-500">
          {item.date} • {item.time}
        </Text>
      </View>
      <Text
        className={`text-base font-semibold ${
          item.amount < 0 ? "text-red" : "text-primary"
        }`}
      >
        {item.amount.toLocaleString()}đ
      </Text>
    </View>
  );

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
            <Ionicons name="fast-food-outline" size={24} color="#609084" />
            <Text className="ml-2 text-lg font-bold">
              {TEXT_TRANSLATE_EXPENSE_DETAIL.budgetTitle}
            </Text>
          </View>
          <TouchableOpacity>
            <Ionicons
              name="ellipsis-vertical-outline"
              size={24}
              color="#609084"
            />
          </TouchableOpacity>
        </View>
        <Text className="text-sm text-gray-500">
          {TEXT_TRANSLATE_EXPENSE_DETAIL.budgetSubtitle}
        </Text>
        <Text className="mt-2 text-sm font-bold">
          {TEXT_TRANSLATE_EXPENSE_DETAIL.budgetRemaining}{" "}
          <Text className="text-green-500">2.000.000đ</Text>
        </Text>
        <Text className="mt-2 text-sm text-gray-500">
          {TEXT_TRANSLATE_EXPENSE_DETAIL.budgetSpent}{" "}
          <Text className="text-green-500 font-bold">1.600.000đ</Text> /
          2.000.000đ
        </Text>
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
        <SectionComponent
          rootClassName={`mx-4 ${state.isLoading ? "h-[55%]" : ""} py-4 bg-white rounded-lg`}
        >
          <LoadingSectionWrapper isLoading={state.isLoading}>
            <FlatListCustom
              isBottomTab={true}
              data={TRANSACTIONS}
              renderItem={renderTransactionItem}
              keyExtractor={(item) => item.id.toString()}
              hasMore={TRANSACTIONS.length === 5}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={() => (
                <Text>{TEXT_TRANSLATE_EXPENSE_DETAIL.loadingMore}</Text>
              )}
              contentContainerStyle={{ paddingBottom: 500 }}
              onLoadMore={loadMoreData}
              isLoading={isLoading}
              ListEmptyComponent={() => (
                <View className="items-center justify-center px-5">
                  <Image
                    source={NoData}
                    className="h-[200px] w-full"
                    resizeMode="contain"
                  />
                </View>
              )}
            />
          </LoadingSectionWrapper>
        </SectionComponent>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
}
