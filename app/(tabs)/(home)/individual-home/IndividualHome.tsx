import ArrowDown from "@/assets/icons/arrow-trend-down.png";
import ArrowUp from "@/assets/icons/arrow-trend-up.png";
import {
  BudgetSummaryComponent,
  LoadingSectionWrapper,
  PieChartCustom,
  SafeAreaViewCustom,
  ScrollViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Pressable,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import TEXT_TRANSLATE_INDIVIDUAL_HOME from "./IndividualHome.translate";
import useIndividualHome from "./hooks/useIndividualHome";
import SpendingBudgetComponent from "@/components/SpendingBudgetComponent";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { router } from "expo-router";
import { formatCurrency } from "@/helpers/libs";

export default function IndividualHome() {
  const { state, handler } = useIndividualHome();

  return (
    <SafeAreaViewCustom rootClassName="flex-1">
      {/* HEADER */}
      <SectionComponent rootClassName="h-14 bg-white justify-center">
        <View className="flex-row items-center justify-between px-5">
          <Pressable onPress={handler.handleGoBack}>
            <MaterialIcons name="arrow-back" size={24} />
          </Pressable>
          <Text className="text-lg font-bold">
            {TEXT_TRANSLATE_INDIVIDUAL_HOME.TITLE.PERSONAL_EXPENSES}
          </Text>
          <Text></Text>
        </View>
      </SectionComponent>
      <LoadingSectionWrapper isLoading={state.isLoading || state.isRefetching}>
        <ScrollViewCustom
          isBottomTab={true}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={handler.handleRefetch}
            />
          }
        >
          {/* BALANCE CARD */}
          <SectionComponent rootClassName="mx-5 mt-8 rounded-[10px] bg-white p-4 shadow-sm">
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-bold text-black">
                {TEXT_TRANSLATE_INDIVIDUAL_HOME.TITLE.TOTAL_BALANCE}
              </Text>
              <Pressable onPress={handler.handleHistoryPress}>
                <Text className="text-xs text-gray-500">
                  {TEXT_TRANSLATE_INDIVIDUAL_HOME.LABEL.TRANSACTION_HISTORY}
                </Text>
              </Pressable>
            </View>
            <Text className="mt-2 text-[28px] font-medium text-black">
              {state.currentUserSpendingModelData?.totalSpent}
            </Text>
            {/* ACTION BUTTONS */}
            <View className="mt-3 flex-row justify-between">
              <View className="flex-1 items-center justify-center rounded-[10px] border border-[#DFDFDF] px-3 py-2">
                <Pressable
                  className="flex-row items-center gap-x-2"
                  onPress={handler.handleAddExpense}
                >
                  <View className="rounded-[100%] bg-thirdly p-2">
                    <Image
                      source={ArrowDown}
                      className="h-6 w-6"
                      resizeMode="contain"
                    />
                  </View>
                  <Text className="ml-[5px] text-[12px] font-normal">
                    {TEXT_TRANSLATE_INDIVIDUAL_HOME.LABEL.ADD_EXPENSE}
                  </Text>
                </Pressable>
              </View>
              <SpaceComponent width={17} />
              <View className="flex-1 items-center justify-center rounded-[10px] border border-[#DFDFDF] px-3 py-2">
                <Pressable
                  className="flex-row items-center gap-x-2"
                  onPress={handler.handleAddIncome}
                >
                  <View className="rounded-[100%] bg-thirdly p-2">
                    <Image
                      source={ArrowUp}
                      className="h-6 w-6"
                      resizeMode="contain"
                    />
                  </View>
                  <Text className="ml-[5px] text-[12px] font-normal">
                    {TEXT_TRANSLATE_INDIVIDUAL_HOME.LABEL.ADD_INCOME}
                  </Text>
                </Pressable>
              </View>
            </View>
          </SectionComponent>

          {/* PLACEHOLDER FOR CHART */}
          <SectionComponent rootClassName="mx-5 mt-4 rounded-[10px] bg-white p-4 shadow-sm">
            <PieChartCustom
              data={state.actualCategories}
              title={TEXT_TRANSLATE_INDIVIDUAL_HOME.TITLE.OVERVIEW}
            />
          </SectionComponent>
          <SpaceComponent height={22} />
          {/* BUDGET CATEGORIES */}
          {state.personalFinancialGoalsData &&
          state.personalFinancialGoalsData?.length > 0 ? (
            <>
              <SpendingBudgetComponent
                data={state.personalFinancialGoalsData}
                onHeaderPress={handler.handleSpendingBudgetPress}
              />
              <SpaceComponent height={22} />
            </>
          ) : (
            <>
              <View className="mx-5 rounded-xl bg-white shadow-sm">
                <View className="px-4 pt-4">
                  <Text className="text-base font-bold">
                    Ngân sách chi tiêu
                  </Text>
                </View>

                <View className="items-center justify-center px-4 py-5">
                  <View className="h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <MaterialIcons
                      name="account-balance-wallet"
                      size={32}
                      color="#609084"
                    />
                  </View>
                  <Text className="mt-4 text-base font-medium text-gray-900">
                    Chưa có ngân sách nào
                  </Text>
                  <Text className="mx-5 mt-1 text-center text-sm text-gray-500">
                    Thêm ngân sách để theo dõi và kiểm soát chi tiêu của bạn
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      router.push(
                        PATH_NAME.HOME.ADD_SPENDING_BUDGET_STEP_1 as any,
                      )
                    }
                    className="mt-5 flex-row items-center justify-center rounded-lg bg-primary px-6 py-2.5 shadow-sm"
                  >
                    <MaterialIcons name="add" size={20} color="white" />
                    <Text className="ml-1 font-medium text-white">
                      Thêm ngân sách
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <SpaceComponent height={22} />
            </>
          )}
          <SectionComponent rootClassName="mx-5 ">
            <BudgetSummaryComponent
              button1Text={TEXT_TRANSLATE_INDIVIDUAL_HOME.BUTTON.AI_BUTTON_1}
              button2Text={TEXT_TRANSLATE_INDIVIDUAL_HOME.BUTTON.AI_BUTTON_2}
              onPressButton1={() => {}}
              onPressButton2={() => {}}
              summaryText={
                <>
                  {"Chào bạn mình là MewMo. Số dư hiện tại của bạn là"}{" "}
                  <Text className="font-medium text-green">
                    {formatCurrency(
                      state.currentUserSpendingModelData?.totalSaving,
                    )}
                    .
                  </Text>
                </>
              }
            />
          </SectionComponent>
        </ScrollViewCustom>
      </LoadingSectionWrapper>
    </SafeAreaViewCustom>
  );
}
