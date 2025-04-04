import ArrowDown from "@/assets/icons/arrow-down-short-wide.png";
import ArrowUp from "@/assets/icons/arrow-up-wide-short.png";
import {
  FlatListCustom,
  LoadingSectionWrapper,
  ModalLizeComponent,
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
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
      <Pressable
        key={activity?.id || index}
        onPress={() => handler.handleOpenDetailModal(activity)}
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
            state.isLeader ? (
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
                  onPress={() => handler.handleOpenRejectModal(activity)}
                  className="rounded-full bg-gray-200 px-4 py-1.5"
                >
                  <Text className="text-xs font-medium text-gray-700">
                    {TEXT_TRANSLATE_ACTION_LOG_HISTORY.BUTTON.REJECT}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View className="flex-row items-center">
                <MaterialIcons name="pending" size={14} color="#666" />
                <Text className="ml-1 text-xs text-gray-500">Đang chờ</Text>
              </View>
            )
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
              {formatTime(activity?.transactionDate)} ·{" "}
              {formatDateMonthYear(activity?.transactionDate)}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <GestureHandlerRootView>
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
              onPress={() => handler.setActiveTab(tab.type as any)}
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
        <ModalLizeComponent
          ref={state.detailModalizeRef}
          adjustToContentHeight
          modalStyle={{
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <View className="pb-6">
            <Text className="mb-4 text-lg font-bold">Chi tiết giao dịch</Text>

            {state.selectedLog && (
              <View className="space-y-4">
                <View className="flex-row items-center">
                  {state.selectedLog?.avatarUrl ? (
                    <Image
                      source={{ uri: state.selectedLog.avatarUrl }}
                      className="h-16 w-16 rounded-full"
                    />
                  ) : (
                    <LinearGradient
                      colors={["#609084", "#4A7A70"]}
                      className="h-16 w-16 items-center justify-center rounded-full"
                    >
                      <Text className="text-3xl font-semibold uppercase text-white">
                        {state.selectedLog?.createdBy?.charAt(0)}
                      </Text>
                    </LinearGradient>
                  )}
                  <View className="ml-4">
                    <Text className="text-lg font-bold">
                      {state.selectedLog.createdBy}
                    </Text>
                    <View className="flex-row items-center">
                      <MaterialIcons
                        name="access-time"
                        size={14}
                        color="#666"
                      />
                      <Text className="ml-1 text-sm text-gray-600">
                        {formatTime(state.selectedLog?.createdDate)} ·{" "}
                        {formatDateMonthYear(state.selectedLog?.createdDate)}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <MaterialIcons name="update" size={14} color="#666" />
                      <Text className="ml-1 text-sm text-gray-600">
                        {formatTime(state.selectedLog?.updatedDate)} ·{" "}
                        {formatDateMonthYear(state.selectedLog?.updatedDate)}
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="space-y-2 rounded-lg bg-gray-50 p-4">
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Loại giao dịch:</Text>
                    <Text
                      className={`font-medium ${
                        state.selectedLog?.type === TRANSACTION_TYPE_TEXT.INCOME
                          ? "text-green"
                          : "text-red"
                      }`}
                    >
                      {state.selectedLog?.type === TRANSACTION_TYPE_TEXT.INCOME
                        ? "Góp quỹ"
                        : "Rút quỹ"}
                    </Text>
                  </View>

                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Số tiền:</Text>
                    <Text
                      className={`font-medium ${
                        state.selectedLog?.type === TRANSACTION_TYPE_TEXT.INCOME
                          ? "text-green"
                          : "text-red"
                      }`}
                    >
                      {state.selectedLog?.type === TRANSACTION_TYPE_TEXT.INCOME
                        ? `+ ${formatCurrency(state.selectedLog?.amount)}`
                        : `- ${formatCurrency(state.selectedLog?.amount)}`}
                    </Text>
                  </View>

                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Trạng thái:</Text>
                    <View className="flex-row items-center">
                      {state.selectedLog?.status ===
                      TRANSACTION_STATUS.APPROVED ? (
                        <>
                          <Ionicons
                            name="checkmark-circle"
                            size={14}
                            color="#609084"
                          />
                          <Text className="ml-1 text-primary">
                            {TEXT_TRANSLATE_EDIT_LOG_HISTORY.TITLE.CONFIRMED}
                          </Text>
                        </>
                      ) : state.selectedLog?.status ===
                        TRANSACTION_STATUS.REJECTED ? (
                        <>
                          <Ionicons
                            name="close-circle"
                            size={14}
                            color="#F43F5E"
                          />
                          <Text className="ml-1 text-red">
                            {TEXT_TRANSLATE_EDIT_LOG_HISTORY.TITLE.REJECTED}
                          </Text>
                        </>
                      ) : (
                        <>
                          <MaterialIcons
                            name="pending"
                            size={14}
                            color="#666"
                          />
                          <Text className="ml-1 text-gray-500">Đang chờ</Text>
                        </>
                      )}
                    </View>
                  </View>
                </View>

                <View>
                  <Text className="mb-2 font-medium">Mô tả:</Text>
                  <Text className="text-gray-600">
                    {state.selectedLog?.description}
                  </Text>
                </View>

                {state.selectedLog?.note && (
                  <View>
                    <Text className="mb-2 font-medium text-red">
                      Lý do từ chối:
                    </Text>
                    <Text className="text-gray-600">
                      {state.selectedLog?.note}
                    </Text>
                  </View>
                )}
              </View>
            )}

            <Pressable
              onPress={() => state.detailModalizeRef.current?.close()}
              className="mt-8 rounded-lg bg-primary px-4 py-3"
            >
              <Text className="text-center text-white">Đóng</Text>
            </Pressable>
          </View>
        </ModalLizeComponent>
        <ModalLizeComponent
          ref={state.modalizeRef}
          adjustToContentHeight
          modalStyle={{
            padding: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <View className="pb-6">
            <Text className="mb-4 text-lg font-bold">Xác nhận từ chối</Text>

            {state.selectedTransaction && (
              <View className="mb-4 rounded-lg bg-gray-50 p-4">
                <Text className="text-sm text-gray-600">
                  Người tạo: {state.selectedTransaction.createdBy}
                </Text>
                <Text className="mt-1 text-sm text-gray-600">
                  Số tiền: {formatCurrency(state.selectedTransaction.amount)}
                </Text>
                <Text className="mt-1 text-sm text-gray-600">
                  Mô tả: {state.selectedTransaction.description}
                </Text>
              </View>
            )}

            <Text className="mb-2 text-sm font-medium">Lý do từ chối:</Text>
            <TextInput
              className="mb-4 rounded-lg border border-gray-200 p-3 text-sm"
              multiline
              numberOfLines={3}
              value={state.rejectReason}
              onChangeText={handler.setRejectReason}
              placeholder="Nhập lý do từ chối..."
            />

            <View className="flex-row justify-end space-x-3">
              <Pressable
                onPress={() => state.modalizeRef.current?.close()}
                className="rounded-lg border border-gray-200 px-4 py-2"
              >
                <Text className="text-sm">Hủy</Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  handler.handleRejectTransaction(
                    state.selectedTransaction?.id || "",
                  )
                }
                className="rounded-lg bg-red px-4 py-2"
              >
                <Text className="text-sm text-white">Xác nhận từ chối</Text>
              </Pressable>
            </View>
          </View>
        </ModalLizeComponent>
      </SafeAreaViewCustom>
    </GestureHandlerRootView>
  );
};

export default ActionLogHistory;
