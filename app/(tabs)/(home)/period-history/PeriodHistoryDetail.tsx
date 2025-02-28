import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FlatListCustom, SafeAreaViewCustom, SectionComponent } from '@/components';
import usePeriodHistoryDetail from './hooks/usePeriodHistoryDetail';
import { Transaction } from './hooks/usePeriodHistoryDetail';

export default function PeriodHistoryDetail() {
  const { state, handler } = usePeriodHistoryDetail();
  const [showFilters, setShowFilters] = useState(false);

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <View className="flex-row justify-between items-center py-4 border-b border-[#f0f0f0]">
      <View className="flex-row gap-3 items-center">
        <View className="w-12 h-12 rounded-full bg-[#f5f5f5] items-center justify-center">
          <MaterialIcons
            name={item.icon as any}
            size={24}
            color="#609084"
          />
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
        className={`text-base font-semibold ${item.type === 'income' ? 'text-[#00a010]' : 'text-[#cc0000]'
          }`}
      >
        {item.type === 'income' ? '+' : '-'}{handler.formatCurrency(item.amount)}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!state.isLoadingMore) return null;
    return (
      <View className="py-4 flex items-center justify-center">
        <ActivityIndicator size="small" color="#609084" />
      </View>
    );
  };

  // Moved search bar outside the FlatList
  const renderSearch = () => (
    <View className="bg-[#f5f5f5] rounded-full flex-row items-center px-4 py-2 mb-3">
      <MaterialIcons name="search" size={20} color="#929292" />
      <TextInput
        className="flex-1 ml-2 text-base"
        placeholder="Tìm kiếm giao dịch..."
        value={state.searchQuery}
        onChangeText={handler.handleSearch}
      />
      {state.searchQuery ? (
        <Pressable onPress={() => handler.handleSearch('')}>
          <MaterialIcons name="close" size={20} color="#929292" />
        </Pressable>
      ) : null}
    </View>
  );

  const renderFilters = () => (
    <View className="mb-4">
      <View className="flex-row justify-between items-center mb-2">
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
          {/* Type filter */}
          <View className="mb-3">
            <Text className="text-[#929292] mb-2">Loại giao dịch</Text>
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => handler.handleFilterByType('all')}
                className={`py-1 px-3 rounded-full ${state.filterType === 'all' ? 'bg-[#609084]' : 'bg-[#f0f0f0]'}`}
              >
                <Text className={state.filterType === 'all' ? 'text-white' : 'text-black'}>Tất cả</Text>
              </Pressable>
              <Pressable
                onPress={() => handler.handleFilterByType('income')}
                className={`py-1 px-3 rounded-full ${state.filterType === 'income' ? 'bg-[#00a010]' : 'bg-[#f0f0f0]'}`}
              >
                <Text className={state.filterType === 'income' ? 'text-white' : 'text-black'}>Thu nhập</Text>
              </Pressable>
              <Pressable
                onPress={() => handler.handleFilterByType('expense')}
                className={`py-1 px-3 rounded-full ${state.filterType === 'expense' ? 'bg-[#cc0000]' : 'bg-[#f0f0f0]'}`}
              >
                <Text className={state.filterType === 'expense' ? 'text-white' : 'text-black'}>Chi tiêu</Text>
              </Pressable>
            </View>
          </View>

          {/* Subcategory filter */}
          {state.subcategories.length > 0 && (
            <View className="mb-3">
              <Text className="text-[#929292] mb-2">Danh mục</Text>
              <View className="flex-row flex-wrap gap-2">
                <Pressable
                  onPress={() => handler.handleFilterBySubcategory(null)}
                  className={`py-1 px-3 rounded-full mb-2 ${!state.selectedSubcategory ? 'bg-[#609084]' : 'bg-[#f0f0f0]'}`}
                >
                  <Text className={!state.selectedSubcategory ? 'text-white' : 'text-black'}>Tất cả</Text>
                </Pressable>
                {state.subcategories.map(subcategory => (
                  <Pressable
                    key={subcategory.id}
                    onPress={() => handler.handleFilterBySubcategory(subcategory.id)}
                    className={`py-1 px-3 rounded-full mb-2 ${state.selectedSubcategory === subcategory.id ? 'bg-[#609084]' : 'bg-[#f0f0f0]'
                      }`}
                  >
                    <Text className={state.selectedSubcategory === subcategory.id ? 'text-white' : 'text-black'}>
                      {subcategory.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Reset filters button */}
          <Pressable
            onPress={handler.resetFilters}
            className="self-end py-1 px-3 bg-[#f0f0f0] rounded-full"
          >
            <Text className="text-[#609084]">Xóa bộ lọc</Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  const renderSummary = () => (
    <View className="bg-white p-4 rounded-lg mb-4">
      <View className="flex-row justify-between items-center">
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

  const renderEmptyList = () => (
    <View className="flex-1 items-center justify-center py-8">
      <MaterialIcons name="receipt-long" size={48} color="#cccccc" />
      <Text className="text-base text-[#929292] mt-2">
        {state.isLoading
          ? "Đang tải dữ liệu..."
          : state.error
            ? "Có lỗi xảy ra khi tải dữ liệu."
            : state.searchQuery || state.filterType !== 'all' || state.selectedSubcategory
              ? "Không tìm thấy giao dịch nào phù hợp."
              : "Không có giao dịch nào trong kỳ này."}
      </Text>
    </View>
  );

  // Removed the search bar from the list header
  const renderListHeader = () => (
    <View>
      {renderSummary()}
      {renderFilters()}
      <Text className="text-lg font-semibold text-[#609084] mb-2">
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
              {state.modelDetails.period}
            </Text>
            <View style={{ width: 24 }} />
          </View>
        </SectionComponent>

        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#609084" />
          <Text className="mt-2 text-[#609084]">Đang tải dữ liệu giao dịch...</Text>
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
            {state.modelDetails.period}
          </Text>
          <View style={{ width: 24 }} />
        </View>
      </SectionComponent>

      {/* SEARCH BAR MOVED OUTSIDE THE FLATLIST */}
      <View className="mx-4 mt-2">
        {renderSearch()}
      </View>

      {/* TRANSACTION LIST */}
      <SectionComponent rootClassName="flex-1 mx-4 my-4 p-4 bg-white rounded-lg">
        <FlatListCustom
          data={state.transactions}
          renderItem={renderTransactionItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderListHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyList}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 24
          }}
          onRefresh={handler.refetchData}
          refreshing={state.isLoading && !state.isLoadingMore}
          onEndReached={handler.loadMoreData}
          onEndReachedThreshold={0.5}
        />
      </SectionComponent>
    </SafeAreaViewCustom>
  );
}
