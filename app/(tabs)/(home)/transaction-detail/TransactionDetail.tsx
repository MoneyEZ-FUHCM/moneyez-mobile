import Admin from "@/assets/images/logo/avatar_admin.jpg";
import {
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { ImageViewerComponent } from "@/components/ImageViewerComponent";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import useTransactionDetail from "./hooks/useTransactionDetail";
import TEXT_TRANSLATE_TRANSACTION_DETAIL from "./TransactionDetail.translate";

const PRIMARY_COLOR = "#609084";

const TransactionDetail = () => {
  const { handler, state } = useTransactionDetail();

  return (
    <SafeAreaViewCustom rootClassName="relative">
      <SectionComponent rootClassName="h-14 bg-white justify-center">
        <View className="flex-row items-center justify-between px-5">
          <Pressable onPress={() => router.back()}>
            <MaterialIcons name="close" size={24} color={PRIMARY_COLOR} />
          </Pressable>
          <Text className="text-lg font-bold text-primary">
            {TEXT_TRANSLATE_TRANSACTION_DETAIL.TITLE.TITLE_DETAIL}
          </Text>
          <SpaceComponent width={24}></SpaceComponent>
        </View>
      </SectionComponent>
      <SectionComponent rootClassName="mx-5 bg-white py-3 px-3 mt-5 rounded-[10px]">
        <View className="mb-5 flex-row space-x-3 rounded-xl border-[0.5px] border-gray-300 px-4 py-2.5">
          <View className="rounded-full bg-primary p-2">
            <MaterialIcons name={"person"} size={28} color="#ffffff" />
          </View>
          <View>
            <Text>Tiền điện</Text>
            <Text className="text-base font-bold text-red">- 400000</Text>
          </View>
        </View>
        <View className="gap-6">
          <View className="flex-row justify-between">
            <Text className="flex-1 font-medium text-text-gray">
              {TEXT_TRANSLATE_TRANSACTION_DETAIL.TITLE.TIME}
            </Text>
            <Text className="flex-1 text-right font-bold">
              12:00 - 01/01/2025
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="flex-1 font-medium text-text-gray">
              {TEXT_TRANSLATE_TRANSACTION_DETAIL.TITLE.TRANSACTION_CODE}
            </Text>
            <Text className="flex-1 text-right font-bold">
              40d4-951d-c0173ea743fe
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="flex-1 font-medium text-text-gray">
              {TEXT_TRANSLATE_TRANSACTION_DETAIL.TITLE.SUBCATEGORY}
            </Text>
            <View className="flex-1 flex-row items-center justify-end space-x-2">
              <MaterialIcons
                name="arrow-back"
                size={24}
                color={PRIMARY_COLOR}
              />
              <Text className="font-bold">Thời gian</Text>
            </View>
          </View>
          <View className="flex-row justify-between">
            <Text className="flex-1 font-medium text-text-gray">
              {TEXT_TRANSLATE_TRANSACTION_DETAIL.TITLE.PAYMENT_METHOD}
            </Text>
            <View className="flex-1 flex-row items-center justify-end space-x-2">
              <MaterialIcons
                name="arrow-back"
                size={24}
                color={PRIMARY_COLOR}
              />
              <Text className="font-bold">Tiền mặt</Text>
            </View>
          </View>
          <View className="space-y-2">
            <Text className="font-medium">
              {TEXT_TRANSLATE_TRANSACTION_DETAIL.TITLE.DESCRIPTION}
            </Text>
            <Text className="min-h-[72px] rounded-lg border border-gray-300 p-1.5 text-xs leading-[18px]">
              Tiền điện tháng 12/2024
            </Text>
          </View>
          <View className="space-y-2">
            <Text className="font-medium">
              {TEXT_TRANSLATE_TRANSACTION_DETAIL.TITLE.IMAGE_TRANSACTION}
            </Text>
            <Pressable
              onPress={handler.handleSetImageView}
              className="relative mx-1 mb-2 h-16 w-16 overflow-hidden rounded-lg"
            >
              <Image
                source={Admin}
                className="h-full w-full"
                resizeMode="cover"
              />
            </Pressable>
          </View>
        </View>
      </SectionComponent>
      <SectionComponent rootClassName=" px-5 rounded-lg absolute bottom-5 w-full flex-1">
        <Pressable
          onPress={() => {
            if (state.isFromPeriodHistory) {
              router.back();
            } else {
              router.replace(PATH_NAME.HOME.ADD_TRANSACTION as any);
            }
          }}
          className="h-12 items-center justify-center rounded-lg bg-primary"
        >
          <Text className="text-base font-semibold text-white">
            {state.isFromPeriodHistory
              ? `${TEXT_TRANSLATE_TRANSACTION_DETAIL.BUTTON.CLOSE}`
              : `${TEXT_TRANSLATE_TRANSACTION_DETAIL.BUTTON.ADD_NEW_TRANSACTION}`}
          </Text>
        </Pressable>
      </SectionComponent>
      <ImageViewerComponent images={state.images} />
    </SafeAreaViewCustom>
  );
};

export default TransactionDetail;
