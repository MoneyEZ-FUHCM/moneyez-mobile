import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  FlatListCustom,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import { router } from "expo-router";
import TRANSACTION_HISTORY_CONSTANTS, {
  Transaction,
  TransactionGroup,
} from "./TransactionHistory.const";
import { ScrollViewCustom } from "@/components/ScrollViewCustom";
import { PATH_NAME } from "@/helpers/constants/pathname";

export default function TransactionHistory() {
  const [activeFilter, setActiveFilter] = useState("all");
  const { HOME } = PATH_NAME;

  const handleBack = () => {
    router.back();
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(parseInt(amount));
  };

  const transactionsByYear = Object.entries(
    TRANSACTION_HISTORY_CONSTANTS.SAMPLE_TRANSACTIONS,
  ).map(([year, transactions]) => ({
    year,
    transactions,
  }));

  const renderTransactionItem = ({
    transaction,
  }: {
    transaction: Transaction;
  }) => (
    <View className="mb-3 rounded border border-[#dbdbdb] p-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-[#609084]">
          {transaction.modelName}
        </Text>
        <Text className="text-base font-medium text-[#00a010]">
          {formatCurrency(transaction.income)}
        </Text>
      </View>

      <View className="mt-2 flex-row items-center justify-between">
        <Text className="text-sm italic text-[#021433]">
          {transaction.period}
        </Text>
        <Text className="text-base font-medium text-[#cc0000]">
          {formatCurrency(transaction.expense)}
        </Text>
      </View>

      <Pressable
        className="mt-2 flex items-end"
        onPress={() => router.navigate(HOME.PERIOD_HISTORY as any)}
      >
        <Text className="text-sm italic text-[#609084] underline">
          <Text>Xem chi tiết</Text>
          <Text> &gt;</Text>
        </Text>
      </Pressable>
    </View>
  );

  const renderYearSection = ({ item }: { item: TransactionGroup }) => (
    <SectionComponent rootClassName="bg-white mx-4 mb-4 px-4 rounded-lg">
      <Text className="mb-4 text-xl font-semibold text-[#021433]">
        {item.year}
      </Text>
      {item.transactions.map((transaction, index) => (
        <React.Fragment key={index}>
          {renderTransactionItem({ transaction })}
        </React.Fragment>
      ))}
    </SectionComponent>
  );

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-[#fafafa]">
      {/* HEADER */}
      <SectionComponent rootClassName="h-24 bg-white justify-center">
        <View className="flex-row items-center justify-between px-4">
          <Pressable onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </Pressable>
          <Text className="text-xl font-semibold text-black">Lịch sử</Text>
          <View style={{ width: 24 }} />
        </View>
      </SectionComponent>

      {/* FILTER TABS */}
      <SectionComponent rootClassName="bg-white px-4 py-2">
        <ScrollViewCustom horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-3">
            {TRANSACTION_HISTORY_CONSTANTS.FILTER_TABS.map((tab) => (
              <Pressable
                key={tab.id}
                onPress={() => setActiveFilter(tab.id)}
                className={`rounded-2xl border px-4 py-2 ${
                  activeFilter === tab.id
                    ? "border-[#609084] bg-[#609084]"
                    : "border-[#609084] bg-white"
                }`}
              >
                <Text
                  className={`text-base ${
                    activeFilter === tab.id ? "text-white" : "text-[#609084]"
                  }`}
                >
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollViewCustom>
      </SectionComponent>

      {/* TRANSACTION LIST */}
      <SectionComponent rootClassName="flex-1 bg-white">
        <FlatListCustom<TransactionGroup>
          data={transactionsByYear}
          renderItem={renderYearSection}
          keyExtractor={(item) => item.year}
          contentContainerStyle={{
            paddingTop: 4,
            paddingBottom: 4,
          }}
          showsVerticalScrollIndicator={false}
        />
      </SectionComponent>
    </SafeAreaViewCustom>
  );
}
