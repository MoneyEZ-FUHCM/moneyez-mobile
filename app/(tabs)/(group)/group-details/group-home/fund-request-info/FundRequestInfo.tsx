import {
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { formatCurrency, formatDate } from "@/helpers/libs";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import TEXT_TRANSLATE_FUND_REQUEST_INFO from "./FundRequestInfo.translate";
import useFundRequestInfo from "./hooks/useFundRequestInfo";

export default function FundRequestInfoPage() {
  const { state, handler } = useFundRequestInfo();
  const { TITLE, MESSAGE, LABELS, BUTTON } = TEXT_TRANSLATE_FUND_REQUEST_INFO;

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-[#f9f9f9]">
      {/* Header */}
      <SectionComponent rootClassName="h-14 bg-white justify-center">
        <View className="flex-row items-center justify-between px-5">
          <TouchableOpacity
          // onPress={() => {
          // }}
          >
            <MaterialIcons name="arrow-back" size={24} />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-black">
            {TITLE.MAIN_TITLE}
          </Text>
          <SpaceComponent width={24} />
        </View>
      </SectionComponent>

      {/* Content */}
      <SectionComponent rootClassName="mx-5 mt-8 rounded-[10px] bg-white p-4 shadow-sm">
        <Text className="text-sm text-gray-600">{MESSAGE.SUCCESS}</Text>
      </SectionComponent>

      <SectionComponent rootClassName="mx-5 mt-4 rounded-[10px] bg-white p-4 shadow-sm">
        <Text className="mb-3 text-base font-semibold text-black">
          {TITLE.INFO_TITLE}
        </Text>

        <View className="flex-row items-center justify-between border-b border-gray-100 py-2">
          <Text className="text-sm font-bold text-gray-700">
            {LABELS.AMOUNT}
          </Text>
          <Text className="text-sm text-black">
            {formatCurrency(state.fundRequest?.amount as any)}
          </Text>
        </View>

        <View className="flex-row items-center justify-between border-b border-gray-100 py-2">
          <Text className="text-sm font-bold text-gray-700">
            {LABELS.CREATED_DATE}
          </Text>
          <Text className="text-sm text-black">
            {formatDate(state.fundRequest.createdDate, "DD/MM/YYYY - HH:mm:ss")}
          </Text>
        </View>
        <View className="flex-row items-center justify-between border-b border-gray-100 py-2">
          <Text className="text-sm font-bold text-gray-700">Lời nhắn:</Text>
          <Text className="text-sm text-black">
            {state.fundRequest?.description}
          </Text>
        </View>

        <View className="flex-row items-center justify-between border-b border-gray-100 py-2">
          <Text className="text-sm font-bold text-gray-700">
            {LABELS.TRANSFER_CONTENT}
          </Text>
          <View className="flex-row items-center">
            <Text className="mr-2 text-sm text-black">
              {state.fundRequest.transferContent}
            </Text>
            <TouchableOpacity
              onPress={() =>
                handler.copyToClipboard(state.fundRequest.transferContent)
              }
            >
              <MaterialIcons name="content-copy" size={20} color="#609084" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row items-center justify-between border-b border-gray-100 py-2">
          <Text className="text-sm font-bold text-gray-700">
            {LABELS.RECIPIENT_ACCOUNT}
          </Text>
          <View className="flex-row items-center">
            <Text className="mr-2 text-sm text-black">
              {state.fundRequest?.recipientAccount}
            </Text>
            <TouchableOpacity
              onPress={() =>
                handler.copyToClipboard(state.fundRequest?.recipientAccount)
              }
            >
              <MaterialIcons name="content-copy" size={20} color="#609084" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row items-center justify-between border-b border-gray-100 py-2">
          <Text className="text-sm font-bold text-gray-700">
            {LABELS.RECIPIENT_BANK}
          </Text>
          <Text className="text-sm text-black">
            {state.fundRequest.bankName}
          </Text>
        </View>

        <View className="flex-row items-center justify-between py-2">
          <Text className="text-sm font-bold text-gray-700">
            {LABELS.ACCOUNT_HOLDER}
          </Text>
          <Text className="text-sm text-black">
            {state.fundRequest.accountHolder}
          </Text>
        </View>
      </SectionComponent>
      <SpaceComponent height={22} />

      {/* Confirm Button */}
      <SectionComponent rootClassName="absolute bottom-0 left-0 right-0 p-5 bg-white">
        <TouchableOpacity
          onPress={handler.handleConfirm}
          className="rounded-xl bg-[#609084] py-3"
        >
          <Text className="text-center text-lg font-medium text-white">
            {BUTTON.CONFIRM}
          </Text>
        </TouchableOpacity>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
}
