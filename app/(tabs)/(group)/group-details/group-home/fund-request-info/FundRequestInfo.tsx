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
  const { TITLE, LABELS, BUTTON } = TEXT_TRANSLATE_FUND_REQUEST_INFO;

  const renderInfoRow = (
    label: any,
    value: any,
    copyable = false,
    lastItem = false,
  ) => (
    <View
      className={`flex-row items-center justify-between py-3 ${!lastItem ? "border-b border-gray-200" : ""}`}
    >
      <Text className="text-sm font-semibold text-gray-700">{label}</Text>
      <View className="max-w-[60%] flex-row items-center">
        <Text
          className="text-right text-sm text-gray-900"
          numberOfLines={copyable ? 1 : 2}
        >
          {value || "-"}
        </Text>
        {copyable && value && (
          <TouchableOpacity
            onPress={() => handler.copyToClipboard(value)}
            className="ml-2 p-1"
          >
            <MaterialIcons name="content-copy" size={18} color="#609084" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-gray-50">
      <SectionComponent rootClassName="h-16 bg-white justify-center shadow-sm">
        <View className="flex-row items-center justify-between px-4">
          <TouchableOpacity
            className="rounded-full bg-gray-50 p-2"
            onPress={handler.handleBack}
          >
            <MaterialIcons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-800">
            {state.mode === "WITHDRAW"
              ? "Chi tiết yêu cầu rút quỹ"
              : TITLE.MAIN_TITLE}
          </Text>
          <SpaceComponent width={40} />
        </View>
      </SectionComponent>

      <SectionComponent rootClassName="mx-4 mt-6 rounded-xl bg-white p-4 shadow-sm">
        <Text className="text-sm italic leading-5 text-gray-600">
          <Text className="text-red">* {""}</Text>
          {state.getSuccessMessage()}
        </Text>
      </SectionComponent>

      <SectionComponent rootClassName="mx-4 mt-4 rounded-xl bg-white p-5 shadow-sm">
        <Text className="mb-4 text-lg font-semibold text-gray-800">
          {state.mode === "WITHDRAW"
            ? "Thông tin rút quỹ"
            : "Thông tin góp quỹ"}
        </Text>
        {renderInfoRow(
          LABELS.AMOUNT,
          formatCurrency(state.fundRequest?.amount as any),
        )}
        {renderInfoRow(
          LABELS.CREATED_DATE,
          formatDate(state.fundRequest?.createdDate, "DD/MM/YYYY - HH:mm:ss"),
        )}
        {renderInfoRow("Lời nhắn:", state.fundRequest?.description)}
        {state.mode !== "WITHDRAW" && (
          <>
            {renderInfoRow(
              LABELS.TRANSFER_CONTENT,
              state.fundRequest?.transferContent,
              true,
            )}
            {renderInfoRow(
              LABELS.RECIPIENT_ACCOUNT,
              state.fundRequest?.recipientAccount,
              true,
            )}
            {renderInfoRow(LABELS.RECIPIENT_BANK, state.fundRequest?.bankName)}
            {renderInfoRow(
              LABELS.ACCOUNT_HOLDER,
              state.fundRequest?.accountHolder,
              false,
              true,
            )}
          </>
        )}
      </SectionComponent>
      <SectionComponent rootClassName="absolute bottom-5 left-0 right-0 px-4">
        <TouchableOpacity
          onPress={handler.handleCreateFundRequest}
          className="rounded-xl bg-primary py-4 shadow-sm"
          activeOpacity={0.8}
        >
          <Text className="text-center text-base font-semibold text-white">
            {state.mode === "WITHDRAW"
              ? "Tạo yêu cầu rút quỹ mới"
              : BUTTON.CREATE_FUND_REQUEST}
          </Text>
        </TouchableOpacity>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
}
