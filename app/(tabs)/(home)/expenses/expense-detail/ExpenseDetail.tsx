import {
  BarChartExpenseCustom,
  FlatListCustom,
  LoadingSectionWrapper,
  ProgressCircleComponent,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import { Colors } from "@/helpers/constants/color";
import { PATH_NAME } from "@/helpers/constants/pathname";
import {
  calculateRemainingDays,
  formatCurrency,
  formatDate,
  formatTime,
} from "@/helpers/libs";
import { AntDesign, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import TEXT_TRANSLATE_EXPENSE_DETAIL from "./ExpenseDetail.translate";
import useExpenseDetail from "./hooks/useExpenseDetail";

export default function ExpenseDetail() {
  const { state, handler } = useExpenseDetail();
  const { personalTransactionFinancialGoals, CHART_DATA, isLoading } = state;

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
                color="#609084"
                iconName="fastfood"
                iconSize={30}
                iconColor="#609084"
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
                router.navigate(PATH_NAME.HOME.UPDATE_EXPENSE as any)
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
          data={CHART_DATA}
          categories={["Tuần", "Tháng"]}
          screenWidth={Dimensions.get("window").width}
        />
      </SectionComponent>
      <SectionComponent rootClassName="bg-white mx-4 pt-5 px-2 rounded-t-lg">
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
