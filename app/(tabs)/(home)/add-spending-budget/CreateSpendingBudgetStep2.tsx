import {
  InputComponent,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { Colors } from "@/helpers/constants/color";
import { formatCurrencyInput } from "@/helpers/libs";
import { MaterialIcons } from "@expo/vector-icons";
import { Formik } from "formik";
import React from "react";
import { Pressable, Text, View } from "react-native";
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
  const { selectedCategory } = state;
  const { handleBack, handleCreateBudget } = handler;

  const initialValues = {
    amount: "",
  };

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-[#f9f9f9]">
      {/* Header */}
      <SectionComponent rootClassName="h-14 bg-white justify-center px-5">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={handleBack}>
            <MaterialIcons name="arrow-back" size={24} color={"#609084"} />
          </Pressable>
          <Text className="text-lg font-bold text-[#609084]">
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
            <>
              <SectionComponent rootClassName="bg-white my-2 rounded-lg p-4">
                <View className="mb-4">
                  <Text className="text-base font-semibold text-black">
                    {TITLE.SETUP_LIMIT}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {TITLE.SETUP_DESCRIPTION}
                  </Text>
                </View>
              </SectionComponent>
              <SectionComponent rootClassName="bg-white mx-4 my-2 rounded-lg py-2">
                <View className="flex-row items-center rounded-lg p-3">
                  <View className="mr-3 rounded-lg bg-superlight p-2">
                    <MaterialIcons
                      name={selectedCategory.icon}
                      size={32}
                      color={Colors.colors.primary}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm text-gray-500">
                      {LABELS.SUBCATEGORY}
                    </Text>
                    <Text className="font-bold text-black">
                      {selectedCategory.label}
                    </Text>
                  </View>
                </View>
                <View className="mx-4">
                  <Text className="text-sm text-text-gray">
                    Số tiền tối đa bạn có thể đặt mục tiêu cho danh mục này là{" "}
                    <Text className="font-bold text-primary">500.000đ</Text>
                  </Text>
                </View>
                <SectionComponent rootClassName="bg-white rounded-lg p-4">
                  <InputComponent
                    name="amount"
                    label={"Số tiền tối đa"}
                    placeholder={"Nhập số tiền tối đa"}
                    inputMode="numeric"
                    isRequired
                    labelClass="text-text-gray text-[12px] font-bold"
                    inputClass="rounded-[10px]"
                    formatter={formatCurrencyInput}
                  />
                </SectionComponent>
              </SectionComponent>
            </>
          );
        }}
      </Formik>
      <SectionComponent rootClassName=" px-5 rounded-lg absolute bottom-5 w-full flex-1">
        <Pressable
          onPress={() => handler.handleSubmitRef.current()}
          className="h-12 items-center justify-center rounded-lg bg-primary"
        >
          <Text className="text-base font-semibold text-white">
            {BUTTON.CREATE_BUDGET}
          </Text>
        </Pressable>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
}
