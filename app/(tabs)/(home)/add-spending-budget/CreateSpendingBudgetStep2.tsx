import React from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { InputComponent, SafeAreaViewCustom, SectionComponent } from "@/components";
import { MaterialIcons } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import useCreateSpendingBudgetStep2 from "./hooks/useCreateSpendingBudgetStep2";
import TEXT_TRANSLATE_CREATE_SPENDING_BUDGET_STEP2 from "./CreateSpendingBudgetStep2.translate";
import { formatCurrencyInput } from "@/helpers/libs";

const { TITLE, LABELS, MESSAGE_VALIDATE, BUTTON } = TEXT_TRANSLATE_CREATE_SPENDING_BUDGET_STEP2;
const BudgetSchema = Yup.object().shape({
  amount: Yup.string()
    .required(MESSAGE_VALIDATE.AMOUNT_REQUIRED)
    .test("is-valid-amount", MESSAGE_VALIDATE.AMOUNT_MUST_GREATER_THAN_ZERO, value => {
      const numericValue = value ? parseInt(value.replace(/\D/g, "")) : 0;
      return numericValue > 0;
    })
});

export default function CreateSpendingBudgetStep2() {
  const { state, handler } = useCreateSpendingBudgetStep2();
  const { selectedCategory, isSubmitting, isLoading } = state;
  const { handleBack, handleCreateBudget } = handler;

  const initialValues = {
    amount: '',
  };

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-[#f9f9f9]">
      {/* Header */}
      <SectionComponent rootClassName="h-14 bg-white justify-center px-5">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={handleBack} disabled={isSubmitting}>
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={isSubmitting ? "#a0a0a0" : "#609084"}
            />
          </Pressable>
          <Text className="text-lg font-bold text-[#609084]">
            {TITLE.MAIN_TITLE}
          </Text>
          <View style={{ width: 24 }} />
        </View>
      </SectionComponent>

      <Formik
        initialValues={initialValues}
        validationSchema={BudgetSchema}
        onSubmit={(values) => {
          const numericAmount = parseInt(values.amount.replace(/\D/g, ""));
          handleCreateBudget(numericAmount);
        }}
      >
        {(formikProps) => (
          <>
            {/* Budget Limit Setup */}
            <SectionComponent rootClassName="bg-white mx-4 my-2 rounded-lg p-4">
              <View className="mb-4">
                <Text className="text-base font-semibold text-black">
                  {TITLE.SETUP_LIMIT}
                </Text>
                <Text className="text-sm text-gray-500">
                  {TITLE.SETUP_DESCRIPTION}
                </Text>
              </View>
            </SectionComponent>

            <SectionComponent rootClassName="bg-white mx-4 my-2 rounded-lg p-4">
              <View className="flex-row items-center p-3 rounded-lg">
                <View className="mr-3 rounded-lg bg-superlight p-2">
                  <MaterialIcons name={selectedCategory.icon} size={32} color="#609084" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-gray-500">{LABELS.SUBCATEGORY}</Text>
                  <Text className="font-bold text-black">{selectedCategory.label}</Text>
                </View>
              </View>

              {/* Budget Input/Display */}
              <SectionComponent rootClassName="bg-white rounded-lg p-4 mt-4">
                <InputComponent
                  name="amount"
                  label={"Số tiền tối đa"}
                  placeholder={"Nhập số tiền tối đa"}
                  inputMode="numeric"
                  isRequired
                  labelClass="text-text-gray text-[12px] font-bold"
                  formatter={formatCurrencyInput}
                />
              </SectionComponent>
            </SectionComponent>

            {/* Create Budget Button */}
            <SectionComponent rootClassName="h-16 bg-white justify-center items-center border-t border-gray-300 mx-6">
              <Pressable
                className={`bg-[#609084] w-full rounded-lg py-3 px-6 items-center ${!formikProps.isValid || isSubmitting ? 'opacity-70' : ''
                  }`}
                onPress={() => formikProps.handleSubmit()}
                disabled={!formikProps.isValid || isSubmitting}
              >
                {isSubmitting ? (
                  <View className="flex-row items-center">
                    <ActivityIndicator color="white" size="small" />
                    <Text className="text-white text-lg font-semibold ml-2">
                      {LABELS.PROCESSING}
                    </Text>
                  </View>
                ) : (
                  <Text className="text-white text-lg font-semibold">
                    {BUTTON.CREATE_BUDGET}
                  </Text>
                )}
              </Pressable>
            </SectionComponent>

            {isLoading && (
              <View className="absolute inset-0 bg-black/20 items-center justify-center">
                <View className="bg-white p-4 rounded-lg">
                  <ActivityIndicator color="#609084" size="large" />
                  <Text className="text-center mt-2 text-[#609084] font-medium">
                    {LABELS.PROCESSING}
                  </Text>
                </View>
              </View>
            )}
          </>
        )}
      </Formik>
    </SafeAreaViewCustom>
  );
}