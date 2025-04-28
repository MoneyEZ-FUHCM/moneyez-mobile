import { Transaction } from "@/helpers/types/transaction.types";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetRecurringTransactionQuery } from "@/services/recurringTransaction";
import { useGetRecurringTransactionsCalendarQuery } from "@/services/transaction";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { BackHandler } from "react-native";
import { useDispatch } from "react-redux";

const useRecurringTransactionsCalendar = () => {
  const dispatch = useDispatch();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsByDate, setTransactionsByDate] = useState<
    Record<string, Transaction[]>
  >({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1,
  );
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  const {
    data: transactionsResponseData,
    error,
    isLoading,
    refetch,
  } = useGetRecurringTransactionQuery({
    PageIndex: 1,
    PageSize: 20,
    isActive: true,
  });
  const {
    data: dateCalendarResponseData,
    error: recurringTransactionError,
    isLoading: recurringTransactionIsLoading,
    refetch: recurringTransactionRefetch,
  } = useGetRecurringTransactionsCalendarQuery({});

  useEffect(() => {
    recurringTransactionRefetch();
  }, [dateCalendarResponseData]);

  const handleBack = useCallback(() => {
    router.back();
    dispatch(setMainTabHidden(true));
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleBack();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [handleBack]),
  );

  useEffect(() => {
    caculateFinancialSummary(selectedMonth);
  }, [selectedMonth, transactions]);

  useEffect(() => {
    const fetchedTransactions =
      (transactionsResponseData?.data?.data as Transaction[]) || [];
    setTransactions(fetchedTransactions);
  }, [transactionsResponseData]);

  useEffect(() => {
    const newTransactionsByDate = transactions.reduce(
      (acc, transaction) => {
        const formattedDate = transaction?.startDate?.split("T")[0];
        if (!acc[formattedDate]) acc[formattedDate] = [];
        acc[formattedDate].push(transaction);
        return acc;
      },
      {} as Record<string, Transaction[]>,
    );

    setTransactionsByDate(newTransactionsByDate);
  }, [transactions]);

  const getTransaction = (transactions: Transaction[]) => {
    const result = transactions.reduce(
      (acc, t) => {
        if (t.type === (0 as any)) {
          acc.income += t.amount;
        } else if (t.type === (1 as any)) {
          acc.expense += t.amount;
        }
        return acc;
      },
      { income: 0, expense: 0 },
    );

    return result;
  };

  const caculateFinancialSummary = (month: number) => {
    const transactionsOnMonth =
      transactions.filter(
        (t) => new Date(t.startDate).getMonth() + 1 === month,
      ) || [];

    const result = transactionsOnMonth.reduce(
      (acc, t) => {
        if (t.type === (0 as any)) {
          acc.income += t.amount;
        } else if (t.type === (1 as any)) {
          acc.expense += t.amount;
        }
        return acc;
      },

      { income: 0, expense: 0 },
    );
    setTotalExpense(result.expense);
    setTotalIncome(result.income);
  };

  const handleMonthChange = (date: any) => {
    setSelectedMonth(date.month);
  };

  return {
    state: {
      selectedMonth,
      selectedDate,
      totalExpense,
      totalIncome,
      transactions,
      transactionsByDate,
      error,
      isLoading,
      recurringTransactionIsLoading,
      recurringTransactionError,
      dateCalendarResponseData,
    },
    handler: {
      handleBack,
      handleMonthChange,
      caculateFinancialSummary,
      getTransaction,
      refetch,
      setSelectedDate,
      recurringTransactionRefetch,
    },
  };
};

export default useRecurringTransactionsCalendar;
