import {
  LoadingSectionWrapper,
  ProgressCircleComponent,
  SafeAreaViewCustom,
  SectionComponent
} from "@/components";
import { ScrollViewCustom } from "@/components/ScrollViewCustom";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, Dimensions, Pressable, Text, View } from "react-native";
import TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL from "./GroupFinancialGoal.translate";
import useGroupFinancialGoal from "./hooks/useGroupFinancialGoal";

export default function GroupFinancialGoal() {
  const { state, refState, handler } = useGroupFinancialGoal();
  const { LABELS, BUTTON, TITLE } = TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL;

  // Animation values for modal
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (state.isDeleteModalVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    }
  }, [state.isDeleteModalVisible]);

  const renderGoalProgress = () => {
    if (!state.hasExistingGoal) return null;

    return (
      <SectionComponent rootClassName="rounded-[10px] bg-white p-4 shadow-sm">
        <Text className="text-lg font-semibold mb-3">{LABELS.PROGRESS}</Text>
        <View className="items-center">
          <ProgressCircleComponent
            value={state.financialGoal.currentAmount / state.financialGoal.targetAmount}
            size={80}
            thickness={4}
            showPercentage={true}
          />
        </View>

        <View className="flex-row justify-between mt-4">
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

        <View className="bg-gray-100 rounded-md p-3 mt-4">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center space-x-2">
              <MaterialIcons name="calendar-today" size={20} color="#609084" />
              <Text className="text-[#000]">
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

  // Render goal details
  const renderGoalDetails = () => {
    if (!state.hasExistingGoal) return null;

    return (
      <SectionComponent rootClassName="mt-4 rounded-[10px] bg-white p-4 shadow-sm">
        <Text className="text-lg font-semibold mb-3">{state.financialGoal?.name}</Text>

        <View className="space-y-2">
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

        <View className="flex-row space-x-3 mt-4">
          <Pressable
            onPress={handler.handleNavigateToUpdate}
            className="flex-1 bg-[#609084] h-12 rounded-lg items-center justify-center flex-row"
          >
            <AntDesign name="edit" size={18} color="white" />
            <Text className="ml-2 text-white font-semibold">{BUTTON.UPDATE}</Text>
          </Pressable>
          <Pressable
            onPress={handler.handleOpenDeleteModal}
            className="flex-1 bg-[#dd6b55] h-12 rounded-lg items-center justify-center flex-row"
          >
            <AntDesign name="delete" size={18} color="white" />
            <Text className="ml-2 text-white font-semibold">{BUTTON.DELETE}</Text>
          </Pressable>
        </View>
      </SectionComponent>
    );
  };

  const renderEmptyState = () => {
    if (state.hasExistingGoal) return null;

    return (
      <SectionComponent rootClassName="mt-4 rounded-[10px] bg-white p-5 shadow-sm items-center">
        <AntDesign name="flag" size={64} color="#609084" />

        <View className="items-center mt-4">
          <Text className="text-lg font-semibold">{LABELS.NO_GOAL}</Text>
          <Text className="text-center text-[#848484] mt-2">
            {LABELS.CREATE_GOAL_DESCRIPTION}
          </Text>
        </View>

        <Pressable
          onPress={handler.handleNavigateToCreate}
          className="bg-[#609084] h-12 rounded-lg items-center justify-center flex-row mt-6 w-full"
        >
          <AntDesign name="plus" size={18} color="white" />
          <Text className="ml-2 text-white font-semibold">{BUTTON.CREATE}</Text>
        </Pressable>
      </SectionComponent>
    );
  };

  const renderDeleteModal = () => {
    if (!state.isDeleteModalVisible) return null;

    return (
      <Animated.View 
        className="absolute inset-0 z-10 justify-center items-center"
        style={{
          height: Dimensions.get('window').height,
          width: Dimensions.get('window').width,
          backgroundColor: 'rgba(0,0,0,0.3)', 
        }}
      >
        <Animated.View 
          className="bg-white rounded-2xl w-10/12 overflow-hidden shadow-xl"
          style={{
            transform: [{ scale: scaleAnim }],
            opacity: fadeAnim,
            marginTop: -Dimensions.get('window').height * 0.2, 
            elevation: 5,
          }}
        >
          <View className="bg-[#dd6b55] p-4 items-center">
            <View className="bg-white rounded-full p-2 mb-2">
              <AntDesign name="exclamationcircleo" size={30} color="#dd6b55" />
            </View>
            <Text className="text-xl font-bold text-white">{TITLE.DELETE_GOAL}</Text>
          </View>

          <View className="p-5">
            <Text className="text-center text-base mb-5">{TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.CONFIRM_DELETE}</Text>

            <View className="flex-row space-x-4 mt-2">
              <Pressable
                onPress={handler.handleCloseDeleteModal}
                ref={refState.cancelRef}
                className="flex-1 h-12 rounded-lg border border-gray-300 items-center justify-center"
                android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
              >
                <Text className="font-semibold text-gray-700">{BUTTON.CANCEL}</Text>
              </Pressable>

              <Pressable
                onPress={handler.handleDelete}
                disabled={state.isSubmitting}
                className={`flex-1 h-12 rounded-lg items-center justify-center ${state.isSubmitting ? 'bg-red-400' : 'bg-[#dd6b55]'}`}
                android_ripple={{ color: 'rgba(255,255,255,0.2)' }}
              >
                {state.isSubmitting ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator color="white" size="small" />
                    <Text className="text-white font-semibold ml-2">Loading...</Text>
                  </View>
                ) : (
                  <View className="flex-row items-center">
                    <AntDesign name="delete" size={16} color="white" />
                    <Text className="text-white font-semibold ml-2">{BUTTON.DELETE}</Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaViewCustom rootClassName="bg-[#f9f9f9] flex-1">
      <StatusBar style="auto" />

      <SectionComponent rootClassName="h-14 bg-white justify-center relative">
        <View className="flex-row items-center justify-between px-5">
          <Pressable onPress={handler.handleGoBack}>
            <MaterialIcons name="arrow-back" size={24} color="#609084" />
          </Pressable>
          <Text className="text-lg font-bold">{TITLE.FINANCIAL_GOAL}</Text>
          <Text></Text>
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

        {renderDeleteModal()}
      </LoadingSectionWrapper>
    </SafeAreaViewCustom>
  );
}
