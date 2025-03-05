import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  FlatListCustom,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import useSpendingModelHistory, { UserSpendingModel } from "./hooks/useSpendingModelHistory";

export default function SpendingModelHistory() {
  const { state, handler } = useSpendingModelHistory();

  const renderSpendingModelItem = ({
    spendingModel,
  }: {
    spendingModel: UserSpendingModel;
  }) => (
    <View className="mb-3 rounded border border-[#dbdbdb] p-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-[#609084]">
          {spendingModel.modelName}
        </Text>
        <Text className="text-base font-medium text-[#00a010]">
          {handler.formatCurrency(spendingModel.totalIncome)}
        </Text>
      </View>

      <View className="mt-2 flex-row items-center justify-between">
        <Text className="text-sm italic text-[#021433]">
          {handler.formatDate(spendingModel.startDate)} - {handler.formatDate(spendingModel.endDate)}
        </Text>
        <Text className="text-base font-medium text-[#cc0000]">
          {handler.formatCurrency(spendingModel.totalExpense)}
        </Text>
      </View>

      <Pressable
        className="mt-2 flex items-end"
        onPress={() => handler.handleViewPeriodHistory(spendingModel.id)}
      >
        <Text className="text-sm italic text-[#609084] underline">
          <Text>Xem chi tiết</Text>
          <Text> &gt;</Text>
        </Text>
      </Pressable>
    </View>
  );

  const renderYearSection = ({ item }: { item: any }) => (
    <SectionComponent rootClassName="bg-white mx-4 mb-4 px-4 rounded-lg">
      <Text className="mb-4 text-xl font-semibold text-[#021433]">
        {item.year}
      </Text>
      {item.userSpendingModels && item.userSpendingModels.map((spendingModel: UserSpendingModel, index: number) => (
        <React.Fragment key={index}>
          {renderSpendingModelItem({ spendingModel })}
        </React.Fragment>
      ))}
    </SectionComponent>
  );

  const renderListHeader = () => (
    <>
      {/* FILTER TABS */}
      <SectionComponent rootClassName="bg-white px-4 py-2 mb-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-3">
            {state.filters.map((tab) => (
              <Pressable
                key={tab.id}
                onPress={() => handler.setActiveFilter(tab.id)}
                className={`rounded-2xl border px-4 py-2 ${state.activeFilter === tab.id
                    ? "border-[#609084] bg-[#609084]"
                    : "border-[#609084] bg-white"
                  }`}
              >
                <Text
                  className={`text-base ${state.activeFilter === tab.id ? "text-white" : "text-[#609084]"
                    }`}
                >
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </SectionComponent>
    </>
  );

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-[#fafafa]">
      {/* HEADER */}
      <SectionComponent rootClassName="h-14 bg-white justify-center">
        <View className="flex-row items-center justify-between px-5">
          <Pressable onPress={handler.handleBack}>
            <MaterialIcons name="arrow-back" size={24} color="#609084" />
          </Pressable>
          <Text className="text-lg font-bold text-primary">
            Lịch sử mô hình chi tiêu
          </Text>
          <View style={{ width: 24 }} />
        </View>
      </SectionComponent>

      {/* SPENDING MODEL LIST WITH HEADER */}
      <FlatListCustom
        data={state.spendingModelsByYear || []}
        renderItem={renderYearSection}
        keyExtractor={(item) => item.year}
        ListHeaderComponent={renderListHeader}
        contentContainerStyle={{
          paddingTop: 4,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaViewCustom>
  );
}