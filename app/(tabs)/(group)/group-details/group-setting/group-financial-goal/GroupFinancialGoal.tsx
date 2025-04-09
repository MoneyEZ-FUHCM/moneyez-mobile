import {
  LoadingSectionWrapper,
  ProgressCircleComponent,
  SafeAreaViewCustom,
  SectionComponent,
  ModalLizeComponent
} from "@/components";
import { ScrollViewCustom } from "@/components/ScrollViewCustom";
import { AntDesign, MaterialIcons, Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { ActivityIndicator, Text, View, TouchableOpacity } from "react-native";
import TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL from "./GroupFinancialGoal.translate";
import useGroupFinancialGoal from "./hooks/useGroupFinancialGoal";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function GroupFinancialGoal() {
  const { state, handler } = useGroupFinancialGoal();
  const { LABELS, BUTTON, TITLE } = TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL;
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const handlePressOutside = () => {
    if (showOptions) {
      setShowOptions(false);
    }
  };

  const renderGoalProgress = () => {
    if (!state.hasExistingGoal) return null;

    return (
      <SectionComponent rootClassName="rounded-[16px] bg-white p-5 shadow-sm">
        <Text className="text-lg font-semibold mb-4">{LABELS.PROGRESS}</Text>
        <View className="items-center">
          <ProgressCircleComponent
            value={(state.financialGoal.currentAmount / state.financialGoal.targetAmount)
              > 1 ? 1 : state.financialGoal.currentAmount / state.financialGoal.targetAmount}
            size={100}
            thickness={5}
            showPercentage={true}
          />
        </View>

        <View className="flex-row justify-between mt-6">
          <View>
            <Text className="text-sm text-[#848484]">{LABELS.CURRENT_AMOUNT}</Text>
            <Text className="text-base font-semibold text-[#609084]">
              {handler.formatCurrency(state.financialGoal?.currentAmount || 0)}
            </Text>
          </View>

          <View className="items-end">
            <Text className="text-sm text-[#848484]">{LABELS.TARGET_AMOUNT}</Text>
            <Text className="text-base font-semibold">
              {handler.formatCurrency(state.financialGoal?.targetAmount || 0)}
            </Text>
          </View>
        </View>

        <View className="bg-gray-100 rounded-md p-4 mt-5">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center space-x-2">
              <MaterialIcons name="calendar-today" size={20} color="#609084" />
              <Text className="text-[#000] ml-2">
                {state.isGoalCompleted
                  ? LABELS.COMPLETED
                  : LABELS.DAYS_LEFT.replace("{{days}}", state.daysLeft.toString())}
              </Text>
            </View>
            <Text className="text-[#848484]">
              {handler.formatDate(state.financialGoal?.deadline, "DD.MM.YYYY")}
            </Text>
          </View>
        </View>
      </SectionComponent>
    );
  };

  const renderGoalDetails = () => {
    if (!state.hasExistingGoal) return null;

    return (
      <SectionComponent rootClassName="mt-5 rounded-[16px] bg-white p-5 shadow-sm">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold flex-1">{state.financialGoal?.name}</Text>

          <TouchableOpacity
            onPress={toggleOptions}
            className="p-3.5"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="more-vertical" size={26} color="#666" />
          </TouchableOpacity>

          {showOptions && (
            <>
              <TouchableOpacity
                activeOpacity={0}
                onPress={handlePressOutside}
                className="absolute inset-0 z-10"
                style={{ top: -100, left: -100, right: -100, bottom: -500 }}
              />
              <View
                className="absolute bg-white shadow-lg rounded-lg z-20 right-0 top-10"
                style={{
                  minWidth: 180,
                  elevation: 5
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setShowOptions(false);
                    handler.handleOpenDeleteModal();
                  }}
                  className="flex-row items-center py-4 px-6"
                >
                  <AntDesign name="delete" size={20} color="#dd6b55" />
                  <Text className="ml-3.5 text-[#dd6b55] font-medium text-base">{BUTTON.DELETE}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        <View className="space-y-3">
          <View className="flex-row justify-between">
            <Text className="text-[#848484]">{LABELS.GOAL_STATUS}</Text>
            <Text className="font-medium text-[#609084]">
              {handler.getStatusText(state.financialGoal?.status || 1)}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-[#848484]">{LABELS.APPROVAL_STATUS}</Text>
            <Text className="font-medium text-[#609084]">
              {handler.getApprovalStatusText(state.financialGoal?.approvalStatus || 1)}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-[#848484]">{LABELS.CREATED_DATE}</Text>
            <Text className="text-[#000]">
              {handler.formatDate(state.financialGoal?.createdDate, "DD.MM.YYYY")}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handler.handleNavigateToUpdate}
          className="bg-[#609084] h-12 rounded-lg mt-5 overflow-hidden"
          activeOpacity={0.85}
        >
          <View className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-5" />
          <View className="flex-row items-center justify-center h-full">
            <AntDesign name="edit" size={18} color="white" />
            <Text className="ml-2 text-white font-semibold">{BUTTON.UPDATE}</Text>
          </View>
        </TouchableOpacity>
      </SectionComponent>
    );
  };

  const renderEmptyState = () => {
    if (state.hasExistingGoal) return null;

    return (
      <SectionComponent rootClassName="mt-5 rounded-[16px] bg-white p-6 shadow-sm items-center">
        <AntDesign name="flag" size={70} color="#609084" />

        <View className="items-center mt-5">
          <Text className="text-xl font-semibold">{LABELS.NO_GOAL}</Text>
          <Text className="text-center text-[#848484] mt-3 leading-5">
            {LABELS.CREATE_GOAL_DESCRIPTION}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handler.handleNavigateToCreate}
          className="bg-[#609084] h-12 rounded-lg mt-6 w-full overflow-hidden"
          activeOpacity={0.85}
        >
          <View className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-5" />
          <View className="flex-row items-center justify-center h-full">
            <AntDesign name="plus" size={18} color="white" />
            <Text className="ml-2 text-white font-semibold">{BUTTON.CREATE}</Text>
          </View>
        </TouchableOpacity>
      </SectionComponent>
    );
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaViewCustom rootClassName="bg-[#f9f9f9] flex-1">
        <StatusBar style="auto" />

        <SectionComponent rootClassName="h-14 bg-white justify-center relative shadow-sm">
          <View className="flex-row items-center justify-between px-5">
            <TouchableOpacity onPress={handler.handleGoBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="arrow-back" size={24} color="#609084" />
            </TouchableOpacity>
            <Text className="text-lg font-bold">{TITLE.FINANCIAL_GOAL}</Text>
            <View style={{ width: 24 }}></View>
          </View>
        </SectionComponent>

        <LoadingSectionWrapper isLoading={state.isLoading}>
          <ScrollViewCustom
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
            isBottomTab={false}
          >
            {renderGoalProgress()}
            {renderGoalDetails()}
            {renderEmptyState()}
          </ScrollViewCustom>
        </LoadingSectionWrapper>

        <ModalLizeComponent
          ref={state.modalizeRef}
          adjustToContentHeight
          onClose={handler.handleCloseDeleteModal}
        >
          <View className="p-6">
            <View className="items-center mb-4">
              <View className="bg-[#FFF2F2] rounded-full p-4 mb-3">
                <AntDesign name="exclamationcircleo" size={32} color="#dd6b55" />
              </View>
              <Text className="text-xl font-bold text-gray-900">{TITLE.DELETE_GOAL}</Text>
            </View>

            <Text className="text-center text-base text-gray-600 my-4">{TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.CONFIRM_DELETE}</Text>

            <View className="flex-row gap-4 mt-4">
              <TouchableOpacity
                onPress={handler.handleCloseDeleteModal}
                className="flex-1 rounded-lg border border-gray-200 py-3"
                activeOpacity={0.7}
              >
                <Text className="text-center font-medium text-gray-700">{BUTTON.CANCEL}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handler.handleDelete}
                disabled={state.isSubmitting}
                className={`flex-1 rounded-lg py-3 ${state.isSubmitting ? 'bg-red-400' : 'bg-[#dd6b55]'}`}
                activeOpacity={0.7}
              >
                {state.isSubmitting ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text className="text-center font-medium text-white">{BUTTON.DELETE}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ModalLizeComponent>
      </SafeAreaViewCustom>
    </GestureHandlerRootView>
  );
}
