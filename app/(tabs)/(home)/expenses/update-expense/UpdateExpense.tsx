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
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import TEXT_TRANSLATE_UPDATE_EXPENSE from "./UpdateExpense.translate";
import useUpdateExpense from "./hooks/useUpdateExpense";

const UpdateExpense = () => {
  const { state, handler } = useUpdateExpense();

  return (
    <SafeAreaViewCustom rootClassName="bg-gray-50">
      <SectionComponent rootClassName="h-16 bg-white justify-center px-4 shadow-sm border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={handler.handleBack}
            className="rounded-full bg-gray-50 p-2"
          >
            <MaterialIcons name="arrow-back" size={24} />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-800">
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
            <View className="flex-1 pt-4">
              <SectionComponent rootClassName="bg-white mx-4 mb-4 rounded-xl p-5 shadow-sm">
                <View>
                  <Text className="mb-1 text-base font-bold text-gray-800">
                    {TEXT_TRANSLATE_UPDATE_EXPENSE.SETUP_LIMIT}
                  </Text>
                  <Text className="text-sm leading-5 text-gray-500">
                    {TEXT_TRANSLATE_UPDATE_EXPENSE.SETUP_LIMIT_DESCRIPTION}
                  </Text>
                </View>
              </SectionComponent>

              <SectionComponent rootClassName="bg-white mx-4 rounded-xl shadow-sm overflow-hidden">
                <View className="flex-row items-center justify-between border-b border-gray-100 p-4">
                  <View className="flex-row items-center">
                    <View className="mr-3 rounded-xl bg-blue-50 p-3">
                      <MaterialIcons
                        name={state.budget?.icon as any}
                        size={28}
                        color={Colors.colors.primary}
                      />
                    </View>
                    <View>
                      <Text className="mb-1 text-xs text-gray-500">
                        {TEXT_TRANSLATE_UPDATE_EXPENSE.CATEGORY}
                      </Text>
                      <Text className="text-base font-bold text-gray-800">
                        {state.budget?.name}
                      </Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <Text className="mb-1 text-xs text-gray-500">
                      Mục tiêu hiện tại:
                    </Text>
                    <Text className="text-base font-bold text-primary">
                      {formatCurrency(state.budget?.amount)}
                    </Text>
                  </View>
                </View>

                <View className="border-b border-gray-100 px-4 py-3">
                  <Text className="text-sm leading-5 text-gray-500">
                    Số tiền tối đa bạn có thể đặt mục tiêu cho danh mục này là{" "}
                    <Text className="font-bold text-primary">
                      {formatCurrency(
                        state?.personalLimitBudgetSubcate?.limitBudget,
                      )}
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
        <Pressable
          onPress={() => handler.handleSubmitRef.current()}
          className="h-14 items-center justify-center rounded-xl bg-primary shadow"
          android_ripple={{ color: "rgba(255, 255, 255, 0.2)" }}
        >
          <Text className="text-base font-bold text-white">
            {TEXT_TRANSLATE_UPDATE_EXPENSE.EDIT}
          </Text>
        </Pressable>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
};

export default UpdateExpense;
