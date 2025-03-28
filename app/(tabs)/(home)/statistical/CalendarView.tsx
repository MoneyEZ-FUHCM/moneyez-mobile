import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text, StyleSheet } from "react-native";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";
import useStatistical from "./hooks/useStatistical";
import { formatCurrency } from "@/helpers/libs";
import {
  MarkedDates,
  Transaction,
  TransactionsByDate,
} from "@/types/transaction.types";
import TEXT_TRANSLATE_STATISTICAL from "./Statistical.translate";

const CalendarView: React.FC = () => {
  const { state, handler } = useStatistical();

  LocaleConfig.locales["fr"] = {
    monthNames: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    monthNamesShort: [
      "Th.1",
      "Th.2",
      "Th.3",
      "Th.4",
      "Th.5",
      "Th.6",
      "Th.7",
      "Th.8",
      "Th.9",
      "Th.10",
      "Th.11",
      "Th.12",
    ],
    dayNames: [
      "Chủ nhật",
      "Thứ hai",
      "Thứ ba",
      "Thứ tư",
      "Thứ năm",
      "Thứ sáu",
      "Thứ bảy",
    ],
    dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    today: "Hôm nay",
  };

  LocaleConfig.defaultLocale = "fr";

  const renderFinancialSummary = () => (
    <View className="mx-4 my-2 rounded-lg bg-white p-4 shadow-sm">
      <View className="flex-row justify-between">
        <View className="flex-1 items-center">
          <Text className="mb-1 text-sm font-semibold text-gray-600">
            {TEXT_TRANSLATE_STATISTICAL.LABELS.INCOME}
          </Text>
          <Text className="text-base font-bold text-blue-600">
            {formatCurrency(state.totalIncome)}
          </Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="mb-1 text-sm font-semibold text-gray-600">
            {TEXT_TRANSLATE_STATISTICAL.LABELS.EXPENSE}
          </Text>
          <Text className="text-base font-bold text-red">
            {formatCurrency(state.totalExpense)}
          </Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="mb-1 text-sm font-semibold text-gray-600">
            {TEXT_TRANSLATE_STATISTICAL.LABELS.TOTAL}
          </Text>
          <Text
            className={`text-base font-bold ${
              state.totalIncome - state.totalExpense >= 0
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
          (t: Transaction) => t.type === "EXPENSE",
        );
        const hasIncome = transactions.some(
          (t: Transaction) => t.type === "INCOME",
        );

        if (hasExpense && hasIncome) {
          markedDates[date] = { marked: true, dotColor: "#8b5cf6" };
        } else if (hasExpense) {
          markedDates[date] = { marked: true, dotColor: "#ef4444" };
        } else if (hasIncome) {
          markedDates[date] = { marked: true, dotColor: "#10b981" };
        }
      },
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
        dayComponent={({
          date,
          state: dateState,
        }: {
          date: DateData;
          state: "selected" | "disabled" | "";
        }) => {
          const formattedDate = date.dateString;
          const transactionsForDay =
            state.transactionsByDate[formattedDate] || [];
          const transactionData = handler.getTransaction(transactionsForDay);
          const isSelected =
            formattedDate === state.selectedDate.toISOString().split("T")[0];
          const hasExpense = transactionsForDay.some(
            (t) => t.type === "EXPENSE",
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
    height: 65,
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
