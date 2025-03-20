import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  FlatListCustom,
  LoadingSectionWrapper,
  ProgressCircleComponent,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import NoData from "@/assets/images/InviteMemberAssets/not-found-result.png";
import TEXT_TRANSLATE_EXPENSE_DETAIL from "./ExpenseDetail.translate";
import { useExpenseDetail } from "./hooks/useExpenseDetail";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { router } from "expo-router";
import { formatCurrency } from "@/helpers/libs";
import { BarChartCustom } from "@/components/ExpenseDetailCustom/BarChartCustom";
export default function ExpenseDetail() {
  const { state, handler } = useExpenseDetail();
  const { TRANSACTIONS, CHART_DATA, isLoading } = state;
  const { loadMoreData } = handler;
  const PRIMARY_COLOR = "#609084";

  const renderTransactionItem = ({ item }: { item: any }) => (
    <View className="flex-row items-center justify-between border-b border-white bg-white p-5 py-3">
      <View className="flex-1 flex-row items-center gap-3.5">
        <View className="items-center justify-center">
          <MaterialIcons name="bolt" size={30} color="#609084" />
        </View>
        <View className="mr-2 flex-1">
          <Text className="text-base font-medium text-black">{item.name}</Text>
          <View className="flex-row">
            <Text className="mr-3 text-sm text-[#929292]">{item?.date}</Text>
            <Text className="text-sm text-[#929292]">• {item?.time}</Text>
          </View>
        </View>
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
  const renderListHeader = () => (
    <>
      <SectionComponent rootClassName="bg-white pt-5 px-5 pb-2 rounded-lg mb-2">
        <View className="mb-2 flex-row items-center justify-between">
          <View className="flex-row items-start">
            <View className="relative h-14 w-14 items-center justify-center">
              {/* Biểu tượng ở giữa */}
              <ProgressCircleComponent
                value={1.6 / 2}
                size={56}
                color="#609084"
                iconName="fastfood"
                iconSize={24}
                iconColor="#609084"
              />
            </View>
            <View className="ml-4">
              <View>
                <Text className="text-lg font-bold">
                  {TEXT_TRANSLATE_EXPENSE_DETAIL.BUDGET_TITLE}
                </Text>
                <Text className="text-sm text-gray-500">
                  {TEXT_TRANSLATE_EXPENSE_DETAIL.BUDGET_SUBTITLE}
                </Text>
                <Text className="text-sm font-bold">
                  {TEXT_TRANSLATE_EXPENSE_DETAIL.BUDGET_REMAINING}{" "}
                  <Text className="text-green-500">2.000.000đ</Text>
                </Text>
                <View className="my-1 h-[1px] bg-gray-300" />
                <Text className="flex-wrap text-sm text-gray-500">
                  {TEXT_TRANSLATE_EXPENSE_DETAIL.BUDGET_SPENT}{" "}
                  <Text className="text-green-500 font-bold">1.600.000đ</Text> /
                  2.000.000đ
                </Text>
              </View>
            </View>
          </View>
          <View className="mt-[-50px]">
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
        </View>
      </SectionComponent>
      {/* Xu hướng chi tiêu */}
      <SectionComponent rootClassName="bg-white p-5 rounded-lg mb-2">
        <Text className="pb-2 pl-2 text-lg font-bold text-black">
          {TEXT_TRANSLATE_EXPENSE_DETAIL.SPENDING_TREND}
        </Text>
        <BarChartCustom
          data={CHART_DATA}
          categories={["Theo Tuần", "Theo Tháng"]}
          screenWidth={Dimensions.get("window").width}
        />
      </SectionComponent>
      <SectionComponent rootClassName="bg-white pt-5 px-5 rounded-lg">
        <View className="flex-row items-center justify-between">
          <Text className="pl-2 text-lg font-bold text-black">
            {TEXT_TRANSLATE_EXPENSE_DETAIL.TRANSACTION_LIST_TITLE}
          </Text>
        </View>
      </SectionComponent>
    </>
  );

  return (
    <SafeAreaViewCustom rootClassName="relative bg-[#fafafa]">
      {/* HEADER */}
      <SectionComponent rootClassName="relative bg-white shadow-md h-14 flex-row items-center justify-center">
        <TouchableOpacity
          onPress={handler.handleGoBack}
          className="absolute left-3 rounded-full p-2"
        >
          <AntDesign name="close" size={24} color={PRIMARY_COLOR} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-primary">
          {TEXT_TRANSLATE_EXPENSE_DETAIL.HEADER_TITLE}
        </Text>
        <TouchableOpacity className="absolute right-3 rounded-full p-2">
          <AntDesign name="reload1" size={24} color={PRIMARY_COLOR} />
        </TouchableOpacity>
      </SectionComponent>

      {/* Danh sách giao dịch */}
      <SectionComponent>
        <SectionComponent rootClassName="bg-[#fafafa] rounded-lg">
          <LoadingSectionWrapper isLoading={isLoading}>
            {TRANSACTIONS && TRANSACTIONS.length > 0 ? (
              <FlatListCustom
                className=""
                showsVerticalScrollIndicator={false}
                data={TRANSACTIONS}
                isBottomTab={true}
                isLoading={isLoading}
                ListHeaderComponent={renderListHeader}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderTransactionItem}
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
