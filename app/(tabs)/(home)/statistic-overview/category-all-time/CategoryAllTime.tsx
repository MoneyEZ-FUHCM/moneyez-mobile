import { SafeAreaViewCustom, SectionComponent } from "@/components";
import { TRANSACTION_TYPE_TEXT } from "@/helpers/enums/globals";
import { formatCurrency } from "@/helpers/libs";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import TEXT_TRANSLATE_CATEGORY_ALL_TIME from "./CategoryAllTime.translate";
import useCategoryAllTime from "./hooks/useCategoryAllTime";

const CategoryAllTimeScreen = () => {
  const { state, handler } = useCategoryAllTime();

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-gray-50">
      <SectionComponent rootClassName="h-14 bg-white shadow-sm justify-center relative">
        <TouchableOpacity
          onPress={handler.handleBack}
          className="absolute left-4 rounded-full bg-gray-50 p-2"
        >
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="items-center justify-between">
          <Text className="text-lg font-bold">
            {TEXT_TRANSLATE_CATEGORY_ALL_TIME.TITLE.ALL_TIME}
          </Text>
        </View>
      </SectionComponent>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 20 }}
        ref={state.chartRef}
      >
        <View className="mx-4 mt-4 flex-row rounded-lg border-b border-gray-200 bg-white">
          <Pressable
            className={`flex-1 rounded-lg border-b-2 py-2 ${state.type === TRANSACTION_TYPE_TEXT.EXPENSE ? "border-primary" : "border-transparent"}`}
            onPress={() => handler.setType(TRANSACTION_TYPE_TEXT.EXPENSE)}
          >
            <Text
              className={`text-center font-medium ${state.type === TRANSACTION_TYPE_TEXT.EXPENSE ? "font-bold text-primary" : "text-gray-400"}`}
            >
              {TEXT_TRANSLATE_CATEGORY_ALL_TIME.LABELS.EXPENSE}
            </Text>
          </Pressable>
          <Pressable
            className={`flex-1 rounded-lg border-b-2 py-2 ${state.type === TRANSACTION_TYPE_TEXT.INCOME ? "border-primary" : "border-transparent"}`}
            onPress={() => handler.setType(TRANSACTION_TYPE_TEXT.INCOME)}
          >
            <Text
              className={`text-center font-medium ${state.type === TRANSACTION_TYPE_TEXT.INCOME ? "font-bold text-primary" : "text-gray-400"}`}
            >
              {TEXT_TRANSLATE_CATEGORY_ALL_TIME.LABELS.INCOME}
            </Text>
          </Pressable>
        </View>

        <SectionComponent rootClassName="mt-4 bg-white p-4 rounded-lg mx-4">
          <View className="items-center">
            <PieChart
              data={state.pieData ?? []}
              donut
              showText
              radius={145}
              innerRadius={90}
              textSize={12}
              textColor="#000"
              showTextBackground={false}
              showValuesAsLabels={false}
              showGradient={false}
              isAnimated
              focusOnPress
              onPress={(item: any) => {
                if (item && item.icon) {
                  handler.handleSelectCategory(item.icon);
                }
              }}
              centerLabelComponent={() => {
                const selectedItem = state.expenseItems.find(
                  (item) => item.icon === state.selectedCategory,
                );

                if (!selectedItem) {
                  return null;
                }

                return (
                  <View className="items-center">
                    <Text
                      className="text-base font-semibold"
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {selectedItem.name}
                    </Text>
                    <Text
                      className={`text-xl font-bold ${state.type === TRANSACTION_TYPE_TEXT.INCOME ? "text-green" : "text-red"}`}
                    >
                      {formatCurrency(selectedItem.amount)}
                    </Text>
                    <Text className="text-sm font-bold text-gray-500">
                      {selectedItem.percentage}
                    </Text>
                  </View>
                );
              }}
            />
          </View>
        </SectionComponent>

        <View className="mx-4 mt-6 overflow-hidden rounded-xl bg-white shadow-md">
          <View className="flex-row items-center justify-between px-5 pb-2 pt-4">
            <Text className="text-lg font-semibold text-gray-800">
              Danh mục ({state.expenseItems?.length})
            </Text>
          </View>
          {state.expenseItems &&
            state.expenseItems?.length > 0 &&
            state.expenseItems?.map((item, index) => (
              <Pressable
                key={index}
                className={`flex-row items-center justify-between px-5 py-4 ${
                  index < state.expenseItems.length - 1
                    ? "border-b border-gray-100"
                    : ""
                } ${state.selectedCategory === item.icon ? "bg-superlight" : ""}`}
                onPress={() => handler.handleSelectCategory(item.icon)}
              >
                <View className="flex-row items-center">
                  <View
                    className="mr-4 h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <MaterialIcons
                      name={item.icon as any}
                      size={20}
                      color={item.color}
                    />
                  </View>
                  <Text className="text-base font-medium text-gray-800">
                    {item.name}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <View className="items-end">
                    <Text
                      className={`text-base font-semibold ${state.type === TRANSACTION_TYPE_TEXT.INCOME ? "text-green" : "text-red"}`}
                    >
                      {formatCurrency(item.amount)}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {item.percentage}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
        </View>
      </ScrollView>
    </SafeAreaViewCustom>
  );
};

export default CategoryAllTimeScreen;
