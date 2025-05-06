import {
  InputComponent,
  LoadingSectionWrapper,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import { DatePickerFinancialGoalComponent } from "@/components/GroupComponentCustom/DatePickerFinancialGoalComponent";
import { ScrollViewCustom } from "@/components/ScrollViewCustom";
import { formatCurrencyInput } from "@/helpers/libs";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Formik } from "formik";
import React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL from "./GroupFinancialGoal.translate";
import useGroupFinancialGoalForm from "./hooks/useGroupFinancialGoalForm";

export default function GroupFinancialGoalForm() {
  // Use custom hook
  const { state, refState, handler } = useGroupFinancialGoalForm();
  const { LABELS, BUTTON, TITLE } = TEXT_TRANSLATE_GROUP_FINANCIAL_GOAL;

  return (
    <SafeAreaViewCustom rootClassName="bg-[#f9f9f9] flex-1">
      <StatusBar style="auto" />

      {/* Header */}
      <SectionComponent rootClassName="h-14 bg-white justify-center relative">
        <View className="flex-row items-center justify-between px-5">
          <TouchableOpacity
            onPress={handler.handleGoBack}
            className="rounded-full bg-gray-50 p-2"
          >
            <MaterialIcons name="arrow-back" size={24} />
          </TouchableOpacity>
          <Text className="text-lg font-bold">
            {state.isCreateMode ? TITLE.CREATE_GOAL : TITLE.UPDATE_GOAL}
          </Text>
          <Text></Text>
        </View>
      </SectionComponent>

      <LoadingSectionWrapper isLoading={state.isLoading}>
        <ScrollViewCustom
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
          isBottomTab
        >
          <Formik
            initialValues={state.initialValues}
            validationSchema={handler.FinancialGoalSchema}
            onSubmit={handler.handleSubmit}
            innerRef={refState.formikRef}
            enableReinitialize
            context={{ isUpdateMode: !state.isCreateMode }}
          >
            {({ handleSubmit, values, setFieldValue }) => {
              handler.handleSubmitRef.current = handleSubmit;

              const handleTargetAmountBlur = () => {
                if (!state.isCreateMode && state.financialGoal) {
                  const targetAmount =
                    parseInt(values.targetAmount.replace(/\D/g, ""), 10) || 0;
                  const currentAmount = state.financialGoal.currentAmount || 0;

                  if (targetAmount < currentAmount) {
                    const formattedCurrentAmount = formatCurrencyInput(
                      currentAmount.toString(),
                    );
                    setFieldValue("targetAmount", formattedCurrentAmount);
                  }
                }
              };

              return (
                <SectionComponent rootClassName="rounded-[10px] bg-white p-4 shadow-sm">
                  <View>
                    {!state.isCreateMode && (
                      <View className="mb-4 rounded-md bg-superlight p-4">
                        <Text className="text-sm text-gray-500">
                          {LABELS.CURRENT_AMOUNT}
                        </Text>
                        <Text className="text-xl font-bold text-[#609084]">
                          {formatCurrencyInput(
                            state.initialValues.currentAmount || "0",
                          )}
                        </Text>
                      </View>
                    )}
                    <InputComponent
                      name="name"
                      label={LABELS.GOAL_NAME}
                      placeholder={LABELS.GOAL_NAME_PLACEHOLDER}
                      isRequired
                      labelClass="text-text-gray text-sm"
                    />

                    <InputComponent
                      name="targetAmount"
                      label={LABELS.TARGET_AMOUNT}
                      placeholder={LABELS.TARGET_AMOUNT_PLACEHOLDER}
                      inputMode="numeric"
                      formatter={formatCurrencyInput}
                      isRequired
                      labelClass="text-text-gray text-sm"
                      onBlur={handleTargetAmountBlur}
                    />

                    <DatePickerFinancialGoalComponent
                      name="deadline"
                      label={LABELS.DEADLINE}
                      containerClass="flex-1"
                      labelClass="text-text-gray text-sm"
                      isRequired
                    />
                  </View>
                </SectionComponent>
              );
            }}
          </Formik>
        </ScrollViewCustom>
      </LoadingSectionWrapper>

      <SectionComponent rootClassName="px-5 rounded-lg absolute bottom-5 w-full flex-1">
        <Pressable
          onPress={() => handler.handleSubmitRef.current()}
          disabled={state.isSubmitting}
          className="h-12 items-center justify-center rounded-lg bg-primary"
        >
          {state.isSubmitting ? (
            <Text className="text-base font-semibold text-white">
              Loading...
            </Text>
          ) : (
            <Text className="text-base font-semibold text-white">
              {state.isCreateMode ? BUTTON.CREATE : BUTTON.UPDATE}
            </Text>
          )}
        </Pressable>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
}
