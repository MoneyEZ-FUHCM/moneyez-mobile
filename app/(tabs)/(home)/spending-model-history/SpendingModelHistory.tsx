import NoData from "@/assets/images/InviteMemberAssets/not-found-result.png";
import {
  FlatListCustom,
  LoadingSectionWrapper,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import { Colors } from "@/helpers/constants/color";
import { UserSpendingModel } from "@/helpers/types/spendingModel.types";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { ActivityIndicator } from "react-native-paper";
import useSpendingModelHistory from "./hooks/useSpendingModelHistory";
import TEXT_TRANSLATE_SPENDING_MODEL_HISTORY from "./SpendingModelHistory.translate";

export default function SpendingModelHistory() {
  const { state, handler } = useSpendingModelHistory();
  handler.useHideTabbar();

  const renderSpendingModelItem = ({
    spendingModel,
  }: {
    spendingModel: UserSpendingModel;
  }) => {
    const pieData = [
      { value: spendingModel?.totalIncome, color: "#5be98f", text: "Thu" },
      { value: spendingModel?.totalExpense, color: "#F87171", text: "Chi" },
    ];

    return (
      <View className="mb-4 overflow-hidden rounded-2xl bg-white shadow-sm">
        <View className="border-b border-gray-100 p-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-800">
              {spendingModel?.modelName}
            </Text>
            <View className="flex-row items-center space-x-2">
              <MaterialIcons name="date-range" size={18} color="#6B7280" />
              <Text className="text-sm text-gray-500">
                {handler.formatDate(spendingModel?.startDate)} -{" "}
                {handler.formatDate(spendingModel?.endDate)}
              </Text>
            </View>
          </View>
        </View>

        <View className="p-4">
          <View className="flex-row items-center justify-center">
            <View className="mr-2 flex-row items-center justify-center">
              <View className="flex h-24 w-24 items-center justify-center">
                {spendingModel?.totalIncome && spendingModel?.totalExpense ? (
                  <PieChart
                    isAnimated
                    data={pieData}
                    donut
                    radius={40}
                    innerRadius={25}
                    innerCircleColor="#FFFFFF"
                    centerLabelComponent={() => (
                      <View className="items-center">
                        <Text className="text-xs font-medium text-gray-600">
                          Tổng quan
                        </Text>
                      </View>
                    )}
                  />
                ) : (
                  <Text className="text-sm text-gray-400">Chưa có dữ liệu</Text>
                )}
              </View>
            </View>

            <View className="flex-1 space-y-2">
              <View className="rounded-xl p-3">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="mr-2 rounded-full bg-green/10 p-2">
                      <MaterialIcons
                        name="trending-up"
                        size={16}
                        color="#22C55E"
                      />
                    </View>
                    <Text className="font-medium text-gray-700">Thu nhập</Text>
                  </View>
                  <Text className="font-semibold text-green">
                    {handler.formatCurrency(spendingModel?.totalIncome)}
                  </Text>
                </View>
              </View>

              <View className="rounded-xl p-3">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="mr-2 rounded-full bg-red/10 p-2">
                      <MaterialIcons
                        name="trending-down"
                        size={16}
                        color="#EF4444"
                      />
                    </View>
                    <Text className="font-medium text-gray-700">Chi tiêu</Text>
                  </View>
                  <Text className="font-semibold text-red">
                    {handler.formatCurrency(spendingModel?.totalExpense)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <Pressable
            className="mt-4 flex-row items-center justify-center rounded-xl bg-blue-50 p-3 active:bg-blue-100"
            onPress={() => handler.handleViewPeriodHistory(spendingModel?.id)}
          >
            <Text className="mr-2 font-medium text-blue-600">
              {TEXT_TRANSLATE_SPENDING_MODEL_HISTORY.BUTTON.SEE_DETAIL}
            </Text>
            <MaterialIcons name="arrow-forward" size={18} color="#2563EB" />
          </Pressable>
        </View>
      </View>
    );
  };

  const renderYearSection = ({ item }: { item: any }) => (
    <SectionComponent rootClassName="">
      <View className="mb-4 flex-row items-center justify-between rounded-xl bg-white p-3">
        <View className="flex-row items-center">
          <View className="rounded-full bg-superlight p-2">
            <MaterialIcons
              name="event"
              size={20}
              color={Colors.colors.primary}
            />
          </View>
          <Text className="ml-3 text-lg font-bold text-gray-700">
            {item?.year}
          </Text>
        </View>
        <Text className="rounded-lg bg-superlight px-2 py-1 text-xs font-bold text-primary">
          {item?.userSpendingModels?.length} mô hình
        </Text>
      </View>
      {item?.userSpendingModels?.map((spendingModel: UserSpendingModel) => (
        <React.Fragment key={spendingModel?.id}>
          {renderSpendingModelItem({ spendingModel })}
        </React.Fragment>
      ))}
    </SectionComponent>
  );

  const renderListHeader = () => (
    <SectionComponent rootClassName="-3 mb-4">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row space-x-2">
          {state.filters.map((tab) => (
            <Pressable
              key={tab?.id}
              onPress={() => handler.setActiveFilter(tab?.id)}
              className={`rounded-lg px-5 py-2 ${
                state.activeFilter === tab?.id
                  ? "bg-primary shadow-sm"
                  : "border border-gray-200 bg-white"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  state.activeFilter === tab?.id
                    ? "text-white"
                    : "text-gray-600"
                }`}
              >
                {tab?.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SectionComponent>
  );

  return (
    <SafeAreaViewCustom rootClassName="bg-gray-50">
      <SectionComponent rootClassName="bg-white">
        <View className="h-14 flex-row items-center justify-between px-4">
          <Pressable
            onPress={handler.handleBack}
            className="h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
          >
            <MaterialIcons name="arrow-back" size={24} />
          </Pressable>
          <Text className="text-lg font-semibold text-gray-800">
            {TEXT_TRANSLATE_SPENDING_MODEL_HISTORY.TITLE.SPENDING_MODEL_HISTORY}
          </Text>
          <View style={{ width: 40 }} />
        </View>
      </SectionComponent>

      {state.isLoading || state.isLoadingHistory ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.colors.primary} />
          <Text className="mt-3 text-gray-600">Đang tải dữ liệu...</Text>
        </View>
      ) : state.spendingModelsByYear?.length > 0 ? (
        <LoadingSectionWrapper isLoading={state.isRefetching}>
          <FlatListCustom
            showsVerticalScrollIndicator={false}
            data={state.filterSpendingModelsByYear ?? []}
            renderItem={renderYearSection}
            keyExtractor={(item) => item.year}
            ListHeaderComponent={renderListHeader}
            contentContainerStyle={{
              padding: 16,
            }}
            refreshing={state.isRefetching}
            onRefresh={handler.handleRefetch}
          />
        </LoadingSectionWrapper>
      ) : (
        <View className="flex-1 items-center justify-center p-8">
          <Image source={NoData} className="h-56 w-56" resizeMode="contain" />
          <Text className="mt-4 text-lg font-semibold text-gray-800">
            Chưa có dữ liệu
          </Text>
          <Text className="mt-2 text-center text-base text-gray-500">
            Không có mô hình chi tiêu nào để hiển thị
          </Text>
        </View>
      )}
    </SafeAreaViewCustom>
  );
}
