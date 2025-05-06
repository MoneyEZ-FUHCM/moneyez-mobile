import {
  LoadingSectionWrapper,
  ModalLizeComponent,
  ProgressCircleComponent,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import { ScrollViewCustom } from "@/components/ScrollViewCustom";
import { Colors } from "@/helpers/constants/color";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL from "./GroupFinancialGoal.translate";
import useGroupFinancialGoal from "./hooks/useGroupFinancialGoal";

export default function GroupFinancialGoal() {
  const { state, handler } = useGroupFinancialGoal();
  const { LABELS, BUTTON, TITLE } = TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL;

  const renderTab = () => {
    return (
      <View className="mx-4 mt-4 flex-row rounded-xl bg-white">
        {state.TABS.map((tab) => (
          <Pressable
            key={tab.type}
            onPress={() => handler.setActiveTab(tab.type as any)}
            className={`flex-1 items-center rounded-xl border-b-2 py-3 ${state.activeTab === tab.type ? "border-primary" : "border-transparent"}`}
          >
            <Text
              className={`font-normal ${state.activeTab === tab.type ? "font-extrabold text-primary" : "text-[#757575]"}`}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  };

  const renderCompletedFilters = () => {
    if (state.activeTab !== "COMPLETED") return null;

    return (
      <View className="mx-4 mb-1 mt-3">
        <Text className="mb-2 text-sm font-medium text-gray-600">
          Lọc theo trạng thái:
        </Text>
        <View className="flex-row space-x-3">
          {state.COMPLETED_FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.type}
              onPress={() => handler.setCompletedFilter(filter.type as any)}
              className={`flex-row items-center rounded-lg px-4 py-2 ${
                state.completedFilter === filter.type
                  ? "bg-primary/90"
                  : "border border-gray-200 bg-white"
              }`}
              activeOpacity={0.7}
            >
              {filter.type === "ARCHIVED" ? (
                <MaterialIcons
                  name="archive"
                  size={16}
                  color={
                    state.completedFilter === filter.type
                      ? "#fff"
                      : Colors.colors.primary
                  }
                  style={{ marginRight: 6 }}
                />
              ) : (
                <AntDesign
                  name="checkcircle"
                  size={16}
                  color={
                    state.completedFilter === filter.type
                      ? "#fff"
                      : Colors.colors.primary
                  }
                  style={{ marginRight: 6 }}
                />
              )}
              <Text
                className={`text-sm font-medium ${
                  state.completedFilter === filter.type
                    ? "text-white"
                    : "text-gray-700"
                }`}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderCompletedGoalsList = () => {
    if (
      state.activeTab !== "COMPLETED" ||
      !state.financialGoals ||
      state.financialGoals.length === 0
    )
      return null;

    return (
      <View className="mt-4">
        {state.financialGoals.map((goal) => {
          const isGoalSuccessful = goal.currentAmount >= goal.targetAmount;
          const progressPercentage: any = Math.min(
            (goal.currentAmount / goal.targetAmount) * 100,
            100,
          ).toFixed(0);

          return (
            <TouchableOpacity
              key={goal.id}
              onPress={() => handler.handleViewCompletedGoalDetails(goal)}
              className="mb-4 overflow-hidden rounded-lg bg-white shadow-sm"
            >
              <View className="p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 pr-3">
                    <Text className="text-lg font-semibold" numberOfLines={1}>
                      {goal.name}
                    </Text>
                  </View>
                  <View
                    className={`rounded-full px-2.5 py-1 ${
                      isGoalSuccessful ? "bg-green/10" : "bg-red/10"
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        isGoalSuccessful ? "text-green" : "text-red"
                      }`}
                    >
                      {isGoalSuccessful ? "Hoàn thành" : "Chưa hoàn thành"}
                    </Text>
                  </View>
                </View>
                <View className="mt-3">
                  <View className="mb-1 flex-row justify-between">
                    <Text className="text-xs text-gray-500">Tiến độ</Text>
                    <Text className="text-xs font-medium">
                      {progressPercentage}%
                    </Text>
                  </View>
                  <View className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <View
                      className={`h-full ${isGoalSuccessful ? "bg-green" : "bg-red"}`}
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </View>
                </View>
                <View className="mt-3 flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <AntDesign
                      name="calendar"
                      size={16}
                      color={Colors.colors.primary}
                    />
                    <Text className="ml-2 text-sm text-[#848484]">
                      {handler.formatDate(goal.deadline, "DD.MM.YYYY")}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <MaterialIcons
                      name="attach-money"
                      size={16}
                      color={Colors.colors.primary}
                    />
                    <Text className="ml-1 font-medium text-primary">
                      {handler.formatCurrency(goal.currentAmount)} /{" "}
                      {handler.formatCurrency(goal.targetAmount)}
                    </Text>
                  </View>
                </View>
                <View className="mt-2 flex-row items-center justify-between border-t border-gray-100 pt-2">
                  <View className="flex-row items-center">
                    <AntDesign name="clockcircleo" size={14} color="#848484" />
                    <Text className="ml-1.5 text-xs text-[#848484]">
                      Tạo: {handler.formatDate(goal.createdDate, "DD.MM.YYYY")}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    <Text className="pr-1 text-xs text-[#848484]">
                      {handler.getStatusText(goal.status)}
                    </Text>
                    <MaterialIcons
                      name="chevron-right"
                      size={20}
                      color={Colors.colors.primary}
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderGoalProgress = () => {
    if (!state.hasExistingGoal || state.activeTab === "COMPLETED") return null;

    return (
      <SectionComponent rootClassName="rounded-[16px] bg-white p-5 shadow-sm">
        <Text className="mb-4 text-lg font-semibold">{LABELS.PROGRESS}</Text>
        <View className="items-center">
          <ProgressCircleComponent
            value={
              Math.floor(
                (state.financialGoal.currentAmount /
                  state.financialGoal.targetAmount >
                1
                  ? 1
                  : state.financialGoal.currentAmount /
                    state.financialGoal.targetAmount) * 100,
              ) / 100
            }
            size={100}
            thickness={5}
            showPercentage={true}
          />
        </View>

        <View className="mt-6 flex-row justify-between">
          <View>
            <Text className="text-sm text-[#848484]">
              {LABELS.CURRENT_AMOUNT}
            </Text>
            <Text className="text-base font-semibold text-primary">
              {handler.formatCurrency(state.financialGoal?.currentAmount || 0)}
            </Text>
          </View>

          <View className="items-end">
            <Text className="text-sm text-[#848484]">
              {LABELS.TARGET_AMOUNT}
            </Text>
            <Text className="text-base font-semibold">
              {handler.formatCurrency(state.financialGoal?.targetAmount || 0)}
            </Text>
          </View>
        </View>

        <View className="mt-5 rounded-md bg-gray-100 p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center space-x-2">
              <MaterialIcons
                name="calendar-today"
                size={20}
                color={Colors.colors.primary}
              />
              <Text
                className={`ml-2 ${
                  state.isGoalCompleted
                    ? "text-[#000]"
                    : state.daysLeft?.days === 0 &&
                        state.daysLeft?.hours === 0 &&
                        state.daysLeft?.minutes === 0
                      ? "text-red"
                      : "text-[#000]"
                }`}
              >
                {state.isGoalCompleted
                  ? LABELS.COMPLETED
                  : state.daysLeft?.days === 0 &&
                      state.daysLeft?.hours === 0 &&
                      state.daysLeft?.minutes === 0
                    ? LABELS.FAILED
                    : state.daysLeft?.days === 0
                      ? LABELS.TIMES_LEFT.replace(
                          "{{hours}}",
                          state.daysLeft?.hours.toString(),
                        ).replace(
                          "{{minutes}}",
                          state.daysLeft?.minutes.toString(),
                        )
                      : LABELS.DAYS_LEFT.replace(
                          "{{days}}",
                          state.daysLeft?.days.toString(),
                        )}
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
    if (!state.hasExistingGoal || state.activeTab === "COMPLETED") return null;

    return (
      <SectionComponent rootClassName="mt-5 rounded-[16px] bg-white p-5 shadow-sm">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="flex-1 text-lg font-semibold">
            {state.financialGoal?.name}
          </Text>

          <TouchableOpacity
            onPress={handler.handleOpenDeleteModal}
            className="p-3.5"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <AntDesign name="delete" size={20} color="#dd6b55" />
          </TouchableOpacity>

          {state.showOptions && (
            <>
              <TouchableOpacity
                activeOpacity={0}
                onPress={handler.handlePressOutside}
                className="absolute inset-0 z-10"
                style={{ top: -100, left: -100, right: -100, bottom: -500 }}
              />
            </>
          )}
        </View>

        <View className="space-y-3">
          <View className="flex-row justify-between">
            <Text className="text-[#848484]">{LABELS.GOAL_STATUS}</Text>
            <Text className="font-medium text-primary">
              {handler.getStatusText(state.financialGoal?.status || "ACTIVE")}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-[#848484]">{LABELS.APPROVAL_STATUS}</Text>
            <Text className="font-medium text-primary">
              {handler.getApprovalStatusText(
                state.financialGoal?.approvalStatus || 1,
              )}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-[#848484]">{LABELS.CREATED_DATE}</Text>
            <Text className="text-[#000]">
              {handler.formatDate(
                state.financialGoal?.createdDate,
                "DD.MM.YYYY",
              )}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handler.handleNavigateToUpdate}
          className="mt-5 h-12 overflow-hidden rounded-lg bg-primary"
          activeOpacity={0.85}
        >
          <View className="absolute bottom-0 left-0 right-0 top-0 bg-black opacity-5" />
          <View className="h-full flex-row items-center justify-center">
            <AntDesign name="edit" size={18} color="white" />
            <Text className="ml-2 font-semibold text-white">
              {BUTTON.UPDATE}
            </Text>
          </View>
        </TouchableOpacity>
      </SectionComponent>
    );
  };

  const renderEmptyState = () => {
    if (state.hasExistingGoal || state.activeTab === "COMPLETED") return null;

    return (
      <SectionComponent rootClassName="mt-5 rounded-[16px] bg-white p-6 shadow-sm items-center">
        <AntDesign name="flag" size={70} color={Colors.colors.primary} />

        <View className="mt-5 items-center">
          <Text className="text-xl font-semibold">{LABELS.NO_GOAL}</Text>
          <Text className="mt-3 text-center leading-5 text-[#848484]">
            {LABELS.CREATE_GOAL_DESCRIPTION}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handler.handleNavigateToCreate}
          className="bg-pritext-primary mt-6 h-12 w-full overflow-hidden rounded-lg"
          activeOpacity={0.85}
        >
          <View className="absolute bottom-0 left-0 right-0 top-0 bg-black opacity-5" />
          <View className="h-full flex-row items-center justify-center bg-primary">
            <AntDesign name="plus" size={18} color="white" />
            <Text className="ml-2 font-semibold text-white">
              {BUTTON.CREATE}
            </Text>
          </View>
        </TouchableOpacity>
      </SectionComponent>
    );
  };

  const renderEmptyCompletedGoals = () => {
    if (
      state.activeTab !== "COMPLETED" ||
      (state.financialGoals && state.financialGoals.length > 0)
    )
      return null;

    return (
      <View className="mt-5 items-center justify-center rounded-lg bg-white p-8 shadow-sm">
        <AntDesign name="inbox" size={60} color={Colors.colors.primary} />
        <Text className="mt-4 text-center text-lg font-medium">
          Chưa có dữ liệu
        </Text>
        <Text className="mt-2 text-center text-gray-500">
          Tạo mục tiêu nhóm để có dữ liệu
        </Text>
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaViewCustom rootClassName="bg-[#f9f9f9] flex-1">
        <SectionComponent rootClassName="h-14 bg-white justify-center relative shadow-sm">
          <View className="flex-row items-center justify-between px-5">
            <TouchableOpacity
              onPress={handler.handleGoBack}
              className="rounded-full bg-gray-50 p-2"
            >
              <MaterialIcons name="arrow-back" size={24} />
            </TouchableOpacity>
            <Text className="text-lg font-bold">{TITLE.FINANCIAL_GOAL}</Text>
            <View className="w-6" />
          </View>
        </SectionComponent>
        {renderTab()}
        {renderCompletedFilters()}
        <LoadingSectionWrapper isLoading={state.isLoading}>
          <ScrollViewCustom
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
            isBottomTab={false}
            refreshControl={
              <RefreshControl
                refreshing={state.refreshing}
                onRefresh={handler.handleRefresh}
                colors={[Colors.colors.primary]}
              />
            }
          >
            {renderGoalProgress()}
            {renderGoalDetails()}
            {renderEmptyState()}
            {renderCompletedGoalsList()}
            {renderEmptyCompletedGoals()}
          </ScrollViewCustom>
        </LoadingSectionWrapper>

        <ModalLizeComponent ref={state.modalizeRef}>
          <View className="p-6">
            <View className="mb-4 items-center">
              <View className="mb-3 rounded-full bg-[#FFF2F2] p-4">
                <AntDesign
                  name="exclamationcircleo"
                  size={32}
                  color="#dd6b55"
                />
              </View>
              <Text className="text-xl font-bold text-gray-900">
                {TITLE.DELETE_GOAL}
              </Text>
            </View>

            <Text className="my-4 text-center text-base text-gray-600">
              {TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL.CONFIRM_DELETE}
            </Text>

            <View className="mt-4 flex-row gap-4">
              <TouchableOpacity
                onPress={() => handler.handleCloseDeleteModal()}
                className="flex-1 rounded-lg border border-gray-200 py-3"
                activeOpacity={0.7}
              >
                <Text className="text-center font-medium text-gray-700">
                  {BUTTON.CANCEL}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handler.handleDelete}
                disabled={state.isSubmitting}
                className={`flex-1 rounded-lg py-3 ${state.isSubmitting ? "bg-red" : "bg-[#dd6b55]"}`}
                activeOpacity={0.7}
              >
                {state.isSubmitting ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text className="text-center font-medium text-white">
                    {BUTTON.DELETE}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ModalLizeComponent>
        <ModalLizeComponent ref={state.detailsModalizeRef}>
          {state.selectedCompletedGoal && (
            <View className="p-6">
              <View className="mb-6 items-center">
                <Text className="mb-2 text-xl font-bold text-gray-900">
                  {state.selectedCompletedGoal.name}
                </Text>

                <View
                  className={`flex-row items-center rounded-full px-3 py-1 ${
                    state.selectedCompletedGoal.currentAmount >=
                    state.selectedCompletedGoal.targetAmount
                      ? "bg-green/10"
                      : "bg-red/10"
                  }`}
                >
                  {state.selectedCompletedGoal.currentAmount >=
                  state.selectedCompletedGoal.targetAmount ? (
                    <>
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="#00a010"
                      />
                      <Text className="ml-1 font-medium text-green">
                        {LABELS.COMPLETED}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="alert-circle" size={18} color="red" />
                      <Text className="ml-1 font-medium text-red">
                        {LABELS.FAILED}
                      </Text>
                    </>
                  )}
                </View>
              </View>
              <View className="mb-5 rounded-xl bg-gray-50 p-5 shadow-sm">
                <View className="mb-5 items-center">
                  <ProgressCircleComponent
                    value={
                      Math.floor(
                        (state.selectedCompletedGoal.currentAmount /
                          state.selectedCompletedGoal.targetAmount >
                        1
                          ? 1
                          : state.selectedCompletedGoal.currentAmount /
                            state.selectedCompletedGoal.targetAmount) * 100,
                      ) / 100
                    }
                    size={120}
                    thickness={8}
                    showPercentage={true}
                  />
                </View>
                <View className="flex-row justify-between rounded-lg bg-white p-4 shadow-sm">
                  <View>
                    <Text className="text-sm text-[#848484]">
                      {LABELS.CURRENT_AMOUNT}
                    </Text>
                    <Text className="text-lg font-semibold text-primary">
                      {handler.formatCurrency(
                        state.selectedCompletedGoal.currentAmount,
                      )}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-sm text-[#848484]">
                      {LABELS.TARGET_AMOUNT}
                    </Text>
                    <Text className="text-lg font-semibold">
                      {handler.formatCurrency(
                        state.selectedCompletedGoal.targetAmount,
                      )}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="mb-5 overflow-hidden rounded-xl bg-white shadow-sm">
                <View className="border-b border-gray-200 bg-gray-50 px-4 py-2">
                  <Text className="font-semibold text-gray-700">Chi tiết</Text>
                </View>
                <View className="p-4">
                  <View className="space-y-3">
                    <View className="flex-row justify-between border-b border-gray-100 py-2">
                      <View className="flex-row items-center">
                        <AntDesign
                          name="tag"
                          size={16}
                          color={Colors.colors.primary}
                          style={{ marginRight: 8 }}
                        />
                        <Text className="text-[#848484]">
                          {LABELS.GOAL_STATUS}
                        </Text>
                      </View>
                      <Text className="font-medium text-primary">
                        {handler.getStatusText(
                          state.selectedCompletedGoal.status,
                        )}
                      </Text>
                    </View>
                    <View className="flex-row justify-between border-b border-gray-100 py-2">
                      <View className="flex-row items-center">
                        <AntDesign
                          name="checkcircle"
                          size={16}
                          color={Colors.colors.primary}
                          style={{ marginRight: 8 }}
                        />
                        <Text className="text-[#848484]">
                          {LABELS.APPROVAL_STATUS}
                        </Text>
                      </View>
                      <Text className="font-medium text-primary">
                        {handler.getApprovalStatusText(
                          state.selectedCompletedGoal.approvalStatus,
                        )}
                      </Text>
                    </View>
                    <View className="flex-row justify-between border-b border-gray-100 py-2">
                      <View className="flex-row items-center">
                        <AntDesign
                          name="calendar"
                          size={16}
                          color={Colors.colors.primary}
                          style={{ marginRight: 8 }}
                        />
                        <Text className="text-[#848484]">
                          {LABELS.CREATED_DATE}
                        </Text>
                      </View>
                      <Text className="text-[#000]">
                        {handler.formatDate(
                          state.selectedCompletedGoal.createdDate,
                          "DD.MM.YYYY",
                        )}
                      </Text>
                    </View>
                    <View className="flex-row justify-between py-2">
                      <View className="flex-row items-center">
                        <AntDesign
                          name="clockcircle"
                          size={16}
                          color={Colors.colors.primary}
                          style={{ marginRight: 8 }}
                        />
                        <Text className="text-[#848484]">
                          {LABELS.DEADLINE}
                        </Text>
                      </View>
                      <Text className="text-[#000]">
                        {handler.formatDate(
                          state.selectedCompletedGoal.deadline,
                          "DD.MM.YYYY",
                        )}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => state.detailsModalizeRef.current?.close()}
                className="h-12 overflow-hidden rounded-lg bg-primary"
                activeOpacity={0.85}
              >
                <View className="absolute bottom-0 left-0 right-0 top-0 bg-black opacity-5" />
                <View className="h-full flex-row items-center justify-center">
                  <Text className="text-base font-semibold text-white">
                    Đóng
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </ModalLizeComponent>
      </SafeAreaViewCustom>
    </GestureHandlerRootView>
  );
}
