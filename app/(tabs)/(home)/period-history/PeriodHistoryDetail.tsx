import NoImages from "@/assets/images/no-images.png";
import {
  FlatListCustom,
  ImageViewerComponent,
  LoadingSectionWrapper,
  ModalLizeComponent,
  SafeAreaViewCustom,
  SectionComponent,
  SkeletonLoaderComponent,
} from "@/components";
import { Colors } from "@/helpers/constants/color";
import {
  TRANSACTION_TYPE,
  TRANSACTION_TYPE_TEXT,
} from "@/helpers/enums/globals";
import { formatCurrency, formatDate, formatDateTime } from "@/helpers/libs";
import { TransactionViewModelDetail } from "@/helpers/types/transaction.types";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import usePeriodHistoryDetail from "./hooks/usePeriodHistoryDetail";
import TEXT_TRANSLATE_PERIOD_HISTORY from "./PeriodHistory.translate";

export default function PeriodHistoryDetail() {
  const { state, handler } = usePeriodHistoryDetail();

  const renderTransactionItem = ({
    item,
  }: {
    item: TransactionViewModelDetail;
  }) => {
    const renderRightActions = () => {
      return (
        <View className="flex h-full w-20 items-center justify-center rounded-r-2xl bg-red">
          <MaterialIcons name="delete" size={24} color="white" />
        </View>
      );
    };

    const handleSwipeOpen = () => {
      state.swipeRef?.current?.close();
      handler.handleOpenModalRemoveTransaction(item.id);
    };

    const transactionDetail = (
      <View className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <TouchableOpacity
          onPress={() => handler.handleNavigateTransactionDetail(item.id)}
          className="flex-row items-center justify-between border-b border-[#f0f0f0] py-3"
        >
          <View className="flex-1 flex-row items-center gap-1.5">
            <View className="h-12 w-12 items-center justify-center rounded-full">
              <MaterialIcons
                name={item?.icon as any}
                size={30}
                color={Colors.colors.primary}
              />
            </View>
            <View className="mr-3 flex-1">
              <Text
                className="text-ellipsis text-base font-medium text-black"
                numberOfLines={1}
              >
                {item?.subcategory
                  ? item.subcategory.charAt(0).toUpperCase() +
                    item.subcategory.slice(1)
                  : ""}
              </Text>
              <View className="flex-row">
                <Text className="mr-3 text-sm text-[#929292]">
                  {item?.date}
                </Text>
                <Text className="text-sm text-[#929292]">• {item?.time}</Text>
              </View>
            </View>
          </View>
          <Text
            className={`text-base font-semibold ${item?.type === "income" ? "text-green" : "text-red"}`}
          >
            {item?.type === "income" ? "+" : "-"}
            {handler.formatCurrency(item?.amount)}
          </Text>
        </TouchableOpacity>
      </View>
    );

    return (
      <View>
        {state.activeTab !== "unavailable" ? (
          <Swipeable
            ref={state.swipeRef}
            renderRightActions={renderRightActions}
            rightThreshold={40}
            onSwipeableOpen={handleSwipeOpen}
            overshootRight={false}
          >
            {transactionDetail}
          </Swipeable>
        ) : (
          transactionDetail
        )}
      </View>
    );
  };

  const renderGroupSkeleton = () => (
    <View className="mx-5 mt-5 rounded-[10px] bg-white px-3 py-3">
      <View className="mb-5 flex-row space-x-3 rounded-xl border-[0.5px] border-gray-300 px-4 py-2.5">
        <View className="h-10 w-10 rounded-full bg-gray-300" />
        <View className="flex-1">
          <View className="h-4 w-3/4 rounded bg-gray-300" />
          <View className="mt-2 h-4 w-1/2 rounded bg-gray-300" />
        </View>
      </View>
      <View className="gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <View key={index} className="flex-row items-center justify-between">
            <View className="h-4 w-1/3 rounded bg-gray-300" />
            <View className="h-4 w-1/2 rounded bg-gray-300" />
          </View>
        ))}
      </View>
      <View className="my-6">
        <View className="h-20 w-full rounded bg-gray-300" />
      </View>
      <View className="">
        <View className="mb-3 h-4 w-1/3 rounded bg-gray-300" />
        <View className="h-16 w-16 rounded bg-gray-300" />
      </View>
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
            color={Colors.colors.primary}
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
              ? `+${handler.formatCurrency(state.modelDetails.income)}`
              : handler.formatCurrency(state.modelDetails.income)}
          </Text>
        </View>
        <View className="flex-1 rounded-xl border border-[#ffe6e6] bg-[#fff8f8] p-3">
          <Text className="mb-1 text-sm font-medium text-[#929292]">
            {TEXT_TRANSLATE_PERIOD_HISTORY.TITLE.TOTAL_EXPENSE}
          </Text>
          <Text className="text-lg font-bold text-[#cc0000]">
            {state.modelDetails?.expense !== 0
              ? `-${handler.formatCurrency(state.modelDetails?.expense)}`
              : handler.formatCurrency(state.modelDetails?.expense)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyList = () => (
    <View className="mt-20 items-center justify-center p-6">
      <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-100">
        <Feather name="credit-card" size={32} color="#609084" />
      </View>
      <Text className="text-center text-lg text-gray-500">
        {TEXT_TRANSLATE_PERIOD_HISTORY.TITLE.NO_DATA}
      </Text>
    </View>
  );

  return (
    <GestureHandlerRootView>
      <SafeAreaViewCustom rootClassName="bg-[#fafafa]">
        {state.isLoading ? (
          <>
            <SectionComponent rootClassName="relative bg-white shadow-md h-14 flex-row items-center justify-center">
              <TouchableOpacity
                onPress={handler.handleBack}
                className="absolute left-4 rounded-full bg-gray-50 p-2"
              >
                <MaterialIcons name="arrow-back" size={24} />
              </TouchableOpacity>
              <Text className="text-center text-lg font-bold">
                {state.modelDetails?.startDate} - {state.modelDetails?.endDate}
              </Text>
            </SectionComponent>
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#609084" />
              <Text className="mt-2 text-[#609084]">
                {TEXT_TRANSLATE_PERIOD_HISTORY.TITLE.LOADING_DATA}
              </Text>
            </View>
          </>
        ) : (
          <>
            <SectionComponent rootClassName="relative bg-white shadow-md h-14 flex-row items-center justify-center">
              <TouchableOpacity
                onPress={handler.handleBack}
                className="absolute left-4 rounded-full bg-gray-50 p-2"
              >
                <MaterialIcons name="arrow-back" size={24} />
              </TouchableOpacity>
              <Text className="text-center text-lg font-bold">
                {state.modelDetails?.startDate} - {state.modelDetails?.endDate}
              </Text>
            </SectionComponent>
            <LoadingSectionWrapper isLoading={state.isRefetching}>
              <View className="px-5">
                <View className="my-4 rounded-lg bg-white">
                  {renderSummary()}
                  {renderFilters()}
                </View>
                <Text className="text-lg font-semibold text-primary">
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
                    hasMore={
                      state.transactionsData?.items?.length === state.pageSize
                    }
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={renderFooter}
                    contentContainerStyle={{
                      paddingBottom: state.showFilters ? 680 : 500,
                    }}
                    onLoadMore={handler.loadMoreData}
                    isLoading={state.isLoadingMore}
                    ListEmptyComponent={renderEmptyList}
                    refreshing={state.isRefetching}
                    onRefresh={handler.handleRefetchData}
                  />
                </LoadingSectionWrapper>
              </SectionComponent>
            </LoadingSectionWrapper>
          </>
        )}
        <ModalLizeComponent
          ref={state.modalizeRef}
          modalStyle={{
            minHeight: 530,
          }}
        >
          {state.isLoadingTransactionDetail ? (
            <SkeletonLoaderComponent>
              {renderGroupSkeleton()}
            </SkeletonLoaderComponent>
          ) : (
            <>
              <SectionComponent rootClassName="mx-5 bg-white py-3 px-2 mt-5 rounded-[10px]">
                <View className="mb-5 flex-row space-x-3 rounded-xl border-[0.5px] border-gray-300 px-4 py-2.5">
                  <View className="rounded-full bg-superlight p-2">
                    <MaterialIcons
                      name={state.transactionDetail?.subcategoryIcon}
                      size={28}
                      color={Colors.colors.primary}
                    />
                  </View>
                  <View>
                    <Text className="font-semibold">
                      {state.transactionDetail?.description}
                    </Text>
                    {state.transactionDetail?.type ===
                    TRANSACTION_TYPE_TEXT.EXPENSE ? (
                      <Text className="text-base font-bold text-red">
                        -{formatCurrency(state.transactionDetail?.amount)}
                      </Text>
                    ) : (
                      <Text className="text-base font-bold text-green">
                        +{formatCurrency(state.transactionDetail?.amount)}
                      </Text>
                    )}
                  </View>
                </View>
                <View className="gap-5">
                  <View className="flex-row items-center justify-between">
                    <Text className="flex-1 font-medium text-text-gray">
                      {TEXT_TRANSLATE_PERIOD_HISTORY.TITLE.TIME}
                    </Text>
                    <Text className="flex-1 text-right font-bold">
                      {formatDateTime(state.transactionDetail?.transactionDate)}{" "}
                      - {formatDate(state.transactionDetail?.transactionDate)}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="flex-1 font-medium text-text-gray">
                      {TEXT_TRANSLATE_PERIOD_HISTORY.TITLE.SUBCATEGORY}
                    </Text>
                    <View className="flex-1 flex-row items-center justify-end space-x-2">
                      <View className="rounded-full bg-superlight p-2">
                        <MaterialIcons
                          name={state.transactionDetail?.subcategoryIcon}
                          size={24}
                          color={Colors.colors.primary}
                        />
                      </View>
                      <Text className="font-bold">
                        {state.transactionDetail?.subcategoryName}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="flex-1 font-medium text-text-gray">
                      {TEXT_TRANSLATE_PERIOD_HISTORY.TITLE.PAYMENT_METHOD}
                    </Text>
                    <View className="flex-1 flex-row items-center justify-end space-x-2">
                      <MaterialIcons
                        name={state.transactionDetail?.icon}
                        size={24}
                        color={Colors.colors.primary}
                      />
                      <Text className="font-bold">Tiền mặt</Text>
                    </View>
                  </View>
                  <View className="space-y-2">
                    <Text className="font-medium text-text-gray">
                      {TEXT_TRANSLATE_PERIOD_HISTORY.TITLE.DESCRIPTION}
                    </Text>
                    <Text className="min-h-[72px] rounded-lg border border-gray-300 p-1.5 text-xs leading-[18px]">
                      {state.transactionDetail?.description}
                    </Text>
                  </View>
                  {state.transactionDetail?.images?.length > 0 ? (
                    <View className="space-y-2">
                      <Text className="font-medium text-text-gray">
                        {TEXT_TRANSLATE_PERIOD_HISTORY.TITLE.IMAGE_TRANSACTION}
                      </Text>
                      <View className="flex-row flex-wrap">
                        {state.transactionDetail.images.map(
                          (image: string, index: number) => (
                            <Pressable
                              key={index}
                              onPress={handler.handleSetImageView}
                              className="relative mx-1 mb-2 h-16 w-16 overflow-hidden rounded-lg"
                            >
                              <Image
                                source={{ uri: image }}
                                className="h-full w-full"
                                resizeMode="cover"
                              />
                            </Pressable>
                          ),
                        )}
                      </View>
                    </View>
                  ) : (
                    <View className="space-y-2">
                      <Text className="font-medium text-text-gray">
                        {TEXT_TRANSLATE_PERIOD_HISTORY.TITLE.IMAGE_TRANSACTION}
                      </Text>
                      <Pressable className="relative mx-1 mb-2 h-16 w-16 overflow-hidden rounded-lg">
                        <Image
                          source={NoImages}
                          className="h-full w-full"
                          resizeMode="contain"
                        />
                      </Pressable>
                    </View>
                  )}
                </View>
              </SectionComponent>
              <ImageViewerComponent images={state.transactionDetail?.images} />
            </>
          )}
        </ModalLizeComponent>
        <ModalLizeComponent ref={state.deleteModalizeRef}>
          <View className="p-6">
            <Text className="mb-4 text-center text-lg font-bold text-gray-900">
              Xác nhận xóa giao dịch này
            </Text>
            <Text className="mb-6 text-center text-gray-600">
              Bạn có chắc chắn muốn xóa giao dịch{" "}
              <Text className="font-bold text-primary">
                {state.transactionDetail?.subcategoryName}
              </Text>{" "}
              ?
            </Text>
            <View className="flex-row gap-4">
              <TouchableOpacity
                className="flex-1 rounded-lg border border-gray-200 py-3"
                onPress={() => state.deleteModalizeRef?.current?.close()}
              >
                <Text className="text-center font-medium text-gray-700">
                  Hủy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 rounded-lg bg-red py-3"
                onPress={() =>
                  handler.handleDeleteTransaction(state.transactionDetail?.id)
                }
              >
                <Text className="text-center font-medium text-white">Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ModalLizeComponent>
      </SafeAreaViewCustom>
    </GestureHandlerRootView>
  );
}
