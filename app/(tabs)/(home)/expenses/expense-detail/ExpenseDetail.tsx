import React from "react";
import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
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
  const PRIMARY_COLOR = "#609084";

  return (
    <SafeAreaViewCustom rootClassName="relative">
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
      <SectionComponent rootClassName="bg-white p-5 rounded-lg mb-2">
        <View className="mb-2 flex-row items-center justify-between">
          <View className="flex-row items-start">
            <View className="relative h-14 w-14 items-center justify-center">
              {/* Viền xám (chưa hoàn thành) */}
              <View className="absolute inset-0 rounded-full border-[15px] border-gray-300" />

              {/* Vòng tròn xanh hiển thị tiến trình */}
              <View
                className="absolute inset-0 rounded-full border-[7px] border-primary"
                style={{
                  transform: [{ rotate: `${(79 / 100) * 360}deg` }],
                  borderTopColor: "transparent",
                  borderRightColor: "transparent",
                }}
              />

              {/* Biểu tượng ở giữa */}
              <View className="z-10 h-10 w-10 items-center justify-center rounded-full bg-white">
                <Ionicons name="fast-food" size={24} color="#609084" />
              </View>
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

        {/* 
        <ProgressBar
          progress={1.6 / 2}
          color="#609084"
          className="mt-2 h-2 rounded-full"
        /> */}
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
            {TEXT_TRANSLATE_EXPENSE_DETAIL.TRANSACTION_LIST_TITLE}
          </Text>
          <TouchableOpacity
            onPress={() =>
              router.navigate(PATH_NAME.HOME.PERIOD_HISTORY_DETAIL as any)
            }
          >
            <Text className="mb-2 text-center font-bold text-primary">
              {TEXT_TRANSLATE_EXPENSE_DETAIL.MORE}
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
