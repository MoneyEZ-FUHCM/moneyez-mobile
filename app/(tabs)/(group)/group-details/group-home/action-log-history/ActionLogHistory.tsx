import ArrowDown from "@/assets/icons/arrow-down-short-wide.png";
import ArrowUp from "@/assets/icons/arrow-up-wide-short.png";
import {
  FlatListCustom,
  LoadingSectionWrapper,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import { TRANSACTION_STATUS, TRANSACTION_TYPE_TEXT } from "@/enums/globals";
import {
  formatCurrency,
  formatDateMonthYear,
  formatTime,
} from "@/helpers/libs";
import { GroupTransaction } from "@/types/transaction.types";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import TEXT_TRANSLATE_EDIT_LOG_HISTORY from "../edit-log-history/EditLogHistory.translate";
import TEXT_TRANSLATE_ACTION_LOG_HISTORY from "./ActionLogHistory.translate";
import useActionLogHistory from "./hooks/useActionLogHistory";

const ActionLogHistory = () => {
  const { state, handler } = useActionLogHistory();

  const renderRecentActivities = ({
    item: activity,
    index,
  }: {
    item: GroupTransaction;
    index: number;
  }) => {
    return (
      <View
        key={activity?.id || index}
        className="relative mb-3 rounded-2xl bg-white p-4 shadow-sm shadow-gray-400"
      >
        <View className="flex-1">
          <View className="mb-2 flex-row items-center gap-x-2">
            <View
              className={`rounded-full p-1 ${activity?.type === TRANSACTION_TYPE_TEXT.INCOME ? "bg-green/10" : "bg-red/10"}`}
            >
              <Image
                source={
                  activity?.type === TRANSACTION_TYPE_TEXT.INCOME
                    ? ArrowDown
                    : ArrowUp
                }
                className="h-4 w-4"
                resizeMode="contain"
              />
            </View>
            <Text
              className={`${activity?.type === TRANSACTION_TYPE_TEXT.INCOME ? "text-green" : "text-red"} text-xs font-bold`}
            >
              {activity?.type === TRANSACTION_TYPE_TEXT.INCOME
                ? "Góp quỹ"
                : "Rút quỹ"}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="mr-4 flex-1 flex-row items-center space-x-3">
              {activity?.avatarUrl ? (
                <Image
                  source={{ uri: activity.avatarUrl }}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <LinearGradient
                  colors={["#609084", "#4A7A70"]}
                  className="h-12 w-12 items-center justify-center rounded-full shadow-md"
                >
                  <Text className="text-2xl font-semibold uppercase text-white">
                    {activity?.createdBy?.charAt(0)}
                  </Text>
                </LinearGradient>
              )}
              <View className="flex-1">
                <Text className="text-base font-bold">
                  {activity?.createdBy}
                </Text>
                <Text className="text-gray-600" numberOfLines={2}>
                  "{activity?.description}"
                </Text>
              </View>
            </View>
            <Text
              className={`text-right text-base font-bold ${
                activity?.type === TRANSACTION_TYPE_TEXT.INCOME
                  ? "text-green"
                  : "text-red"
              }`}
            >
              {activity?.type === TRANSACTION_TYPE_TEXT.INCOME
                ? `+ ${formatCurrency(activity?.amount)}`
                : `- ${formatCurrency(activity?.amount)}`}
            </Text>
          </View>
        </View>
        <View className="mt-4 flex-row items-center justify-between border-t border-gray-100 pt-3">
          {state.activeTab === TRANSACTION_STATUS.PENDING ? (
            <View className="flex-row items-center space-x-2">
              <Pressable
                onPress={() => handler.handleAcceptTransaction(activity.id)}
                className="rounded-full bg-primary px-4 py-1.5"
              >
                <Text className="text-xs font-medium text-white">
                  {TEXT_TRANSLATE_ACTION_LOG_HISTORY.BUTTON.ACCEPT}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handler.handleRejectTransaction(activity.id)}
                className="rounded-full bg-gray-200 px-4 py-1.5"
              >
                <Text className="text-xs font-medium text-gray-700">
                  {TEXT_TRANSLATE_ACTION_LOG_HISTORY.BUTTON.REJECT}
                </Text>
              </Pressable>
            </View>
          ) : activity.status === TRANSACTION_STATUS.APPROVED ? (
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={14} color="#609084" />
              <Text className="ml-1 text-xs text-gray-500">
                {TEXT_TRANSLATE_EDIT_LOG_HISTORY.TITLE.CONFIRMED}
              </Text>
            </View>
          ) : activity.status === TRANSACTION_STATUS.REJECTED ? (
            <View className="flex-row items-center">
              <Ionicons name="close-circle" size={14} color="#F43F5E" />
              <Text className="ml-1 text-xs text-gray-500">
                {TEXT_TRANSLATE_EDIT_LOG_HISTORY.TITLE.REJECTED}
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={14} color="#609084" />
              <Text className="ml-1 text-xs text-gray-500">
                {TEXT_TRANSLATE_EDIT_LOG_HISTORY.TITLE.CONFIRMED}
              </Text>
            </View>
          )}
          <View className="flex-row items-center rounded-full bg-gray-50 px-3 py-1.5">
            <MaterialIcons name="access-time" size={12} color="#666" />
            <Text className="ml-1 text-xs font-medium text-gray-600">
              {formatTime(activity?.createdDate)} ·{" "}
              {formatDateMonthYear(activity?.createdDate)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaViewCustom rootClassName="bg-[#fafafa]">
      <SectionComponent rootClassName="h-14 bg-white items-center justify-center relative">
        <Pressable
          onPress={() => router.back()}
          className="absolute left-3 rounded-full p-2"
        >
          <MaterialIcons name="arrow-back" size={24} />
        </Pressable>
        <Text className="text-lg font-semibold text-black">
          {TEXT_TRANSLATE_ACTION_LOG_HISTORY.TITLE.RECENT_ACTIVITIES}
        </Text>
      </SectionComponent>
      <View className="flex-row bg-white">
        {state.TABS.map((tab) => (
          <Pressable
            key={tab.type}
            onPress={() => handler.setActiveTab(tab.type)}
            className={`flex-1 items-center border-b-2 py-3 ${state.activeTab === tab.type ? "border-primary" : "border-transparent"}`}
          >
            <Text
              className={`font-normal ${state.activeTab === tab.type ? "font-extrabold text-primary" : "text-[#757575]"}`}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <LoadingSectionWrapper
        isLoading={
          state.isLoading || state.isFetchingData || state.isRefetching
        }
      >
        {state?.transactionActivities &&
        state.transactionActivities?.length > 0 ? (
          <FlatListCustom
            isBottomTab={true}
            isLoading={state.isLoadingMore}
            className="mx-3 mt-5 rounded-2xl"
            data={state.transactionActivities ?? []}
            renderItem={renderRecentActivities}
            keyExtractor={(item) => item?.id.toString()}
            onLoadMore={handler.handleLoadMore}
            hasMore={state.groupTransaction?.items?.length === state.pageSize}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 110,
            }}
            refreshing={state.isFetchingData}
            onRefresh={handler.handleRefetchActivities}
          />
        ) : (
          <View className="mt-20 items-center justify-center p-6">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <Feather name="credit-card" size={32} color="#609084" />
            </View>
            <Text className="text-center text-lg text-gray-500">
              {TEXT_TRANSLATE_ACTION_LOG_HISTORY.TITLE.NO_DATA}
            </Text>
          </View>
        )}
      </LoadingSectionWrapper>
    </SafeAreaViewCustom>
  );
};

export default ActionLogHistory;
