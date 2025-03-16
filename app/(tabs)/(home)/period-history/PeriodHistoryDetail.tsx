import NoData from "@/assets/images/not-found-result.png";
import {
  FlatListCustom,
  LoadingSectionWrapper,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { TRANSACTION_TYPE } from "@/enums/globals";
import { TransactionViewModelDetail } from "@/types/transaction.types";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import usePeriodHistoryDetail from "./hooks/usePeriodHistoryDetail";
import TEXT_TRANSLATE_PERIOD_HISTORY from "./PeriodHistory.translate";

export default function PeriodHistoryDetail() {
  const { state, handler } = usePeriodHistoryDetail();
  const PRIMARY_COLOR = "#609084";

  const renderTransactionItem = ({
    item,
  }: {
    item: TransactionViewModelDetail;
  }) => {
    return (
      <View className="flex-row items-center justify-between border-b border-[#f0f0f0] py-3">
        <View className="flex-1 flex-row items-center gap-1.5">
          <View className="h-12 w-12 items-center justify-center rounded-full">
            <MaterialIcons name={item?.icon as any} size={30} color="#609084" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-medium text-black">
              {item?.subcategory
                ? item.subcategory.charAt(0).toUpperCase() +
                  item.subcategory.slice(1)
                : ""}
            </Text>
            <View className="flex-row">
              <Text className="mr-3 text-sm text-[#929292]">{item?.date}</Text>
              <Text className="text-sm text-[#929292]">• {item?.time}</Text>
            </View>
          </View>
        </View>
        <Text
          className={`text-base font-semibold ${item?.type === "income" ? "text-[#00a010]" : "text-[#cc0000]"}`}
        >
          {item?.type === "income" ? "+" : "-"}{" "}
          {handler.formatCurrency(item?.amount)}
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!state.isLoadingMore) return null;
    return (
      <View className="flex items-center justify-center py-4">
        <ActivityIndicator size="small" color="#609084" />
      </View>
    );
  };

  const renderFilters = () => (
    <View className="mb-2 px-2">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="font-medium text-black">
          {TEXT_TRANSLATE_PERIOD_HISTORY.BUTTON.FILTER}
        </Text>
        <Pressable onPress={() => handler.setShowFilters(!state.showFilters)}>
          <MaterialIcons
            name={state.showFilters ? "expand-less" : "expand-more"}
            size={24}
            color={PRIMARY_COLOR}
          />
        </Pressable>
      </View>
      {state.showFilters && (
        <View>
          {/* Type Filter */}
          <View className="mb-3">
            <Text className="mb-2 text-[#929292]">
              {TEXT_TRANSLATE_PERIOD_HISTORY.TITLE.TYPE_TRANSACTION}
            </Text>
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => handler.handleFilterPress("")}
                className={`rounded-full px-3 py-1 ${state.filterType === "" ? "bg-primary" : "bg-[#f0f0f0]"}`}
              >
                <Text
                  className={
                    state.filterType === "" ? "text-white" : "text-black"
                  }
                >
                  {TEXT_TRANSLATE_PERIOD_HISTORY.BUTTON.ALL}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handler.handleFilterPress(0)}
                className={`rounded-full px-3 py-1 ${state.filterType === TRANSACTION_TYPE.INCOME ? "bg-primary" : "bg-[#f0f0f0]"}`}
              >
                <Text
                  className={
                    state.filterType === TRANSACTION_TYPE.INCOME
                      ? "text-white"
                      : "text-black"
                  }
                >
                  {TEXT_TRANSLATE_PERIOD_HISTORY.BUTTON.INCOME}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handler.handleFilterPress(1)}
                className={`rounded-full px-3 py-1 ${state.filterType === TRANSACTION_TYPE.EXPENSE ? "bg-primary" : "bg-[#f0f0f0]"}`}
              >
                <Text
                  className={
                    state.filterType === TRANSACTION_TYPE.EXPENSE
                      ? "text-white"
                      : "text-black"
                  }
                >
                  {TEXT_TRANSLATE_PERIOD_HISTORY.BUTTON.EXPENSE}
                </Text>
              </Pressable>
            </View>
          </View>
          {/* Subcategory Filter */}
          {state.subcategories.length > 0 && (
            <View className="mb-3">
              <Text className="mb-2 text-[#929292]">
                {TEXT_TRANSLATE_PERIOD_HISTORY.TITLE.CATEGORY}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                <Pressable
                  onPress={() => handler.handleFilterBySubcategory(null)}
                  className={`mb-2 rounded-full px-3 py-1 ${!state.selectedSubcategory ? "bg-[#609084]" : "bg-[#f0f0f0]"}`}
                >
                  <Text
                    className={
                      !state.selectedSubcategory ? "text-white" : "text-black"
                    }
                  >
                    {TEXT_TRANSLATE_PERIOD_HISTORY.BUTTON.ALL}
                  </Text>
                </Pressable>
                {state.subcategories.map((subcategory) => (
                  <Pressable
                    key={subcategory?.id}
                    onPress={() =>
                      handler.handleFilterBySubcategory(subcategory?.id)
                    }
                    className={`mb-2 rounded-full px-3 py-1 ${state.selectedSubcategory === subcategory?.id ? "bg-[#609084]" : "bg-[#f0f0f0]"}`}
                  >
                    <Text
                      className={
                        state.selectedSubcategory === subcategory?.id
                          ? "text-white"
                          : "text-black"
                      }
                    >
                      {subcategory.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
          <Pressable
            onPress={handler.handleResetFilter}
            className="self-end rounded-full bg-[#f0f0f0] px-3 py-1"
          >
            <Text className="text-[#609084]">
              {TEXT_TRANSLATE_PERIOD_HISTORY.BUTTON.CLEAR_FILTER}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  const renderSummary = () => (
    <View className="my-2 w-full rounded-lg bg-white px-2 py-3 shadow-sm">
      <View className="flex-row items-center justify-between gap-4">
        <View className="flex-1 rounded-xl border border-[#e6ffe9] bg-[#f8fff9] p-3">
          <Text className="mb-1 text-sm font-medium text-[#929292]">
            {TEXT_TRANSLATE_PERIOD_HISTORY.TITLE.TOTAL_INCOME}
          </Text>
          <Text className="text-lg font-bold text-[#00a010]">
            {state.modelDetails?.income !== 0
              ? `+ ${handler.formatCurrency(state.modelDetails.income)}`
              : handler.formatCurrency(state.modelDetails.income)}
          </Text>
        </View>
        <View className="flex-1 rounded-xl border border-[#ffe6e6] bg-[#fff8f8] p-3">
          <Text className="mb-1 text-sm font-medium text-[#929292]">
            {TEXT_TRANSLATE_PERIOD_HISTORY.TITLE.TOTAL_EXPENSE}
          </Text>
          <Text className="text-lg font-bold text-[#cc0000]">
            {state.modelDetails?.expense !== 0
              ? `- ${handler.formatCurrency(state.modelDetails?.expense)}`
              : handler.formatCurrency(state.modelDetails?.expense)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyList = () => (
    <View className="mt-10 flex-1 items-center justify-start">
      <Image
        source={NoData}
        className="h-[270px] w-[700px]"
        resizeMode="contain"
      />
    </View>
  );

  if (state.isLoading) {
    return (
      <SafeAreaViewCustom rootClassName="flex-1 bg-[#fafafa]">
        <SectionComponent rootClassName="h-24 bg-white justify-center">
          <View className="flex-row items-center justify-between px-4">
            <Pressable onPress={handler.handleBack}>
              <MaterialIcons name="arrow-back" size={24} color="black" />
            </Pressable>
            <Text className="text-xl font-semibold text-black">
              {state.modelDetails.startDate} - {state.modelDetails.endDate}
            </Text>
            <SpaceComponent width={24} />
          </View>
        </SectionComponent>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#609084" />
          <Text className="mt-2 text-[#609084]">
            {TEXT_TRANSLATE_PERIOD_HISTORY.TITLE.LOADING_DATA}
          </Text>
        </View>
      </SafeAreaViewCustom>
    );
  }

  return (
    <SafeAreaViewCustom rootClassName="bg-[#fafafa]">
      <SectionComponent rootClassName="relative bg-white shadow-md h-14 flex-row items-center justify-center">
        <TouchableOpacity
          onPress={handler.handleBack}
          className="absolute left-3 rounded-full p-2"
        >
          <AntDesign name="close" size={24} color={PRIMARY_COLOR} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-primary">
          {state.modelDetails?.startDate} - {state.modelDetails?.endDate}
        </Text>
        <TouchableOpacity
          onPress={handler.handleRefetchData}
          className="absolute right-3 rounded-full p-2"
        >
          <AntDesign name="reload1" size={24} color={PRIMARY_COLOR} />
        </TouchableOpacity>
      </SectionComponent>
      <LoadingSectionWrapper isLoading={state.isRefetching}>
        <View className="px-5">
          <View className="my-4 rounded-lg bg-white">
            {renderSummary()}
            {renderFilters()}
          </View>
          <Text className="text-lg font-semibold text-[#609084]">
            Danh sách giao dịch ({state.totalCount})
          </Text>
        </View>
        <SectionComponent
          rootClassName={`mx-4 ${state.isFiltering ? "h-[55%]" : ""} py-4 p-4 bg-white rounded-lg`}
        >
          <LoadingSectionWrapper isLoading={state.isFiltering}>
            <FlatListCustom
              isBottomTab={true}
              data={state.transactions ?? []}
              renderItem={renderTransactionItem}
              keyExtractor={(item) => item.id.toString()}
              hasMore={state.transactionsData?.items?.length === state.pageSize}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={renderFooter}
              contentContainerStyle={{
                paddingBottom: state.showFilters ? 680 : 500,
              }}
              onLoadMore={handler.loadMoreData}
              isLoading={state.isLoadingMore}
              ListEmptyComponent={renderEmptyList}
            />
          </LoadingSectionWrapper>
        </SectionComponent>
      </LoadingSectionWrapper>
    </SafeAreaViewCustom>
  );
}
