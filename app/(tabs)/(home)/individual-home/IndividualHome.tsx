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
import { Image, Pressable, Text, View } from "react-native";
import TEXT_TRANSLATE_INDIVIDUAL_HOME from "./IndividualHome.translate";
import useIndividualHome from "./hooks/useIndividualHome";

export default function IndividualHome() {
  const { state, handler } = useIndividualHome();

  return (
    <SafeAreaViewCustom rootClassName="flex-1">
      {/* HEADER */}
      <SectionComponent rootClassName="h-14 bg-white justify-center">
        <View className="flex-row items-center justify-between px-5">
          <Pressable onPress={handler.handleGoBack}>
            <MaterialIcons name="arrow-back" size={24} color="#609084" />
          </Pressable>
          <Text className="text-lg font-bold text-primary">
            {TEXT_TRANSLATE_INDIVIDUAL_HOME.TITLE.PERSONAL_EXPENSES}
          </Text>
          <Text></Text>
        </View>
      </SectionComponent>
      <LoadingSectionWrapper isLoading={state.isLoading}>
        <ScrollViewCustom
          isBottomTab={true}
          showsVerticalScrollIndicator={false}
        >
          {/* BALANCE CARD */}
          <SectionComponent rootClassName="mx-5 mt-8 rounded-[10px] bg-white p-4 shadow-sm">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-black">
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

          {/* PLACEHOLDER FOR CHAT BOT */}
          <SectionComponent rootClassName="mx-5 mt-5">
            <BudgetSummaryComponent
              button1Text={TEXT_TRANSLATE_INDIVIDUAL_HOME.BUTTON.AI_BUTTON_1}
              button2Text={TEXT_TRANSLATE_INDIVIDUAL_HOME.BUTTON.AI_BUTTON_2}
              onPressButton1={() => {}}
              onPressButton2={() => {}}
              summaryText={
                <>
                  Tháng này bạn đã chi{" "}
                  <Text className="font-medium text-red">7859$</Text> cho dịch
                  vụ 1, <Text className="font-medium text-red">1,123$</Text> cho
                  dịch vụ 2.{" "}
                  <Text className="font-medium text-red">Tăng 3%</Text> so với
                  tháng trước, bạn nên chi tiêu cho dịch vụ 1 này cân nhắc hơn
                  để không vượt quá mục tiêu chi tiêu.
                </>
              }
            />
          </SectionComponent>
        </ScrollViewCustom>
      </LoadingSectionWrapper>
    </SafeAreaViewCustom>
  );
}
