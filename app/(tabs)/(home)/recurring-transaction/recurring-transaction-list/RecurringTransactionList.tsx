import { MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Pressable,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";

import {
  ModalLizeComponent,
  SafeAreaViewCustom,
  ScrollViewCustom,
  SectionComponent,
} from "@/components";
import { Colors } from "@/helpers/constants/color";
import { TRANSACTION_TYPE } from "@/helpers/enums/globals";
import { formatCurrencyInput, formatDate, formatTime } from "@/helpers/libs";
import { RecurringTransaction } from "@/helpers/types/recurringTransaction.types";
import { useLazyGetSubCateByIdQuery } from "@/services/subCategory";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import useRecurringTransactionList from "./hooks/useRecurringTransactionList";
import TEXT_TRANSLATE from "./RecurringTransactionList.translate";

const RecurringTransactionList = () => {
  const { state, handler } = useRecurringTransactionList();
  const [getSubCateById] = useLazyGetSubCateByIdQuery();
  const [subcategoryIcons, setSubcategoryIcons] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const fetchSubcategoryIcons = async () => {
      if (!Array.isArray(state.transactions)) return;

      for (const transaction of state.transactions) {
        if (
          transaction?.subcategoryId &&
          !subcategoryIcons[transaction.subcategoryId]
        ) {
          try {
            const response = await getSubCateById({
              subcateId: transaction.subcategoryId,
            }).unwrap();

            if (response?.data?.icon) {
              setSubcategoryIcons((prev) => ({
                ...prev,
                [transaction.subcategoryId]: response.data.icon,
              }));
            }
          } catch (error) {}
        }
      }
    };

    fetchSubcategoryIcons();
  }, [state.transactions, getSubCateById]);

  const groupedTransactions = useMemo(() => {
    const transactions = Array.isArray(state.transactions)
      ? state.transactions
      : [];

    const income = transactions.filter(
      (transaction) => transaction.type === TRANSACTION_TYPE.INCOME,
    );
    const expense = transactions.filter(
      (transaction) => transaction.type === TRANSACTION_TYPE.EXPENSE,
    );

    return { income, expense };
  }, [state.transactions]);

  const renderHeader = useCallback(
    () => (
      <SectionComponent rootClassName="bg-white justify-center items-center relative">
        <View className="relative h-14 flex-row items-center px-5">
          <TouchableOpacity
            onPress={handler.handleBack}
            className="absolute left-4 rounded-full bg-gray-50 p-2"
          >
            <MaterialIcons name="arrow-back" size={24} />
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Text className="text-lg font-bold">
              {TEXT_TRANSLATE.TITLE.RECURRING_TRANSACTION_LIST}
            </Text>
          </View>
        </View>

        {/* Tab Selector */}
        <View className="mx-4 my-2 w-full flex-row rounded-lg bg-gray-100 p-1">
          <Pressable
            onPress={() => handler.handleTabChange("active")}
            className={`flex-1 rounded-lg py-2 ${state.activeTab === "active" ? "bg-white shadow-sm" : ""}`}
          >
            <Text
              className={`text-center font-medium ${state.activeTab === "active" ? "text-primary" : "text-gray-500"}`}
            >
              Đang hoạt động
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handler.handleTabChange("archived")}
            className={`flex-1 rounded-lg py-2 ${state.activeTab === "archived" ? "bg-white shadow-sm" : ""}`}
          >
            <Text
              className={`text-center font-medium ${state.activeTab === "archived" ? "text-primary" : "text-gray-500"}`}
            >
              Đã lưu trữ
            </Text>
          </Pressable>
        </View>
      </SectionComponent>
    ),
    [state.activeTab, handler.handleTabChange, handler.handleBack],
  );

  const renderSectionHeader = useCallback(
    (title: string, isIncome: boolean) => (
      <View className="mx-4 mb-2 flex-row items-center rounded-xl bg-white/90 px-5 py-3 shadow-sm">
        <View
          className={`h-9 w-9 items-center justify-center rounded-full ${
            isIncome ? "bg-green/20" : "bg-red/20"
          }`}
        >
          <MaterialIcons
            name={isIncome ? "trending-up" : "trending-down"}
            size={20}
            color={isIncome ? Colors.colors.green : Colors.colors.red}
          />
        </View>
        <Text
          className={`ml-3 text-[17px] font-semibold ${
            isIncome ? "text-green" : "text-red"
          }`}
        >
          {title}
        </Text>
      </View>
    ),
    [],
  );

  const renderItem = useCallback(
    ({ item }: { item: RecurringTransaction }) => {
      const isIncome = item.type === TRANSACTION_TYPE.INCOME;

      return (
        <Pressable
          onPress={() => handler.handleOpenDetail(item)}
          className="mx-4 mb-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm active:bg-gray-50"
        >
          <View className="flex-row items-center justify-between">
            <View className="mr-3 flex-1 flex-row items-center">
              <View
                className={`h-12 w-12 items-center justify-center rounded-full bg-gray-100`}
              >
                <MaterialIcons
                  name={
                    (subcategoryIcons[
                      item?.subcategoryId
                    ] as keyof typeof MaterialIcons.glyphMap) || "category"
                  }
                  size={24}
                  color={isIncome ? Colors.colors.green : Colors.colors.red}
                />
              </View>
              <View className="ml-3 flex-1">
                <Text className="flex-wrap text-base font-semibold text-gray-800">
                  {item?.description}
                </Text>
                <Text className="mt-1 text-xs text-gray-500">
                  {handler.getFrequencyText(
                    item?.frequencyType,
                    item?.interval,
                  )}
                </Text>
                <View className="mt-1 flex-row items-center">
                  <MaterialIcons name="folder" size={12} color="#666" />
                  <Text className="ml-1 text-xs text-gray-500">
                    {item?.subcategoryName}
                  </Text>
                </View>
              </View>
            </View>
            <View className="items-end">
              <Text
                className={`text-base font-bold ${
                  isIncome ? "text-green" : "text-red"
                }`}
              >
                {isIncome ? "+ " : "- "}
                {formatCurrencyInput(item?.amount.toString())}
              </Text>
              <View className="mt-2 flex-row items-center">
                <MaterialIcons name="date-range" size={12} color="#666" />
                <Text className="ml-1 text-xs text-gray-500">
                  {formatDate(item?.startDate)}
                </Text>
              </View>
            </View>
          </View>
          {item?.tags && (
            <View className="mt-3 flex-row flex-wrap">
              {item.tags.split(",").map((tag, index) => (
                <View
                  key={index}
                  className="mr-2 mt-1 rounded-full bg-gray-100 px-2.5 py-1"
                >
                  <Text className="text-xs text-gray-600">{tag.trim()}</Text>
                </View>
              ))}
            </View>
          )}
        </Pressable>
      );
    },
    [handler, subcategoryIcons],
  );

  const renderDetailModal = useCallback(() => {
    if (!state.selectedTransaction) return null;
    const isIncome = state.selectedTransaction.type === TRANSACTION_TYPE.INCOME;

    return (
      <View className="p-5">
        <View className="mb-5 items-center">
          <Text className="text-xl font-bold text-gray-800">
            {TEXT_TRANSLATE.TITLE.TRANSACTION_DETAIL}
          </Text>
        </View>

        <View className="mb-5 rounded-xl border border-gray-100 bg-gray-50 p-5">
          <View className="mb-4 items-center">
            <View
              className={`h-16 w-16 items-center justify-center rounded-full bg-gray-100`}
            >
              <MaterialIcons
                name={
                  (subcategoryIcons[
                    state.selectedTransaction?.subcategoryId
                  ] as keyof typeof MaterialIcons.glyphMap) || "category"
                }
                size={28}
                color={isIncome ? Colors.colors.green : Colors.colors.red}
              />
            </View>
            <Text className="text-lg font-bold text-gray-800">
              {state.selectedTransaction?.description || "Transaction"}
            </Text>
            <Text
              className={`mt-2 text-lg font-bold ${
                isIncome ? "text-green" : "text-red"
              }`}
            >
              {isIncome ? "+" : "-"}
              {formatCurrencyInput(
                state.selectedTransaction?.amount?.toString(),
              )}
            </Text>
          </View>

          <View className="mt-2 border-t border-gray-200 pt-4">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-gray-600">
                {TEXT_TRANSLATE.LABEL.CATEGORY}
              </Text>
              <Text className="font-semibold text-gray-800">
                {state.selectedTransaction?.subcategoryName}
              </Text>
            </View>

            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-gray-600">
                {TEXT_TRANSLATE.LABEL.FREQUENCY}
              </Text>
              <Text className="font-semibold text-gray-800">
                {handler.getFrequencyText(
                  state.selectedTransaction?.frequencyType,
                  state.selectedTransaction?.interval,
                )}
              </Text>
            </View>

            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-gray-600">
                {TEXT_TRANSLATE.LABEL.START_DATE}
              </Text>
              <Text className="font-semibold text-gray-800">
                {formatDate(state.selectedTransaction?.startDate)}
              </Text>
            </View>
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-gray-600">
                {TEXT_TRANSLATE.LABEL.RECURRING_DATE}
              </Text>
              <Text className="font-semibold text-gray-800">
                {formatDate(state.selectedTransaction?.nextOccurrence)} •{" "}
                {formatTime(state.selectedTransaction?.nextOccurrence)}
              </Text>
            </View>

            {state.selectedTransaction.tags && (
              <View className="mb-3">
                <Text className="mb-2 text-gray-600">
                  {TEXT_TRANSLATE.LABEL.TAGS}
                </Text>
                <View className="flex-row flex-wrap">
                  {state.selectedTransaction?.tags
                    .split(",")
                    .map((tag, index) => (
                      <View
                        key={index}
                        className="mr-2 mt-1 rounded-full bg-gray-200 px-3 py-1"
                      >
                        <Text className="text-xs text-gray-700">
                          {tag.trim()}
                        </Text>
                      </View>
                    ))}
                </View>
              </View>
            )}
          </View>
        </View>

        <View className="flex-row">
          <Pressable
            onPress={handler.handleEditTransaction}
            className="mr-2 h-12 flex-1 items-center justify-center rounded-lg bg-primary active:opacity-90"
          >
            <Text className="text-base font-semibold text-white">
              {TEXT_TRANSLATE.BUTTON.EDIT}
            </Text>
          </Pressable>
          <Pressable
            onPress={handler.handleDeleteTransaction}
            className="ml-2 h-12 flex-1 items-center justify-center rounded-lg bg-red active:opacity-90"
          >
            <Text className="text-base font-semibold text-white">
              {TEXT_TRANSLATE.BUTTON.DELETE}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }, [state.selectedTransaction, handler, subcategoryIcons]);

  const renderEmptyList = useCallback(
    () => (
      <View className="flex-1 items-center justify-center py-10">
        <MaterialIcons
          name="event-busy"
          size={80}
          color="#CCCCCC"
          className="mb-4"
        />
        <Text className="text-center text-gray-500">
          {state.activeTab === "active"
            ? TEXT_TRANSLATE.MESSAGE.NO_TRANSACTIONS
            : "Không có giao dịch định kỳ đã lưu trữ"}
        </Text>
      </View>
    ),
    [state.activeTab],
  );

  const renderContent = () => {
    if (state.isLoading && state.pageIndex === 1) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.colors.primary} />
        </View>
      );
    }

    return (
      <View className="flex-1">
        {groupedTransactions.income?.length > 0 && (
          <View className="mb-5">
            {renderSectionHeader(TEXT_TRANSLATE.TITLE.INCOME, true)}
            {groupedTransactions.income.map((item) => (
              <View key={item.id}>{renderItem({ item })}</View>
            ))}
          </View>
        )}

        {groupedTransactions.expense?.length > 0 && (
          <View>
            {renderSectionHeader(TEXT_TRANSLATE.TITLE.EXPENSE, false)}
            {groupedTransactions.expense.map((item) => (
              <View key={item.id}>{renderItem({ item })}</View>
            ))}
          </View>
        )}

        {state.transactions?.length === 0 && renderEmptyList()}

        {state.isFetching && state.pageIndex > 1 && (
          <View className="items-center py-4">
            <ActivityIndicator color={Colors.colors.primary} />
          </View>
        )}
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaViewCustom rootClassName="bg-gray-100 flex-1">
        {renderHeader()}

        <ScrollViewCustom
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 16, paddingBottom: 30 }}
          isBottomTab={false}
          refreshControl={
            <RefreshControl
              refreshing={state.refreshing}
              onRefresh={handler.handleRefresh}
              colors={[Colors.colors.primary]}
            />
          }
          onScrollEndDrag={() => {
            if (state.hasMore && !state.isFetching) {
              handler.handleLoadMore();
            }
          }}
        >
          {renderContent()}
        </ScrollViewCustom>

        {state.activeTab === "active" && (
          <Pressable
            onPress={handler.handleNavigateToForm}
            className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg"
          >
            <MaterialIcons name="add" size={24} color="#FFF" />
          </Pressable>
        )}

        <ModalLizeComponent ref={state.modalizeRef}>
          {renderDetailModal()}
        </ModalLizeComponent>
      </SafeAreaViewCustom>
    </GestureHandlerRootView>
  );
};

export default RecurringTransactionList;
