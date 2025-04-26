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
  }) => (
    <View className="mb-3 rounded-2xl border border-[#dbdbdb] p-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-[#609084]">
          {spendingModel?.modelName}
        </Text>
        <Text className="text-base font-medium text-[#00a010]">
          {spendingModel?.totalIncome !== 0
            ? `+ ${handler.formatCurrency(spendingModel?.totalIncome)}`
            : handler.formatCurrency(spendingModel?.totalIncome)}
        </Text>
      </View>

      <View className="mt-2 flex-row items-center justify-between">
        <Text className="text-sm italic text-[#021433]">
          {handler.formatDate(spendingModel?.startDate)} -{" "}
          {handler.formatDate(spendingModel?.endDate)}
        </Text>
        <Text className="text-base font-medium text-[#cc0000]">
          {spendingModel?.totalExpense !== 0
            ? `-${handler.formatCurrency(spendingModel?.totalExpense)}`
            : handler.formatCurrency(spendingModel?.totalExpense)}
        </Text>
      </View>

      <Pressable
        className="mt-2 flex items-end"
        onPress={() => handler.handleViewPeriodHistory(spendingModel?.id)}
      >
        <Text className="text-sm italic text-[#609084] underline">
          <Text>{TEXT_TRANSLATE_SPENDING_MODEL_HISTORY.BUTTON.SEE_DETAIL}</Text>
          <Text> &gt;</Text>
        </Text>
      </Pressable>
    </View>
  );

  const renderYearSection = ({ item }: { item: any }) => (
    <SectionComponent rootClassName="bg-white mb-4 px-5 py-3 rounded-lg">
      <Text className="mb-2 text-xl font-semibold text-[#021433]">
        {item?.year}
      </Text>
      {item?.userSpendingModels?.map((spendingModel: UserSpendingModel) => (
        <React.Fragment key={spendingModel?.id}>
          {renderSpendingModelItem({ spendingModel })}
        </React.Fragment>
      ))}
    </SectionComponent>
  );

  const renderListHeader = () => (
    <>
      {/* FILTER TABS */}
      <SectionComponent rootClassName=" px-5 py-2 mb-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row space-x-3">
            {state.filters.map((tab) => (
              <Pressable
                key={tab?.id}
                onPress={() => handler.setActiveFilter(tab?.id)}
                className={`rounded-2xl border px-5 py-0.5 ${
                  state.activeFilter === tab?.id
                    ? "border-[#609084] bg-[#609084]"
                    : "border-[#609084] bg-white"
                }`}
              >
                <Text
                  className={`text-base ${
                    state.activeFilter === tab?.id
                      ? "text-white"
                      : "text-[#609084]"
                  }`}
                >
                  {tab?.label}
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
            <MaterialIcons name="arrow-back" size={24} />
          </Pressable>
          <Text className="text-lg font-bold">
            {TEXT_TRANSLATE_SPENDING_MODEL_HISTORY.TITLE.SPENDING_MODEL_HISTORY}
          </Text>
          <View style={{ width: 24 }} />
        </View>
      </SectionComponent>
      {state.isLoading || state.isLoadingHistory ? (
        <View className="mb-28 flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.colors.primary} />
        </View>
      ) : state.spendingModelsByYear &&
        state.spendingModelsByYear.length > 0 ? (
        <LoadingSectionWrapper isLoading={state.isRefetching}>
          <FlatListCustom
            showsVerticalScrollIndicator={false}
            data={state.spendingModelsByYear ?? []}
            renderItem={renderYearSection}
            keyExtractor={(item) => item.year}
            ListHeaderComponent={renderListHeader}
            contentContainerStyle={{
              paddingTop: 4,
              paddingBottom: 24,
            }}
            refreshing={state.isRefetching}
            onRefresh={handler.handleRefetch}
          />
        </LoadingSectionWrapper>
      ) : (
        <View className="mb-28 flex-1 items-center justify-center">
          <Image
            source={NoData}
            className="h-[50%] w-full rounded-full"
            resizeMode="contain"
          />
        </View>
      )}
    </SafeAreaViewCustom>
  );
}
