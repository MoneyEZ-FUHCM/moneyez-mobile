import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  InputComponent,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { router } from "expo-router";
import { Formik } from "formik";
import TEXT_TRANSLATE_FUND_CONTRIBUTION_REQUEST from "./FundContributionRequest.translate";
import useFundContributionRequest from "./hooks/useFundContributionRequest";

export default function FundContributionRequest() {
  const { state, handler } = useFundContributionRequest();
  const { balance } = state;
  const { handleSubmitForm } = handler;

  return (
    <SafeAreaViewCustom rootClassName="relative bg-[#fafafa]">
      {/* HEADER */}
      <SectionComponent rootClassName="relative bg-white shadow-md h-14 flex-row items-center justify-center">
        <TouchableOpacity
          onPress={router.back}
          className="absolute left-3 rounded-full p-2"
        >
          <AntDesign name="arrowleft" size={24} />
        </TouchableOpacity>
        <Text className="text-lg font-bold">
          {TEXT_TRANSLATE_FUND_CONTRIBUTION_REQUEST.HEADER_TITLE}
        </Text>
        <TouchableOpacity className="absolute right-3 rounded-full p-2"></TouchableOpacity>
      </SectionComponent>

      {/* Form */}
      <Formik
        initialValues={{
          amount: "",
          note: "",
        }}
        onSubmit={(values) => handleSubmitForm(values)}
      >
        {({ handleSubmit }) => (
          <>
            <SectionComponent rootClassName="bg-white mx-2 p-2 mt-2 rounded-lg">
              {/* Hộp chứa số dư quỹ */}
              <View className="flex-row justify-between rounded-lg p-4">
                <Text className="ml-[-13px] pt-2 text-xs font-medium text-gray-500">
                  {TEXT_TRANSLATE_FUND_CONTRIBUTION_REQUEST.BALANCE}
                </Text>
                <Text className="text-green-600 text-lg font-bold">
                  {balance.toLocaleString()}đ
                </Text>
              </View>

              {/* Nhập số tiền */}
              <InputComponent
                isRequired
                name="amount"
                label={TEXT_TRANSLATE_FUND_CONTRIBUTION_REQUEST.AMOUNT_LABEL}
                placeholder={
                  TEXT_TRANSLATE_FUND_CONTRIBUTION_REQUEST.AMOUNT_PLACEHOLDER
                }
                inputMode="decimal"
                formatter={(text) =>
                  text.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                containerClass="mt-2"
                inputClass="rounded-lg border border-primary p-3"
              />

              {/* Nhập ghi chú */}
              <InputComponent
                isRequired
                name="note"
                label={
                  TEXT_TRANSLATE_FUND_CONTRIBUTION_REQUEST.NOTE_LABEL +
                  `(${state.note.length}/250)`
                }
                placeholder={
                  TEXT_TRANSLATE_FUND_CONTRIBUTION_REQUEST.NOTE_PLACEHOLDER
                }
                inputClass="rounded-lg border border-primary p-3"
              />
            </SectionComponent>

            {/* Nút Góp Quỹ */}
            <SectionComponent rootClassName="flex-row flex-1 absolute bottom-5 mx-4 ml-1">
              <SpaceComponent width={15} />
              <TouchableOpacity
                onPress={() => handleSubmit()}
                className="mt-10 w-1/2 flex-1 items-center rounded-lg bg-primary p-3"
              >
                <Text className="text-base font-semibold text-white">
                  {TEXT_TRANSLATE_FUND_CONTRIBUTION_REQUEST.SUBMIT_BUTTON}
                </Text>
              </TouchableOpacity>
            </SectionComponent>
          </>
        )}
      </Formik>
    </SafeAreaViewCustom>
  );
}
