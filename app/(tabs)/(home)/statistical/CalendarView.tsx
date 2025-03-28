import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text, StyleSheet } from "react-native";
import { Calendar, DateData, } from "react-native-calendars";
import useStatistical from "./hooks/useStatistical";
import { formatCurrency } from "@/helpers/libs";
import { MarkedDates, Transaction, TransactionsByDate } from "@/types/transaction.types";


const CalendarView: React.FC = () => {
    const { state, handler } = useStatistical();

    const renderFinancialSummary = () => (
        <View className="bg-white mx-4 my-2 rounded-lg p-4 shadow-sm">
            <View className="flex-row justify-between">
                <View className="items-center flex-1">
                    <Text className="text-sm font-semibold text-gray-600 mb-1">
                        Income
                    </Text>
                    <Text className="text-blue-600 font-bold text-base">
                        {formatCurrency(state.totalIncome)}
                    </Text>
                </View>
                <View className="items-center flex-1">
                    <Text className="text-sm font-semibold text-gray-600 mb-1">
                        Expense
                    </Text>
                    <Text className="text-red font-bold text-base">
                        {formatCurrency(state.totalExpense)}
                    </Text>
                </View>
                <View className="items-center flex-1">
                    <Text className="text-sm font-semibold text-gray-600 mb-1">
                        Total
                    </Text>
                    <Text
                        className={`font-bold text-base ${state.totalIncome - state.totalExpense >= 0
                            ? "text-blue-600"
                            : "text-red"
                            }`}
                    >
                        {formatCurrency(state.totalIncome - state.totalExpense)}
                    </Text>
                </View>
            </View>
        </View>
    );

    const getMarkedDates = (): MarkedDates => {
        const markedDates: MarkedDates = {};

        Object.entries(state.transactionsByDate as TransactionsByDate).forEach(
            ([date, transactions]) => {
                const hasExpense = transactions.some(
                    (t: Transaction) => t.type === "EXPENSE"
                );
                const hasIncome = transactions.some(
                    (t: Transaction) => t.type === "INCOME"
                );

                if (hasExpense && hasIncome) {
                    markedDates[date] = { marked: true, dotColor: "#8b5cf6" };
                } else if (hasExpense) {
                    markedDates[date] = { marked: true, dotColor: "#ef4444" };
                } else if (hasIncome) {
                    markedDates[date] = { marked: true, dotColor: "#10b981" };
                }
            }
        );

        // Mark currently selected date
        const selectedDateString = state.selectedDate.toISOString().split("T")[0];
        markedDates[selectedDateString] = {
            ...markedDates[selectedDateString],
            selected: true,
            selectedColor: "#3b82f6",
        };

        return markedDates;
    };

    return (
        <>
            <Calendar
                current={state.selectedDate.toISOString().split("T")[0]}
                minDate={"2025-01-01"}
                maxDate={"2025-12-31"}
                markingType={"period"}
                markedDates={getMarkedDates()}
                onMonthChange={(month: any) => {
                    handler.handleMonthChange(month);
                }}
                // onDayPress={(day) => {
                //     // Add day press handling here if needed
                // }}
                dayComponent={({ date, state: dateState }: { date: DateData; state: 'selected' | 'disabled' | '' }) => {
                    const formattedDate = date.dateString;
                    const transactionsForDay =
                        state.transactionsByDate[formattedDate] || [];
                    const transactionData = handler.getTransaction(transactionsForDay);
                    const isSelected =
                        formattedDate === state.selectedDate.toISOString().split("T")[0];
                    const hasExpense = transactionsForDay.some(
                        (t) => t.type === "EXPENSE"
                    );
                    const hasIncome = transactionsForDay.some((t) => t.type === "INCOME");

                    return (
                        <TouchableOpacity
                            style={[
                                styles.dateContainer,
                                dateState === "disabled" && styles.disabledDate,
                                isSelected && styles.selectedDate,
                                hasExpense && hasIncome && styles.mixedDate,
                                !hasIncome && hasExpense && styles.expenseDate,
                                hasIncome && !hasExpense && styles.incomeDate,
                            ]}
                        >
                            <View
                                style={[
                                    styles.dateCircle,
                                    isSelected && styles.selectedDateCircle,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.dateText,
                                        dateState === "disabled" && styles.disabledText,
                                        isSelected && styles.selectedDateText,
                                    ]}
                                >
                                    {date.day}
                                </Text>
                            </View>

                            <View style={styles.transactionContainer}>
                                {transactionData.income !== 0 && (
                                    <Text
                                        style={[
                                            styles.incomeText,
                                            dateState === "disabled" && styles.disabledText,
                                        ]}
                                    >
                                        {formatCurrency(transactionData.income)}
                                    </Text>
                                )}
                                {transactionData.expense !== 0 && (
                                    <Text
                                        style={[
                                            styles.expenseText,
                                            dateState === "disabled" && styles.disabledText,
                                        ]}
                                    >
                                        {formatCurrency(transactionData.expense)}
                                    </Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                }}
                theme={{
                    backgroundColor: "#ffffff",
                    calendarBackground: "#ffffff",
                    textSectionTitleColor: "#64748b",
                    selectedDayBackgroundColor: "#3b82f6",
                    selectedDayTextColor: "#ffffff",
                    todayTextColor: "#3b82f6",
                    dayTextColor: "#334155",
                    textDisabledColor: "#94a3b8",
                    arrowColor: "#475569",
                    monthTextColor: "#1e293b",
                    textDayFontWeight: "500",
                    textMonthFontWeight: "bold",
                    textDayHeaderFontWeight: "600",
                    textDayFontSize: 16,
                    textMonthFontSize: 18,
                    textDayHeaderFontSize: 13,
                }}
            />
            {renderFinancialSummary()}
        </>
    );
};

const styles = StyleSheet.create({
    dateContainer: {
        width: "100%",
        height: 75,
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 12,
        padding: 6,
    },
    dateCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    selectedDateCircle: {
        backgroundColor: "#3b82f6",
    },
    dateText: {
        fontSize: 14,
        color: "#334155",
        fontWeight: "600",
    },
    selectedDateText: {
        color: "#ffffff",
    },
    transactionContainer: {
        alignItems: "center",
    },
    incomeText: {
        color: "#10b981",
        fontSize: 8,
        fontWeight: "700",
        marginBottom: 2,
    },
    expenseText: {
        color: "#ef4444",
        fontSize: 8,
        fontWeight: "700",
    },
    disabledDate: {
        backgroundColor: "#f8fafc",
    },
    disabledText: {
        color: "#94a3b8",
    },
    selectedDate: {
        backgroundColor: "#eff6ff",
        borderWidth: 1,
        borderColor: "#bfdbfe",
    },
    expenseDate: {
        backgroundColor: "#fef2f2",
    },
    incomeDate: {
        backgroundColor: "#f0fdf4",
    },
    mixedDate: {
        backgroundColor: "#f5f3ff",
    },
});

export default CalendarView;
