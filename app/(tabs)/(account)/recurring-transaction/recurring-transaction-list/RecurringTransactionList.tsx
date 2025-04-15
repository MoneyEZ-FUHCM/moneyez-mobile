import { MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Pressable,
  RefreshControl,
  Text,
  View
} from "react-native";
import { ActivityIndicator } from "react-native-paper";

import {
  ModalLizeComponent,
  SafeAreaViewCustom,
  ScrollViewCustom,
  SectionComponent
} from "@/components";
import { TRANSACTION_TYPE } from "@/enums/globals";
import { formatCurrencyInput, formatDate } from "@/helpers/libs";
import { useLazyGetSubCateByIdQuery } from "@/services/subCategory";
import { RecurringTransaction } from "@/types/recurringTransaction.types";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import useRecurringTransactionList from "./hooks/useRecurringTransactionList";
import TEXT_TRANSLATE from "./RecurringTransactionList.translate";

const PRIMARY_COLOR = "#609084";

const RecurringTransactionList = () => {
  const { state, handler } = useRecurringTransactionList();
  const [getSubCateById] = useLazyGetSubCateByIdQuery();
  const [subcategoryIcons, setSubcategoryIcons] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSubcategoryIcons = async () => {
      for (const transaction of state.transactions) {
        if (transaction.subcategoryId && !subcategoryIcons[transaction.subcategoryId]) {
          try {
            const response = await getSubCateById({ subcateId: transaction.subcategoryId }).unwrap();
            if (response?.data?.icon) {
              setSubcategoryIcons(prev => ({
                ...prev,
                [transaction.subcategoryId]: response.data.icon
              }));
            }
          } catch (error) {
            console.error('Error fetching subcategory icon:', error);
          }
        }
      }
    };

    fetchSubcategoryIcons();
  }, [state.transactions, getSubCateById]);

  const groupedTransactions = useMemo(() => {
    const income = state.transactions.filter(
      (transaction) => transaction.type === TRANSACTION_TYPE.INCOME
    );
    const expense = state.transactions.filter(
      (transaction) => transaction.type === TRANSACTION_TYPE.EXPENSE
    );
    return { income, expense };
  }, [state.transactions]);

  const renderHeader = useCallback(() => (
    <SectionComponent rootClassName="h-14 bg-white justify-center items-center relative">
      <View className="relative h-full flex-row items-center px-5">
        <Pressable onPress={handler.handleBack} className="absolute left-4">
          <MaterialIcons name="arrow-back" size={24} />
        </Pressable>
        <View className="flex-1 items-center">
          <Text className="text-lg font-bold">
            {TEXT_TRANSLATE.TITLE.RECURRING_TRANSACTION_LIST}
          </Text>
        </View>
      </View>
    </SectionComponent>
  ), []);

  const renderSectionHeader = useCallback((title: string, isIncome: boolean) => (
    <View className={`flex-row items-center px-4 py-2 mb-2 ${isIncome ? "bg-green-50" : "bg-red-50"}`}>
      <View className={`w-6 h-6 rounded-full justify-center items-center ${isIncome ? "bg-green-100" : "bg-red-100"}`}>
        <MaterialIcons
          name={isIncome ? "trending-up" : "trending-down"}
          size={16}
          color={isIncome ? "green" : "red"}
        />
      </View>
      <Text className={`ml-2 font-bold ${isIncome ? "text-green-700" : "text-red-700"}`}>
        {title}
      </Text>
    </View>
  ), []);

  const renderItem = useCallback(({ item }: { item: RecurringTransaction }) => {
    const isIncome = item.type === TRANSACTION_TYPE.INCOME;

    return (
      <Pressable
        onPress={() => handler.handleOpenDetail(item)}
        className="bg-white rounded-lg mb-3 p-4 mx-4 shadow-sm"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View
              className={`w-10 h-10 rounded-full justify-center items-center ${isIncome ? "bg-green-100" : "bg-red-100"}`}
            >
              {/* Use subcategory icon if it exists */}
              <MaterialIcons
                name={subcategoryIcons[item.subcategoryId] as keyof typeof MaterialIcons.glyphMap || "category"}
                size={20}
                color={isIncome ? "green" : "red"}
              />
            </View>
            <View className="ml-3">
              <Text className="font-semibold text-base">{item.description}</Text>
              <Text className="text-gray-600 text-xs">
                {handler.getFrequencyText(item.frequencyType, item.interval)}
              </Text>
              <Text className="text-gray-600 text-xs">Danh mục <Text className="text-gray-600 text-xs font-semibold">{item.subcategoryName}</Text></Text>
            </View>
          </View>
          <View className="items-end">
            <Text
              className={`font-bold ${isIncome ? "text-green" : "text-red"}`}
            >
              {isIncome ? "+" : "-"}
              {formatCurrencyInput(item.amount.toString())}
            </Text>
            <View className="flex-row items-center mt-1">
              <MaterialIcons name="date-range" size={12} color="#666" />
              <Text className="text-xs text-gray-600 ml-1">
                {formatDate(item.startDate)}
              </Text>
            </View>
          </View>
        </View>
        {item.tags && (
          <View className="mt-2 flex-row flex-wrap">
            {item.tags.split(',').map((tag, index) => (
              <View key={index} className="bg-secondary rounded-full px-2 py-1 mr-2 mt-1">
                <Text className="text-xs text-gray-500">{tag.trim()}</Text>
              </View>
            ))}
          </View>
        )}
      </Pressable>
    );
  }, [handler, subcategoryIcons]);

  const renderDetailModal = useCallback(() => {
    if (!state.selectedTransaction) return null;

    return (
      <View className="p-5">
        <View className="items-center mb-4">
          <Text className="text-lg font-bold">
            {TEXT_TRANSLATE.TITLE.TRANSACTION_DETAIL}
          </Text>
        </View>

        <View className="bg-gray-50 p-4 rounded-lg mb-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-gray-600">{TEXT_TRANSLATE.LABEL.CATEGORY}</Text>
            <Text className="font-semibold">{state.selectedTransaction.subcategoryName}</Text>
          </View>

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-gray-600">{TEXT_TRANSLATE.LABEL.AMOUNT}</Text>
            <Text
              className={`font-bold ${state.selectedTransaction.type === TRANSACTION_TYPE.INCOME ? "text-green-600" : "text-red-600"
                }`}
            >
              {state.selectedTransaction.type === TRANSACTION_TYPE.INCOME ? "+" : "-"}
              {formatCurrencyInput(state.selectedTransaction.amount.toString())}
            </Text>
          </View>

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-gray-600">{TEXT_TRANSLATE.LABEL.FREQUENCY}</Text>
            <Text className="font-semibold">
              {handler.getFrequencyText(state.selectedTransaction.frequencyType, state.selectedTransaction.interval)}
            </Text>
          </View>

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-gray-600">{TEXT_TRANSLATE.LABEL.START_DATE}</Text>
            <Text className="font-semibold">
              {formatDate(state.selectedTransaction.startDate)}
            </Text>
          </View>

          {state.selectedTransaction.description && (
            <View className="mb-3">
              <Text className="text-gray-600 mb-1">{TEXT_TRANSLATE.LABEL.DESCRIPTION}</Text>
              <Text className="font-semibold">{state.selectedTransaction.description}</Text>
            </View>
          )}

          {state.selectedTransaction.tags && (
            <View className="mb-3">
              <Text className="text-gray-600 mb-1">{TEXT_TRANSLATE.LABEL.TAGS}</Text>
              <View className="flex-row flex-wrap">
                {state.selectedTransaction.tags.split(',').map((tag, index) => (
                  <View key={index} className="bg-gray-100 rounded-full px-2 py-1 mr-2 mt-1">
                    <Text className="text-xs">{tag.trim()}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <View className="flex-row">
          <Pressable
            onPress={handler.handleEditTransaction}
            className="flex-1 h-12 mr-2 items-center justify-center rounded-lg bg-primary"
          >
            <Text className="text-base font-semibold text-white">
              {TEXT_TRANSLATE.BUTTON.EDIT}
            </Text>
          </Pressable>
          <Pressable
            onPress={handler.handleDeleteTransaction}
            className="flex-1 h-12 ml-2 items-center justify-center rounded-lg bg-rose-500"
          >
            <Text className="text-base font-semibold text-white">
              {TEXT_TRANSLATE.BUTTON.DELETE}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }, [state.selectedTransaction, handler]);

  const renderEmptyList = useCallback(() => (
    <View className="flex-1 items-center justify-center py-10">
      <MaterialIcons
        name="event-busy"
        size={80}
        color="#CCCCCC"
        className="mb-4"
      />
      <Text className="text-gray-500 text-center">
        {TEXT_TRANSLATE.MESSAGE.NO_TRANSACTIONS}
      </Text>
    </View>
  ), []);

  const renderContent = () => {
    if (state.isLoading && state.pageIndex === 1) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        </View>
      );
    }

    return (
      <View className="flex-1">
        {groupedTransactions.income.length > 0 && (
          <View>
            {renderSectionHeader(TEXT_TRANSLATE.TITLE.INCOME, true)}
            {groupedTransactions.income.map(item => (
              <View key={item.id}>
                {renderItem({ item })}
              </View>
            ))}
          </View>
        )}

        {groupedTransactions.expense.length > 0 && (
          <View className="mt-4">
            {renderSectionHeader(TEXT_TRANSLATE.TITLE.EXPENSE, false)}
            {groupedTransactions.expense.map(item => (
              <View key={item.id}>
                {renderItem({ item })}
              </View>
            ))}
          </View>
        )}

        {state.transactions.length === 0 && renderEmptyList()}

        {state.isFetching && state.pageIndex > 1 && (
          <View className="py-4 items-center">
            <ActivityIndicator color={PRIMARY_COLOR} />
          </View>
        )}
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaViewCustom rootClassName="bg-[#f5f5f5] flex-1">
        {renderHeader()}

        <ScrollViewCustom
          contentContainerStyle={{ paddingVertical: 16 }}
          isBottomTab={false}
          refreshControl={
            <RefreshControl
              refreshing={state.refreshing}
              onRefresh={handler.handleRefresh}
              colors={[PRIMARY_COLOR]}
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

        <Pressable
          onPress={handler.handleNavigateToForm}
          className="absolute bottom-6 right-6 h-14 w-14 rounded-full bg-primary items-center justify-center shadow-lg"
        >
          <MaterialIcons name="add" size={24} color="#FFF" />
        </Pressable>

        <ModalLizeComponent
          ref={state.modalizeRef}
          adjustToContentHeight
        >
          {renderDetailModal()}
        </ModalLizeComponent>
      </SafeAreaViewCustom>
    </GestureHandlerRootView>
  );
};

export default RecurringTransactionList;