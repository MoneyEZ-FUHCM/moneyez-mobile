import ArrowDown from "@/assets/icons/arrow-trend-down.png";
import ArrowUp from "@/assets/icons/arrow-trend-up.png";
import {
  BudgetSummaryComponent,
  LoadingSectionWrapper,
  ModalLizeComponent,
  PieChartCustom,
  SafeAreaViewCustom,
  ScrollViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import SpendingBudgetComponent from "@/components/SpendingBudgetComponent";
import { Colors } from "@/helpers/constants/color";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { formatCurrency } from "@/helpers/libs";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TEXT_TRANSLATE_INDIVIDUAL_HOME from "./IndividualHome.translate";
import useIndividualHome from "./hooks/useIndividualHome";

export default function IndividualHome() {
  const { state, handler } = useIndividualHome();

  const renderRulesContent = () => {
    return (
      <View className="p-5">
        <Text className="mb-4 text-center text-xl font-bold text-black">
          Quy tắc phân loại & Mô hình
        </Text>

        <View className="mb-4">
          <View className="mb-2 flex-row items-center">
            <MaterialIcons
              name="check-circle"
              size={20}
              color={Colors.colors.primary}
            />
            <Text className="ml-2 mr-2 text-base">
              Mọi mô hình đều sẽ có danh mục là 'Khoản thu' với tỉ lệ là 0%
            </Text>
          </View>

          <View className="mb-2 flex-row items-center">
            <MaterialIcons
              name="check-circle"
              size={20}
              color={Colors.colors.primary}
            />
            <Text className="ml-2 mr-2 text-base">
              <Text className="font-bold text-primary">MoneyEZ</Text> đang ghi
              nhận 'Tiết kiệm' là 1 khoản chi (giống kiểu tiền bỏ vào ống heo)
            </Text>
          </View>

          <View className="mb-2 flex-row items-center">
            <MaterialIcons
              name="check-circle"
              size={20}
              color={Colors.colors.primary}
            />
            <Text className="ml-2 mr-2 text-base">
              Các danh mục trong mô hình buộc có tổng là 100%
            </Text>
          </View>

          <View className="mb-2 mr-2 flex-row items-center">
            <MaterialIcons
              name="check-circle"
              size={20}
              color={Colors.colors.primary}
            />
            <Text className="ml-2 text-base">
              Người dùng chỉ có thể chọn để sử dụng các mô hình đã được thiết
              lập trên hệ thống
            </Text>
          </View>

          <View className="flex-row items-center">
            <MaterialIcons
              name="check-circle"
              size={20}
              color={Colors.colors.primary}
            />
            <Text className="ml-2 mr-2 text-base">
              Người dùng cần hủy mô hình đang dùng trước khi chuyển qua mô hình
              mới
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className="mt-5 rounded-lg bg-primary py-3"
          onPress={() => state.modalizeRef.current?.close()}
        >
          <Text className="text-center font-medium text-white">Đóng</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaViewCustom>
        <SectionComponent rootClassName="h-14 bg-white justify-center">
          <View className="flex-row items-center justify-between px-5">
            <Pressable onPress={handler.handleGoBack}>
              <MaterialIcons name="arrow-back" size={24} />
            </Pressable>
            <Text className="text-lg font-bold">
              {TEXT_TRANSLATE_INDIVIDUAL_HOME.TITLE.PERSONAL_EXPENSES}
            </Text>
            <Pressable onPress={handler.openRulesModal}>
              <FontAwesome6 name="circle-question" size={24} />
            </Pressable>
          </View>
        </SectionComponent>
        <LoadingSectionWrapper
          isLoading={state.isLoading || state.isRefetching}
        >
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

            <SectionComponent rootClassName="mx-5 mt-4 rounded-[10px] bg-white p-4 shadow-sm">
              <PieChartCustom
                data={state.actualCategories}
                title={TEXT_TRANSLATE_INDIVIDUAL_HOME.TITLE.OVERVIEW}
              />
            </SectionComponent>
            <SpaceComponent height={22} />
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
                        color={Colors.colors.primary}
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
      <ModalLizeComponent ref={state.modalizeRef}>
        {renderRulesContent()}
      </ModalLizeComponent>
    </GestureHandlerRootView>
  );
}
