import {
  FlatListCustom,
  LoadingSectionWrapper,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import { Colors } from "@/helpers/constants/color";
import { UserSpendingModel } from "@/helpers/types/spendingModel.types";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { ActivityIndicator } from "react-native-paper";
import useSpendingModelHistory from "./hooks/useSpendingModelHistory";
import TEXT_TRANSLATE_SPENDING_MODEL_HISTORY from "./SpendingModelHistory.translate";

export default function SpendingModelList() {
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
    console.log("check spendingModel", spendingModel);
    return (
      <View className="mb-4 overflow-hidden rounded-2xl bg-white shadow-sm">
        <View className="border-b border-gray-100 p-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-800">
              {spendingModel?.name}
            </Text>
            <View className="flex-row items-center space-x-2">
              <MaterialIcons name="date-range" size={18} color="#6B7280" />
              <Text className="text-sm text-gray-500">
                {handler.formatDate(spendingModel?.startDate)} -{" "}
                {handler.formatDate(spendingModel?.endDate)}
              </Text>
            </View>
          </View>
          {spendingModel.status !== "ACTIVE" && (
            <View className="mt-2 flex-row items-center">
              <View
                className={`mr-2 rounded-full ${spendingModel.status === "EXPIRED" ? "bg-yellow-500/10" : "bg-red-500/10"} p-1`}
              >
                <MaterialIcons
                  name={
                    spendingModel.status === "EXPIRED"
                      ? "access-time"
                      : "delete"
                  }
                  size={12}
                  color={
                    spendingModel.status === "EXPIRED" ? "#F59E0B" : "#EF4444"
                  }
                />
              </View>
              <Text
                className={`text-xs font-medium ${spendingModel.status === "EXPIRED" ? "text-yellow-500" : "text-red-500"}`}
              >
                {spendingModel.status === "EXPIRED" ? "Đã hết hạn" : "Đã xóa"}
              </Text>
            </View>
          )}
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
            className="mt-4 flex-row items-center justify-center rounded-xl bg-superlight p-3"
            onPress={() => handler.handleViewSpendingDetail(spendingModel?.id)}
          >
            <Text className="mr-2 font-medium text-primary">
              {TEXT_TRANSLATE_SPENDING_MODEL_HISTORY.BUTTON.SEE_DETAIL}
            </Text>
            <MaterialIcons
              name="arrow-forward"
              size={18}
              color={Colors.colors.primary}
            />
          </Pressable>
        </View>
      </View>
    );
  };

  const renderMainTabs = () => (
    <SectionComponent rootClassName="mb-4">
      <View className="flex-row rounded-md border-b border-gray-200 bg-white">
        <Pressable
          onPress={() => handler.setActiveTab("available")}
          className={`flex-1 rounded-md py-3 ${
            state.activeTab === "available" ? "border-b-2 border-primary" : ""
          }`}
        >
          <Text
            className={`text-center font-medium ${
              state.activeTab === "available" ? "text-primary" : "text-gray-600"
            }`}
          >
            Đang hoạt động
          </Text>
        </Pressable>
        <Pressable
          onPress={() => handler.setActiveTab("unavailable")}
          className={`flex-1 rounded-md py-3 ${
            state.activeTab === "unavailable" ? "border-b-2 border-primary" : ""
          }`}
        >
          <Text
            className={`text-center font-medium ${
              state.activeTab === "unavailable"
                ? "text-primary"
                : "text-gray-600"
            }`}
          >
            Không hoạt động
          </Text>
        </Pressable>
      </View>
    </SectionComponent>
  );

  const renderNonAvailableFilters = () => {
    if (state.activeTab !== "unavailable") return null;

    return (
      <SectionComponent rootClassName="mb-4">
        <Text className="mb-2 text-sm font-bold text-gray-600">
          Lọc theo trạng thái:
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-2">
            <Pressable
              onPress={() => handler.setNonAvailableFilter("all")}
              className={`rounded-lg px-5 py-2 ${
                state.nonAvailableFilter === "all"
                  ? "bg-primary shadow-sm"
                  : "border border-gray-200 bg-white"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  state.nonAvailableFilter === "all"
                    ? "text-white"
                    : "text-gray-600"
                }`}
              >
                Tất cả
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handler.setNonAvailableFilter("expired")}
              className={`flex-row items-center space-x-1 rounded-lg px-5 py-2 ${
                state.nonAvailableFilter === "expired"
                  ? "bg-primary shadow-sm"
                  : "border border-gray-200 bg-white"
              }`}
            >
              <MaterialIcons
                name="date-range"
                size={20}
                color={
                  state.nonAvailableFilter === "expired" ? "white" : "gray"
                }
              />
              <Text
                className={`text-sm font-medium ${
                  state.nonAvailableFilter === "expired"
                    ? "text-white"
                    : "text-gray-600"
                }`}
              >
                Đã hết hạn
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handler.setNonAvailableFilter("deleted")}
              className={`flex-row items-center space-x-1 rounded-lg px-5 py-2 ${
                state.nonAvailableFilter === "deleted"
                  ? "bg-primary shadow-sm"
                  : "border border-gray-200 bg-white"
              }`}
            >
              <Ionicons
                name="trash-bin"
                size={20}
                color={
                  state.nonAvailableFilter === "deleted" ? "white" : "gray"
                }
              />
              <Text
                className={`text-sm font-medium ${
                  state.nonAvailableFilter === "deleted"
                    ? "text-white"
                    : "text-gray-600"
                }`}
              >
                Đã xóa
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SectionComponent>
    );
  };

  return (
    <SafeAreaViewCustom rootClassName="bg-gray-50">
      <SectionComponent rootClassName="bg-white">
        <View className="relative h-14 flex-row items-center justify-center px-4">
          <Pressable
            onPress={handler.handleBack}
            className="absolute left-4 h-10 w-10 items-center justify-center rounded-full active:bg-gray-100"
          >
            <MaterialIcons name="arrow-back" size={24} />
          </Pressable>
          <Text className="text-lg font-semibold text-gray-800">
            {TEXT_TRANSLATE_SPENDING_MODEL_HISTORY.TITLE.SPENDING_MODEL_HISTORY}
          </Text>
        </View>
      </SectionComponent>

      {state.isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.colors.primary} />
          <Text className="mt-3 text-gray-600">Đang tải dữ liệu...</Text>
        </View>
      ) : state.spendingModels.length > 0 ? (
        <LoadingSectionWrapper isLoading={state.isRefetching}>
          <FlatListCustom<UserSpendingModel>
            showsVerticalScrollIndicator={false}
            data={state.filteredModels ?? []}
            renderItem={({ item }) =>
              renderSpendingModelItem({ spendingModel: item })
            }
            keyExtractor={(item) => item.id}
            ListHeaderComponent={
              <>
                {renderMainTabs()}
                {renderNonAvailableFilters()}
              </>
            }
            contentContainerStyle={{
              padding: 16,
            }}
            refreshing={state.isRefetching}
            onRefresh={handler.handleRefetch}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center rounded-2xl bg-white px-6 py-10 shadow-md">
                <FontAwesome
                  name="inbox"
                  size={50}
                  color={Colors.colors.primary}
                />
                <Text className="mt-6 text-xl font-semibold text-gray-700">
                  Không có dữ liệu
                </Text>
                <Text className="mt-2 text-center text-sm leading-relaxed text-gray-500">
                  Hiện tại không có dữ liệu để hiển thị. Hãy thử lại sau.
                </Text>
              </View>
            }
          />
        </LoadingSectionWrapper>
      ) : (
        <View className="mb-5 flex-1 items-center justify-center p-8">
          <FontAwesome name="inbox" size={50} color={Colors.colors.primary} />
          <Text className="mt-4 text-lg font-semibold text-gray-800">
            Chưa có dữ liệu
          </Text>
          <Text className="mt-2 text-center text-base text-gray-500">
            Không có mô hình chi tiêu nào để hiển thị
          </Text>
          <TouchableOpacity
            className="mt-6 rounded-lg bg-primary px-6 py-3"
            onPress={handler.handleCreateNew}
          >
            <Text className="font-medium text-white">
              Tạo mô hình chi tiêu mới
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaViewCustom>
  );
}
