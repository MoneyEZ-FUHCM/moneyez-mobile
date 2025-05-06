import {
  InputComponent,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { Colors } from "@/helpers/constants/color";
import { formatCurrency, formatCurrencyInput } from "@/helpers/libs";
import { MaterialIcons } from "@expo/vector-icons";
import { Formik } from "formik";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";
import TEXT_TRANSLATE_CREATE_SPENDING_BUDGET_STEP2 from "./CreateSpendingBudgetStep2.translate";
import useCreateSpendingBudgetStep2 from "./hooks/useCreateSpendingBudgetStep2";

const { TITLE, LABELS, MESSAGE_VALIDATE, BUTTON } =
  TEXT_TRANSLATE_CREATE_SPENDING_BUDGET_STEP2;
const BudgetSchema = Yup.object().shape({
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
});

export default function CreateSpendingBudgetStep2() {
  const { state, handler, refState } = useCreateSpendingBudgetStep2();
  const { selectedCategory, personalLimitBudgetSubcate } = state;
  const { handleBack, handleCreateBudget } = handler;

  const initialValues = {
    amount: "",
  };

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-gray-50">
      <SectionComponent rootClassName="h-16 bg-white justify-center px-4 shadow-sm border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={handleBack}
            className="rounded-full bg-gray-50 p-2"
          >
            <MaterialIcons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-800">
            {TITLE.MAIN_TITLE}
          </Text>
          <SpaceComponent width={24} />
        </View>
      </SectionComponent>
      <Formik
        innerRef={(ref) => (refState.formikRef.current = ref)}
        initialValues={initialValues}
        validationSchema={BudgetSchema}
        onSubmit={(values) => {
          const numericAmount = parseInt(values.amount.replace(/\D/g, ""));
          handleCreateBudget(numericAmount);
        }}
      >
        {({ handleSubmit }) => {
          handler.handleSubmitRef.current = handleSubmit;
          return (
            <View className="flex-1 pt-4">
              <SectionComponent rootClassName="bg-white mx-4 mb-4 rounded-xl p-5 shadow-sm">
                <View>
                  <Text className="mb-1 text-base font-bold text-gray-800">
                    {TITLE.SETUP_LIMIT}
                  </Text>
                  <Text className="text-sm leading-5 text-gray-500">
                    {TITLE.SETUP_DESCRIPTION}
                  </Text>
                </View>
              </SectionComponent>
              <SectionComponent rootClassName="bg-white mx-4 rounded-xl shadow-sm overflow-hidden">
                <View className="flex-row items-center border-b border-gray-100 p-4">
                  <View className="mr-3 rounded-xl bg-blue-50 p-3">
                    <MaterialIcons
                      name={selectedCategory.icon}
                      size={28}
                      color={Colors.colors.primary}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="mb-1 text-xs text-gray-500">
                      {LABELS.SUBCATEGORY}
                    </Text>
                    <Text className="text-base font-bold text-gray-800">
                      {selectedCategory.label}
                    </Text>
                  </View>
                </View>
                <View className="border-b border-gray-100 px-4 py-3">
                  <Text className="text-sm leading-5 text-gray-500">
                    Số tiền tối đa bạn có thể đặt mục tiêu cho danh mục này là{" "}
                    <Text className="font-bold text-primary">
                      {formatCurrency(personalLimitBudgetSubcate?.limitBudget)}
                    </Text>
                  </Text>
                </View>
                <SectionComponent rootClassName="p-4">
                  <InputComponent
                    name="amount"
                    label={"Số tiền tối đa"}
                    placeholder={"Nhập số tiền tối đa"}
                    inputMode="numeric"
                    isRequired
                    labelClass="text-gray-500 text-xs font-bold"
                    inputClass="rounded-lg border border-gray-200 bg-gray-50 px-3 text-md"
                    formatter={formatCurrencyInput}
                  />
                </SectionComponent>
              </SectionComponent>
            </View>
          );
        }}
      </Formik>
      <SectionComponent rootClassName="px-4 py-5 absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 border-t border-gray-100">
        <TouchableOpacity
          onPress={() => handler.handleSubmitRef.current()}
          className="h-14 items-center justify-center rounded-xl bg-primary shadow"
        >
          <Text className="text-base font-bold text-white">
            {BUTTON.CREATE_BUDGET}
          </Text>
        </TouchableOpacity>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
}
