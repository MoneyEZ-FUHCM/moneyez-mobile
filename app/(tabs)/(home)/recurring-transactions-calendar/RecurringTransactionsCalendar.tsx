import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { MaterialIcons, EvilIcons } from "@expo/vector-icons";
import { SafeAreaViewCustom, SectionComponent } from "@/components";
import useStatistical from "./hooks/useRecurringTransactionsCalendar";
import CalendarView from "./CalendarView";
import { formatCurrency } from "@/helpers/libs";
import { Transaction } from "@/types/transaction.types";
import TEXT_TRANSLATE_RECURRING_TRANSACTIONS from "./RecurringTransactionsCalendar.translate";

export default function RecurringTransactionsCalendar() {
    const { state, handler } = useStatistical();

    const renderTransactionList = () => (
        <View className="mt-4 px-4">
            <Text className="text-xl font-bold text-gray-800 mb-3">{TEXT_TRANSLATE_RECURRING_TRANSACTIONS.LABELS.RECENT_TRANSACTIONS}</Text>
            {Object.entries(state.transactionsByDate).map(([date, transactions]) => {
                const transactionData = handler.getTransaction(transactions);
                const netAmount = transactionData.income - transactionData.expense;

                return (
                    <View key={date} className="mb-4">
                        <View className="flex-row items-center justify-between mb-2">
                            <Text className="text-base font-semibold text-gray-700">
                                {new Date(date).toLocaleDateString()}
                            </Text>
                            <Text className={`text-base font-bold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(netAmount)}
                            </Text>
                        </View>

                        {transactions.map((item: Transaction) => (
                            <View
                                key={item.id}
                                className="bg-white flex-row items-center justify-between p-3 pl-1 mb-2 rounded-lg shadow-sm"
                            >
                                <View className="flex-row items-center justify-between mb-2">
                                    <MaterialIcons name={item.subcategoryIcon ?? "attach-money"} size={36} color="#f6e5a0" />
                                    <View className="pr-4 ml-3">
                                        <Text className="w-60 text-base font-semibold text-gray-800" numberOfLines={1}>
                                            {item.subcategoryName || item.description}
                                        </Text>
                                        <Text className="text-gray-500 text-sm">
                                            {new Date(item.transactionDate).toLocaleTimeString()}
                                        </Text>
                                    </View>
                                </View>

                                <Text
                                    className={`text-base font-bold ${item.type === "EXPENSE" ? 'text-red-600' : 'text-green-600'}`}
                                >
                                    {item.type === "EXPENSE" ? '-' : ''}{formatCurrency(item.amount)}
                                </Text>
                            </View>
                        ))}
                    </View>
                );
            })}
        </View>
    );

    return (
        <SafeAreaViewCustom rootClassName="flex-1 bg-gray-50">
            <SectionComponent rootClassName="h-14 bg-white shadow-sm justify-center">
                <View className="flex-row items-center justify-between px-4">
                    <Pressable
                        onPress={handler.handleBack}
                        className="p-2"
                    >
                        <MaterialIcons name="arrow-back" size={24} color="black" />
                    </Pressable>
                    <Text className="text-lg font-bold text-gray-900">
                        {TEXT_TRANSLATE_RECURRING_TRANSACTIONS.TITLE.RECURRING_TRANSACTIONS}
                    </Text>
                    <Pressable className="p-2">
                        <EvilIcons name="search" size={24} color="black" />
                    </Pressable>
                </View>
            </SectionComponent>

            <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1"
            >
                <CalendarView />
                {renderTransactionList()}
            </ScrollView>
        </SafeAreaViewCustom>
    );
}