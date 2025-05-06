import NoImages from "@/assets/images/no-images.png";
import {
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { ImageViewerComponent } from "@/components/ImageViewerComponent";
import { Colors } from "@/helpers/constants/color";
import { TRANSACTION_TYPE } from "@/helpers/enums/globals";
import { formatCurrency, formatDate, formatDateTime } from "@/helpers/libs";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import TEXT_TRANSLATE_TRANSACTION_DETAIL from "./TransactionDetail.translate";
import useTransactionDetail from "./hooks/useTransactionDetail";

const TransactionDetail = () => {
  const { state, handler } = useTransactionDetail();

  return (
    <SafeAreaViewCustom rootClassName="relative">
      <SectionComponent rootClassName="h-14 bg-white justify-center">
        <View className="flex-row items-center justify-between px-5">
          <Pressable onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} />
          </Pressable>
          <Text className="text-lg font-bold">
            {TEXT_TRANSLATE_TRANSACTION_DETAIL.TITLE.TITLE_DETAIL}
          </Text>
          <SpaceComponent width={24}></SpaceComponent>
        </View>
      </SectionComponent>
      <>
        <SectionComponent rootClassName="mx-5 bg-white py-3 px-3 mt-5 rounded-[10px]">
          <View className="mb-5 flex-row space-x-3 rounded-xl border-[0.5px] border-gray-300 px-4 py-2.5">
            <View className="rounded-full bg-superlight p-2">
              <MaterialIcons
                name={state.transactionData?.subCategoryIcon as any}
                size={28}
                color={Colors.colors.primary}
              />
            </View>
            <View>
              <Text className="font-semibold">
                {state.transactionData?.description}
              </Text>
              <Text
                className={`text-base font-bold ${state.transactionData?.type === TRANSACTION_TYPE.INCOME ? "text-green" : "text-red"}`}
              >
                {formatCurrency(state.transactionData?.amount ?? 0)}
              </Text>
            </View>
          </View>
          <View className="gap-5">
            <View className="flex-row items-center justify-between">
              <Text className="flex-1 font-medium text-text-gray">
                {TEXT_TRANSLATE_TRANSACTION_DETAIL.TITLE.TIME}
              </Text>
              <Text className="flex-1 text-right font-bold">
                {formatDateTime(state.transactionData?.transactionDate)} -{" "}
                {formatDate(state.transactionData?.transactionDate)}
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="flex-1 font-medium text-text-gray">
                {TEXT_TRANSLATE_TRANSACTION_DETAIL.TITLE.SUBCATEGORY}
              </Text>
              <View className="flex-1 flex-row items-center justify-end space-x-2">
                <View className="rounded-full bg-superlight p-2">
                  <MaterialIcons
                    name={state.transactionData?.subCategoryIcon as any}
                    size={24}
                    color={Colors.colors.primary}
                  />
                </View>
                <Text className="font-bold">
                  {state.transactionData?.subCategoryName}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="flex-1 font-medium text-text-gray">
                {TEXT_TRANSLATE_TRANSACTION_DETAIL.TITLE.PAYMENT_METHOD}
              </Text>
              <View className="flex-1 flex-row items-center justify-end space-x-2">
                <Text className="font-bold">Tiền mặt</Text>
              </View>
            </View>
            <View className="space-y-2">
              <Text className="font-medium text-text-gray">
                {TEXT_TRANSLATE_TRANSACTION_DETAIL.TITLE.DESCRIPTION}
              </Text>
              <Text className="min-h-[72px] rounded-lg border border-gray-300 p-1.5 text-xs leading-[18px]">
                {state.transactionData?.description}
              </Text>
            </View>
            {(state.transactionData?.images ?? []).length > 0 ? (
              <View className="space-y-2">
                <Text className="font-medium text-text-gray">
                  {TEXT_TRANSLATE_TRANSACTION_DETAIL.TITLE.IMAGE_TRANSACTION}
                </Text>
                <View className="flex-row flex-wrap">
                  {state.transactionData?.images?.map(
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
                  {TEXT_TRANSLATE_TRANSACTION_DETAIL.TITLE.IMAGE_TRANSACTION}
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
        {state.transactionData?.images && (
          <ImageViewerComponent images={state.transactionData.images as []} />
        )}
      </>
      <SectionComponent rootClassName=" px-5 rounded-lg absolute bottom-5 w-full flex-1">
        <TouchableOpacity
          onPress={handler.handleCreateTransaction}
          className="h-12 items-center justify-center rounded-lg bg-primary"
        >
          <Text className="text-base font-semibold text-white">
            {TEXT_TRANSLATE_TRANSACTION_DETAIL.BUTTON.CONFRIM}
          </Text>
        </TouchableOpacity>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
};

export default TransactionDetail;
