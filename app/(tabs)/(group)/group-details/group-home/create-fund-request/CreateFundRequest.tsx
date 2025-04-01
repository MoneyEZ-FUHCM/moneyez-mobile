import {
  InputComponent,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { formatCurrency, formatCurrencyInput } from "@/helpers/libs";
import { MaterialIcons } from "@expo/vector-icons";
import { Formik } from "formik";
import React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";
import useCreateFundRequest from "./hooks/useCreateFundRequest";
import TEXT_TRANSLATE_CREATE_FUND_REQUEST from "./CreateFundRequest.translate";
import { TextAreaComponent } from "@/components/TextAreaComponent";

const { TITLE, LABELS, BUTTON, MESSAGE_VALIDATE } =
  TEXT_TRANSLATE_CREATE_FUND_REQUEST;

export default function CreateFundRequest() {
  const { state, handler } = useCreateFundRequest();
  const { isSubmitting, fundBalance } = state;
  const { handleBack, handleCreateFundRequest } = handler;

  const FundRequestSchema = Yup.object().shape({
    amount: Yup.string()
      .required(MESSAGE_VALIDATE.AMOUNT_REQUIRED)
      .test("min-amount", "Giá trị thấp nhất là 10.000đ", function (value) {
        if (!value) return true;
        const numericValue = Number(value.replace(/\./g, ""));
        return numericValue >= 10000;
      }),
    description: Yup.string()
      .required(MESSAGE_VALIDATE.DESCRIPTION_REQUIRED)
      .min(5, MESSAGE_VALIDATE.DESCRIPTION_MIN_LENGTH),
  });

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-[#f9f9f9] relative">
      <SectionComponent rootClassName="flex-row relative justify-center items-center bg-white h-14 px-4">
        <TouchableOpacity onPress={handleBack} className="absolute left-4">
          <MaterialIcons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text className="text-lg font-bold">{TITLE.MAIN_TITLE}</Text>
        <SpaceComponent width={24} />
      </SectionComponent>

      <SectionComponent rootClassName="bg-white my-2 rounded-lg p-4 mx-5">
        <Text className="text-sm text-gray-500">{TITLE.FUND_BALANCE}</Text>
        <Text className="text-xl font-bold text-black">
          {formatCurrency(fundBalance)}
        </Text>
      </SectionComponent>

      <Formik
        initialValues={{
          amount: "",
          description: "Góp vào quỹ chung",
        }}
        innerRef={(ref) => (state.formikRef.current = ref)}
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
                labelClass="text-text-gray text-[12px] font-bold"
                formatter={formatCurrencyInput}
              />
              <View className="flex-row flex-wrap gap-2">
                {[50000, 100000, 200000, 500000].map((amount) => (
                  <Pressable
                    key={amount}
                    onPress={() => {
                      state.formikRef.current?.setFieldValue(
                        "amount",
                        formatCurrencyInput(amount.toString()),
                      );
                    }}
                    className="rounded-full bg-thirdly px-3 py-0.5 text-primary"
                  >
                    <Text className="text-xs text-gray-700">
                      {formatCurrencyInput(amount.toString())}
                    </Text>
                  </Pressable>
                ))}
              </View>
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
