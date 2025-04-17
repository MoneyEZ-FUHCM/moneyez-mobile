import { SafeAreaViewCustom, SectionComponent } from "@/components";
import { Colors } from "@/helpers/constants/color";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { formatCurrency } from "@/helpers/libs";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Progress from "react-native-progress";
import useStatisticOverview from "./hooks/useStatisticOverview";

const StatisticOverview = () => {
  const { state, handler } = useStatisticOverview();

  const renderHeader = useCallback(
    () => (
      <SectionComponent rootClassName="h-14 bg-white justify-center items-center shadow-sm">
        <View className="relative h-full flex-row items-center px-5">
          <Pressable
            onPress={handler.handleBack}
            className="absolute left-4 h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
          >
            <MaterialIcons name="arrow-back" size={24} color="#333" />
          </Pressable>
          <View className="flex-1 items-center">
            <Text className="text-lg font-bold">Báo cáo thống kê</Text>
          </View>
        </View>
      </SectionComponent>
    ),
    [handler],
  );

  const statisticCards = [
    {
      id: "balance-report",
      title: "Báo cáo số dư",
      description: "Theo dõi biến động số dư theo thời gian",
      icon: "account-balance-wallet",
      color: Colors.colors.blue,
      path: PATH_NAME.HOME.BALANCE_REPORT,
    },
    {
      id: "spending-model",
      title: "Thống kê mô theo hình chi tiêu",
      description: "Phân tích theo mô hình và hành vi chi tiêu của bạn",
      icon: "pie-chart",
      color: Colors.colors.green,
      path: PATH_NAME.HOME.STATISTICAL,
    },
    {
      id: "yearly-report",
      title: "Báo cáo theo năm",
      description: "Báo cáo và phân tích tài chính hàng năm",
      icon: "bar-chart",
      color: Colors.colors.orange,
      path: PATH_NAME.HOME.YEAR_REPORT,
    },
    {
      id: "cate-overview",
      title: "Tổng quan danh mục",
      description: "Phân tích chi tiết theo danh mục",
      icon: "category",
      color: Colors.colors.deep_yellow,
      path: PATH_NAME.HOME.CATEGORY_ALL_TIME,
    },
    {
      id: "yearly-cate",
      title: "Danh mục theo năm",
      description: "Xem phân bổ danh mục theo năm",
      icon: "date-range",
      color: Colors.colors.pink,
      path: PATH_NAME.HOME.CATEGORY_YEAR_REPORT,
    },
    {
      id: "recurring-calendar",
      title: "Lịch giao dịch định kỳ",
      description: "Xem lịch các giao dịch định kỳ",
      icon: "event-repeat",
      color: Colors.colors.red,
      path: PATH_NAME.HOME.RECURRING_TRANSACTIONS_CALENDAR,
    },
  ];

  const filteredCards =
    state.activeCategory === "all"
      ? statisticCards
      : statisticCards.filter((card) => {
          switch (state.activeCategory) {
            case "spending":
              return card.id === "spending-model";
            case "balance":
              return card.id === "balance-report";
            case "yearly":
              return card.id === "yearly-categories";
            case "overview":
              return card.id === "lifetime-overview";
            case "categories":
              return card.id === "category-overview";
            case "yearly-report":
              return card.id === "yearly-report";
            case "recurring":
              return card.id === "recurring-calendar";
            default:
              return true;
          }
        });

  const renderStatisticCard = useCallback(
    (item: any) => (
      <Pressable
        onPress={() => router.navigate(item.path)}
        key={item.id}
        className="mb-4 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
      >
        <View className="flex-row p-4">
          <View
            style={{ backgroundColor: item.color + "20" }}
            className="mr-4 h-16 w-16 items-center justify-center rounded-full"
          >
            <MaterialIcons name={item.icon} size={28} color={item.color} />
          </View>
          <View className="flex-1 justify-center">
            <Text className="text-base font-bold text-gray-800">
              {item.title}
            </Text>
            <Text className="mt-1 text-text-gray">{item.description}</Text>
          </View>
          <View className="justify-center">
            <MaterialIcons name="chevron-right" size={24} color="#888" />
          </View>
        </View>
        <View className="h-1.5" style={{ backgroundColor: item.color }} />
      </Pressable>
    ),
    [],
  );

  const renderStatisticsAtGlance = useCallback(() => {
    if (!state.financialSummary) {
      return (
        <View className="m-4 overflow-hidden rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <Text className="text-center text-gray-500">Đang tải dữ liệu...</Text>
        </View>
      );
    }

    const financialData = [
      {
        id: "income",
        label: "Thu nhập",
        value: formatCurrency(state.financialSummary?.income as number),
        icon: "trending-up",
        color: Colors.colors.green,
      },
      {
        id: "expense",
        label: "Chi tiêu",
        value: formatCurrency(state.financialSummary?.expense as number),
        icon: "trending-down",
        color: Colors.colors.red,
      },
      {
        id: "total",
        label: "Tổng cộng",
        value: formatCurrency(state.financialSummary?.total as number),
        icon: "account-balance-wallet",
        color: Colors.colors.blue,
      },
      // {
      //   id: "accumulated",
      //   label: "Tích lũy",
      //   value: formatCurrency(state.financialSummary?.cumulation as number),
      //   icon: "savings",
      //   color: Colors.colors.primary,
      // },
    ];

    const income = state.financialSummary?.income || 0;
    const expense = state.financialSummary?.expense || 0;

    const expenseRatio = income > 0 ? expense / income : 0;

    let percentageToShow = 0;
    let progressBarColor = Colors.colors.green;
    let progressText = "0% tiết kiệm được từ thu nhập";

    if (income > 0 || expense > 0) {
      const isOverspending = expense > income;

      percentageToShow = isOverspending
        ? Math.min(Math.round(expenseRatio * 100), 100)
        : Math.round(((income - expense) * 100) / income);

      progressBarColor = isOverspending
        ? Colors.colors.red
        : Colors.colors.green;

      progressText = isOverspending
        ? `${percentageToShow}% chi tiêu vượt quá thu nhập`
        : `${percentageToShow}% tiết kiệm được từ thu nhập`;
    }

    return (
      <View className="m-4 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <View className="border-b border-gray-100 p-4">
          <Text className="text-lg font-bold text-gray-800">
            Tổng quan tài chính
          </Text>
        </View>

        {financialData.map((item, index) => (
          <View
            key={item.id}
            className={`flex-row items-center px-4 py-3 ${
              index < financialData.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <View
              className="mr-3 h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: `${item.color}20` }}
            >
              <MaterialIcons
                name={(item.icon as any) ?? "question-mark"}
                size={18}
                color={item.color}
              />
            </View>

            <Text className="flex-1 font-medium text-gray-700">
              {item.label}
            </Text>

            <Text className="text-base font-bold" style={{ color: item.color }}>
              {item.value}
            </Text>
          </View>
        ))}

        <View className="bg-gray-50 p-4">
          <Progress.Bar
            progress={percentageToShow / 100}
            className="w-full"
            width={326}
            height={7.5}
            borderRadius={100}
            borderWidth={0}
            color={progressBarColor}
            unfilledColor={"#eee"}
            useNativeDriver={true}
          />
          <Text className="mt-2 text-center text-xs text-gray-500">
            {progressText}
          </Text>
        </View>
      </View>
    );
  }, [state.financialSummary]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaViewCustom rootClassName="bg-gray-100 flex-1">
        {renderHeader()}

        <ScrollView
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {renderStatisticsAtGlance()}
          <SectionComponent rootClassName="px-4">
            {filteredCards.map(renderStatisticCard)}
          </SectionComponent>
        </ScrollView>
      </SafeAreaViewCustom>
    </GestureHandlerRootView>
  );
};

export default StatisticOverview;
