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
import { Pressable, Text, View } from "react-native";
import TEXT_TRANSLATE_UPDATE_EXPENSE from "./UpdateExpense.translate";
import useUpdateExpense from "./hooks/useUpdateExpense";
import { Colors } from "@/helpers/constants/color";

const EditBudgetScreen = () => {
  const { state, handler } = useUpdateExpense();

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-[#f9f9f9]">
      {/* Header */}
      <SectionComponent rootClassName="h-14 bg-white justify-center px-5">
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => {}}>
            <MaterialIcons name="arrow-back" size={24} />
          </Pressable>
          <Text className="text-lg font-bold">
            {TEXT_TRANSLATE_UPDATE_EXPENSE.HEADER_TITLE}
          </Text>
          <SpaceComponent width={24} />
        </View>
      </SectionComponent>
      <Formik
        innerRef={(ref) => (state.formikRef.current = ref)}
        initialValues={state.initialValues}
        validationSchema={handler.BudgetSchema}
        onSubmit={(values) => {
          const numericAmount = parseInt(values.amount.replace(/\D/g, ""));
          handler.handleUpdateBudget(numericAmount);
        }}
      >
        {({ handleSubmit }) => {
          handler.handleSubmitRef.current = handleSubmit;
          return (
            <>
              <SectionComponent rootClassName="bg-white my-2 rounded-lg p-4">
                <View className="mb-4">
                  <Text className="text-base font-semibold text-black">
                    {TEXT_TRANSLATE_UPDATE_EXPENSE.SETUP_LIMIT}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {TEXT_TRANSLATE_UPDATE_EXPENSE.SETUP_LIMIT_DESCRIPTION}
                  </Text>
                </View>
              </SectionComponent>
              <SectionComponent rootClassName="bg-white mx-4 my-2 rounded-lg py-2">
                <View className="flex-row items-center rounded-lg p-3">
                  <View className="mr-3 rounded-lg bg-superlight p-2">
                    <MaterialIcons
                      name={state.budget?.icon as any}
                      size={32}
                      color={Colors.colors.primary}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm text-gray-500">
                      {TEXT_TRANSLATE_UPDATE_EXPENSE.CATEGORY}
                    </Text>
                    <Text className="font-bold text-black">
                      {state.budget?.name}
                    </Text>
                  </View>
                </View>
                <View className="mx-4">
                  <Text className="text-sm text-text-gray">
                    Số tiền tối đa bạn có thể đặt mục tiêu cho danh mục này là{" "}
                    <Text className="font-bold text-primary">
                      {formatCurrency(
                        state?.personalLimitBudgetSubcate?.limitBudget,
                      )}
                    </Text>
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
            {TEXT_TRANSLATE_UPDATE_EXPENSE.EDIT}
          </Text>
        </Pressable>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
};

export default EditBudgetScreen;
