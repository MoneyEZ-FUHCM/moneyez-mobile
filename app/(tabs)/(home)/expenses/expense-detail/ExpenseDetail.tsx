import Admin from "@/assets/images/logo/avatar_admin.jpg";
import {
  BarChartExpenseCustom,
  FlatListCustom,
  LoadingSectionWrapper,
  ProgressCircleComponent,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import { Colors } from "@/helpers/constants/color";
import {
  calculateRemainingDays,
  formatCurrency,
  formatDate,
  formatTime,
} from "@/helpers/libs";
import { AntDesign, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import TEXT_TRANSLATE_EXPENSE_DETAIL from "./ExpenseDetail.translate";
import useExpenseDetail from "./hooks/useExpenseDetail";

export default function ExpenseDetail() {
  const { state, handler } = useExpenseDetail();
  const { personalTransactionFinancialGoals, isLoading } = state;

  const renderTransactionItem = ({ item }: { item: any }) => (
    <TouchableOpacity className="mx-4 flex-row items-center justify-between border-b border-[#f0f0f0] bg-white px-2 py-3">
      <View className="flex-1 flex-row items-center gap-1.5">
        <View className="h-12 w-12 items-center justify-center rounded-full">
          <MaterialIcons
            name={item?.subcategoryIcon}
            size={30}
            color="#609084"
          />
        </View>
        <View className="flex-1">
          <Text className="text-base font-medium text-black">
            {item?.subcategoryName
              ? item.subcategoryName.charAt(0).toUpperCase() +
                item.subcategoryName.slice(1)
              : ""}
          </Text>
          <View className="flex-row">
            <Text className="mr-3 text-sm text-[#929292]">
              {formatDate(item?.transactionDate)}
            </Text>
            <Text className="text-sm text-[#929292]">
              • {formatTime(item?.transactionDate)}
            </Text>
          </View>
        </View>
      </View>
      <Text
        className={`text-base font-semibold ${item?.type === "INCOME" ? "text-[#00a010]" : "text-[#cc0000]"}`}
      >
        {item?.type === "INCOME" ? "+" : "-"} {formatCurrency(item?.amount)}
      </Text>
    </TouchableOpacity>
  );

  const renderListHeader = () => (
    <>
      <SectionComponent rootClassName="bg-white mx-4 my-2 pt-5 px-5 pb-2 rounded-lg">
        <View className="relative mb-2 flex-row items-center justify-between">
          <View className="w-full flex-row items-center space-x-7">
            <View className="h-14 w-14 items-center justify-center">
              <ProgressCircleComponent
                value={
                  state.financialGoalDetail?.currentAmount /
                  state.financialGoalDetail?.targetAmount
                }
                size={80}
                thickness={11}
                iconName={state.financialGoalDetail?.subcategoryIcon}
                iconSize={30}
                isSaving={state.financialGoalDetail.isSaving}
              />
            </View>
            <View className="w-full flex-1">
              <View className="">
                <Text className="mb-1 text-lg font-bold">
                  {state.financialGoalDetail?.name}
                </Text>
                <Text className="text-base text-gray-500">
                  Chi tiêu cho{" "}
                  <Text className="text-sm font-bold">
                    {calculateRemainingDays(
                      state.financialGoalDetail?.deadline,
                    )}
                  </Text>{" "}
                  ngày
                </Text>
                <Text className="text-sm">
                  {TEXT_TRANSLATE_EXPENSE_DETAIL.BUDGET_REMAINING}
                  {"  "}
                  <Text className="text-green-500 font-bold">
                    {formatCurrency(
                      state.financialGoalDetail?.targetAmount -
                        state.financialGoalDetail?.currentAmount,
                    )}
                  </Text>
                </Text>
                <View className="my-1 h-[1px] w-full bg-gray-300" />
                <Text className="flex-wrap text-sm text-gray-500">
                  {TEXT_TRANSLATE_EXPENSE_DETAIL.BUDGET_SPENT}
                  {"  "}
                  <Text className="text-green-500 font-bold">
                    {formatCurrency(state.financialGoalDetail?.currentAmount)}
                  </Text>{" "}
                  / {formatCurrency(state.financialGoalDetail?.targetAmount)}
                </Text>
              </View>
            </View>
          </View>
          <View className="absolute right-0 top-0">
            <TouchableOpacity
              onPress={() =>
                handler.handleNavigateAndUpdate(state.financialGoalDetail)
              }
            >
              <FontAwesome6
                name="edit"
                size={20}
                color={Colors.colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SectionComponent>
      {/* Xu hướng chi tiêu */}
      <SectionComponent rootClassName="bg-white mx-4 px-2 py-5 rounded-lg mb-2">
        <Text className="pb-2 text-lg font-bold text-black">
          {TEXT_TRANSLATE_EXPENSE_DETAIL.SPENDING_TREND}
        </Text>
        <BarChartExpenseCustom
          data={state.personalTransactionFinancialGoalChart}
          screenWidth={Dimensions.get("window").width}
        />
      </SectionComponent>
      {/* AI NOTICE */}
      <LinearGradient
        colors={
          state.financialGoalDetail.prediction.isOnTrack
            ? [Colors.colors.secondary, Colors.colors.thirdly]
            : ["#fa3916df", "#fdd1d1d5"]
        }
        className="m-4 overflow-hidden rounded-3xl shadow-2xl"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center space-x-2 p-4">
            <View className="rounded-full bg-white/20 p-1">
              <Image
                source={Admin}
                className="h-12 w-12 rounded-full border-2 border-white/30"
                resizeMode="cover"
              />
            </View>
            <Text className="text-lg font-bold drop-shadow-md">MewMo</Text>
          </View>
          <View className="rounded-l-2xl bg-white/80 p-2">
            <Text className="font-semibold">
              {state.financialGoalDetail.prediction.isOnTrack
                ? "Đúng Tiến Độ"
                : "Sai Tiến Độ"}
            </Text>
          </View>
        </View>

        {/* Content Container */}
        <View className="px-4">
          {/* Title */}
          <Text className="mb-4 text-center text-xl font-bold text-[#2c4a42]">
            Dự Báo{" "}
            {state.financialGoalDetail?.isSaving ? "Tiết Kiệm" : "Chi tiêu"}
          </Text>

          {/* Progress Overview */}
          <View className="mb-4 flex-row justify-between rounded-2xl bg-white/80 p-4 shadow-md">
            <View className="flex-1 items-center border-r border-[#bad8b6] pr-2">
              <Text className="mb-1 text-xs uppercase tracking-wider text-[#609084]">
                Tiến Độ Hiện Tại
              </Text>
              <Text className="text-xl font-bold text-[#2c4a42]">
                {state.financialGoalDetail.prediction.totalProgress}%
              </Text>
            </View>

            <View className="flex-1 items-center pl-2">
              <Text className="mb-1 text-xs uppercase tracking-wider text-[#609084]">
                Ngày Còn Lại
              </Text>
              <Text className="text-xl font-bold text-[#2c4a42]">
                {state.financialGoalDetail.prediction.remainingDays} ngày
              </Text>
            </View>
          </View>
          <View className="mb-4 rounded-2xl bg-white/90 p-4 shadow-md">
            <Text className="mb-4 text-center text-sm italic text-[#609084]">
              {state.financialGoalDetail.prediction.trendDescription}
            </Text>
            <View className="space-y-3">
              {[
                {
                  label: `Mức ${state.financialGoalDetail.isSaving ? "Tiết kiệm" : "Chi tiêu"} Trung Bình:`,
                  value:
                    formatCurrency(
                      state.financialGoalDetail.prediction.averageChangePerDay,
                    ) + "/ngày",
                },
                {
                  label: "Mục Tiêu Hằng Ngày:",
                  value:
                    formatCurrency(
                      state.financialGoalDetail.prediction.requiredDailyChange,
                    ) + "/ngày",
                },
                {
                  label: `Ngày Dự Kiến ${state.financialGoalDetail?.isSaving ? "Hoàn Thành" : "Kết Thúc Chi Tiêu"}:`,
                  value: formatDate(
                    state.financialGoalDetail.prediction
                      .predictedCompletionDate,
                  ),
                },
              ]?.map((item, index) => (
                <View
                  key={index}
                  className={`flex-row items-center justify-between pb-3 ${
                    index < 2 ? "border-b border-[#bad8b6]" : ""
                  }`}
                >
                  <Text className="text-sm text-[#2c4a42]">{item.label}</Text>
                  <Text className="text-sm font-bold text-[#609084]">
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </LinearGradient>

      <SectionComponent rootClassName="bg-white pt-4 mx-4 px-2 rounded-t-lg">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold text-black">
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
          onPress={handler.handleBack}
          className="absolute left-3 rounded-full p-2"
        >
          <MaterialIcons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text className="text-lg font-bold">
          {TEXT_TRANSLATE_EXPENSE_DETAIL.HEADER_TITLE}
        </Text>
        {/* Remove reload button */}
      </SectionComponent>

      {/* Danh sách giao dịch */}
      <LoadingSectionWrapper isLoading={isLoading || state.isFetchingRefresh}>
        <SectionComponent rootClassName="bg-[#fafafa] rounded-lg">
          {state.financialGoalDetail && (
            <FlatListCustom
              showsVerticalScrollIndicator={false}
              data={personalTransactionFinancialGoals ?? []}
              isBottomTab={true}
              hasMore={
                state.getPersonalTransactionFinancialGoals?.items?.length ===
                state.pageSize
              }
              isLoading={state.isLoadingMore}
              ListHeaderComponent={renderListHeader}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderTransactionItem}
              onLoadMore={handler.handleLoadMore}
              refreshing={state.isFetchingRefresh}
              onRefresh={handler.handleRefresh}
              ListEmptyComponent={
                <View className="flex-1 items-center justify-center p-6">
                  <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                    <AntDesign
                      name="file1"
                      size={32}
                      color={Colors.colors.primary}
                    />
                  </View>
                  <Text>Không có dữ liệu</Text>
                </View>
              }
            />
          )}
        </SectionComponent>
      </LoadingSectionWrapper>
    </SafeAreaViewCustom>
  );
}
