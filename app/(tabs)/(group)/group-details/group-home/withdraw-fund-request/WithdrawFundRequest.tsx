import {
  InputComponent,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent
} from "@/components";
import { formatCurrency, formatCurrencyInput } from "@/helpers/libs";
import { MaterialIcons } from "@expo/vector-icons";
import { Formik } from "formik";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import * as Yup from "yup";
import TEXT_TRANSLATE_CREATE_FUND_REQUEST from "./WithdrawFundRequest.translate";
import useWithdrawFundRequest from "./hooks/useWithdrawFundRequest";
import { TextAreaComponent } from "@/components/TextAreaComponent";

const { TITLE, LABELS, BUTTON, MESSAGE_VALIDATE } = TEXT_TRANSLATE_CREATE_FUND_REQUEST;

export default function CreateFundRequest() {
  const { state, handler } = useWithdrawFundRequest();
  const { isSubmitting, fundBalance } = state;
  const { handleBack, handleCreateFundRequest } = handler;

  const FundRequestSchema = Yup.object().shape({
    amount: Yup.string()
      .required(MESSAGE_VALIDATE.AMOUNT_REQUIRED)
      .test(
        "is-valid-amount",
        MESSAGE_VALIDATE.AMOUNT_MUST_GREATER_THAN_ZERO,
        (value) => {
          const numericValue = value ? parseInt(value.replace(/\D/g, "")) : 0;
          return numericValue > 0;
        },
      ),
    description: Yup.string()
      .required(MESSAGE_VALIDATE.DESCRIPTION_REQUIRED)
      .min(5, MESSAGE_VALIDATE.DESCRIPTION_MIN_LENGTH)
  });

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-[#f9f9f9] relative">
      <SectionComponent rootClassName="flex-row relative justify-center items-center h-14 px-4">
        <TouchableOpacity
          onPress={handleBack}
          className="absolute bottom-[17px] left-4"
        >
          <MaterialIcons name="arrow-back" size={24} color="#609084" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-primary">
          {TITLE.MAIN_TITLE}
        </Text>
        <SpaceComponent width={24} />
      </SectionComponent>

      <SectionComponent rootClassName="bg-white my-2 rounded-lg p-4 mx-5">
        <Text className="text-sm text-gray-500">{TITLE.FUND_BALANCE}</Text>
        <Text className="font-bold text-black text-xl">{formatCurrency(fundBalance)}</Text>
      </SectionComponent>

      <Formik
        initialValues={{
          amount: "",
          description: ""
        }}
        validationSchema={FundRequestSchema}
        onSubmit={handleCreateFundRequest}
      >
        {({ handleSubmit }) => (
          <>
            <SectionComponent rootClassName="mt-5 mx-5">
              <InputComponent
                name="amount"
                label={LABELS.AMOUNT}
                placeholder={LABELS.AMOUNT_PLACEHOLDER}
                inputMode="numeric"
                isRequired
                labelClass="text-text-gray text-[12px]"
                formatter={formatCurrencyInput}
              />
              <SpaceComponent height={10} />
              <TextAreaComponent
                name="description"
                label={LABELS.DESCRIPTION}
                placeholder={LABELS.DESCRIPTION_PLACEHOLDER}
                labelClass="text-text-gray text-[12px]"
                isRequired
                maxLength={250}
              />
            </SectionComponent>

            <SectionComponent rootClassName="absolute bottom-5 w-full">
              <TouchableOpacity
                onPress={() => handleSubmit()}
                className="mx-5 rounded-xl bg-primary py-3"
                disabled={isSubmitting}
              >
                <Text className="text-center text-lg font-medium text-white">
                  {isSubmitting ? BUTTON.SUBMITTING : BUTTON.SUBMIT}
                </Text>
              </TouchableOpacity>
            </SectionComponent>
          </>
        )}
      </Formik>
    </SafeAreaViewCustom>
  );
}