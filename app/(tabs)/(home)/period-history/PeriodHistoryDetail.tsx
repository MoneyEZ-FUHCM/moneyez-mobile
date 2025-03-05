import {
  FlatListCustom,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import usePeriodHistoryDetail, {
  Transaction,
} from "./hooks/usePeriodHistoryDetail";

export default function PeriodHistoryDetail() {
  const { state, handler } = usePeriodHistoryDetail();
  const [showFilters, setShowFilters] = useState(false);

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <View className="flex-row items-center justify-between border-b border-[#f0f0f0] py-4">
      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-[#f5f5f5]">
          <MaterialIcons name={item.icon as any} size={24} color="#609084" />
        </View>
        <View className="gap-1">
          <Text className="text-base font-medium text-black">
            {item.subcategory}
          </Text>
          <View className="flex-row gap-3">
            <Text className="text-xs text-[#929292]">{item.date}</Text>
            <Text className="text-xs text-[#929292]">{item.time}</Text>
          </View>
        </View>
      </View>
      <Text
        className={`text-base font-semibold ${item.type === "income" ? "text-[#00a010]" : "text-[#cc0000]"}`}
      >
        {item.type === "income" ? "+" : "-"}
        {handler.formatCurrency(item.amount)}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!state.isLoadingMore) return null;
    return (
      <View className="flex items-center justify-center py-4">
        <ActivityIndicator size="small" color="#609084" />
      </View>
    );
  };

  const renderSearch = () => (
    <View className="mb-3 flex-row items-center rounded-full bg-[#f5f5f5] px-4 py-2">
      <MaterialIcons name="search" size={20} color="#929292" />
      <TextInput
        className="ml-2 flex-1 text-base"
        placeholder="Tìm kiếm giao dịch..."
        value={state.searchQuery}
        onChangeText={handler.handleSearch}
      />
      {state.searchQuery ? (
        <Pressable onPress={() => handler.handleSearch("")}>
          <MaterialIcons name="close" size={20} color="#929292" />
        </Pressable>
      ) : null}
    </View>
  );

  const renderFilters = () => (
    <View className="mb-4">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="font-medium text-black">Lọc theo</Text>
        <Pressable onPress={() => setShowFilters(!showFilters)}>
          <MaterialIcons
            name={showFilters ? "expand-less" : "expand-more"}
            size={24}
            color="#609084"
          />
        </Pressable>
      </View>
      {showFilters && (
        <View>
          {/* Type Filter */}
          <View className="mb-3">
            <Text className="mb-2 text-[#929292]">Loại giao dịch</Text>
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => handler.handleFilterByType("all")}
                className={`rounded-full px-3 py-1 ${state.filterType === "all" ? "bg-[#609084]" : "bg-[#f0f0f0]"}`}
              >
                <Text
                  className={
                    state.filterType === "all" ? "text-white" : "text-black"
                  }
                >
                  Tất cả
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handler.handleFilterByType("income")}
                className={`rounded-full px-3 py-1 ${state.filterType === "income" ? "bg-[#00a010]" : "bg-[#f0f0f0]"}`}
              >
                <Text
                  className={
                    state.filterType === "income" ? "text-white" : "text-black"
                  }
                >
                  Thu nhập
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handler.handleFilterByType("expense")}
                className={`rounded-full px-3 py-1 ${state.filterType === "expense" ? "bg-[#cc0000]" : "bg-[#f0f0f0]"}`}
              >
                <Text
                  className={
                    state.filterType === "expense" ? "text-white" : "text-black"
                  }
                >
                  Chi tiêu
                </Text>
              </Pressable>
            </View>
          </View>
          {/* Subcategory Filter */}
          {state.subcategories.length > 0 && (
            <View className="mb-3">
              <Text className="mb-2 text-[#929292]">Danh mục</Text>
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
                    Tất cả
                  </Text>
                </Pressable>
                {state.subcategories.map((subcategory) => (
                  <Pressable
                    key={subcategory.id}
                    onPress={() =>
                      handler.handleFilterBySubcategory(subcategory.id)
                    }
                    className={`mb-2 rounded-full px-3 py-1 ${state.selectedSubcategory === subcategory.id ? "bg-[#609084]" : "bg-[#f0f0f0]"}`}
                  >
                    <Text
                      className={
                        state.selectedSubcategory === subcategory.id
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
            onPress={handler.resetFilters}
            className="self-end rounded-full bg-[#f0f0f0] px-3 py-1"
          >
            <Text className="text-[#609084]">Xóa bộ lọc</Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  const renderSummary = () => (
    <View className="mb-4 rounded-lg bg-white p-4">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-sm text-[#929292]">Tổng thu</Text>
          <Text className="text-base font-semibold text-[#00a010]">
            +{handler.formatCurrency(state.modelDetails.income)}
          </Text>
        </View>
        <View>
          <Text className="text-sm text-[#929292]">Tổng chi</Text>
          <Text className="text-base font-semibold text-[#cc0000]">
            -{handler.formatCurrency(state.modelDetails.expense)}
          </Text>
        </View>
        <View>
          <Text className="text-sm text-[#929292]">Số dư</Text>
          <Text className="text-base font-semibold text-[#609084]">
            {handler.formatCurrency(state.modelDetails.balance)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderListHeader = () => (
    <View>
      {renderSummary()}
      {renderFilters()}
      <Text className="mb-2 text-lg font-semibold text-[#609084]">
        {state.totalCount > 0
          ? `${state.totalCount} giao dịch`
          : "Danh sách giao dịch"}
      </Text>
    </View>
  );

  if (state.isLoading && state.transactions.length === 0) {
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
            <View style={{ width: 24 }} />
          </View>
        </SectionComponent>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#609084" />
          <Text className="mt-2 text-[#609084]">
            Đang tải dữ liệu giao dịch...
          </Text>
        </View>
      </SafeAreaViewCustom>
    );
  }

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-[#fafafa]">
      {/* HEADER */}
      <SectionComponent rootClassName="h-14 bg-white justify-center">
        <View className="flex-row items-center justify-between px-5">
          <Pressable onPress={handler.handleBack}>
            <MaterialIcons name="arrow-back" size={24} color="#609084" />
          </Pressable>
          <Text className="text-lg font-bold text-primary">
            {state.modelDetails.startDate} - {state.modelDetails.endDate}
          </Text>
          <View style={{ width: 24 }} />
        </View>
      </SectionComponent>
      {/* SEARCH BAR */}
      <View className="mx-4 mt-2">{renderSearch()}</View>
      {/* TRANSACTION LIST */}
      <SectionComponent rootClassName="flex-1 mx-4 my-4 p-4 bg-white rounded-lg">
        <FlatListCustom
          data={state.transactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderListHeader}
          ListFooterComponent={renderFooter}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 24 }}
          onRefresh={handler.refetchData}
          refreshing={state.isLoading && !state.isLoadingMore}
          onLoadMore={handler.loadMoreData}
          isLoading={state.isLoadingMore}
        />
      </SectionComponent>
    </SafeAreaViewCustom>
  );
}
