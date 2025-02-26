import {
  DatePickerComponent,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import TEXT_TRANSLATE_PERSONAL_EXPENSES from "./PersonalExpensesModel.translate";
import PERSONAL_EXPENSES_MODEL_CONSTANTS from "./PersonalExpensesModel.constants";
import usePersonalExpensesModelStep2 from "./hooks/UsePersonalExpensesModelStep2";
import { Formik } from "formik";

const PersonalExpensesModelStep2 = () => {
  const STEPS = PERSONAL_EXPENSES_MODEL_CONSTANTS.STEPS;
  const TIME_OPTIONS = PERSONAL_EXPENSES_MODEL_CONSTANTS.TIME_OPTIONS;
  const { handler, state } = usePersonalExpensesModelStep2();

  return (
    <SafeAreaViewCustom>
      <SectionComponent rootClassName="flex-row justify-between items-center h-14 px-4">
        <TouchableOpacity onPress={router.back}>
          <AntDesign name="arrowleft" size={24} color="#000000" />
        </TouchableOpacity>
        <View className="flex-row items-center gap-1">
          <Text className="text-lg font-bold text-black">
            {TEXT_TRANSLATE_PERSONAL_EXPENSES.HEADER}
          </Text>
        </View>
        <TouchableOpacity>
          <Entypo size={24} color="#000000" />
        </TouchableOpacity>
      </SectionComponent>
      <View className="mx-4 flex-row items-center justify-between rounded-xl bg-white p-6 shadow-sm">
        {STEPS.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step Circle */}
            <View className="items-center">
              <View
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  index <= 1 ? "bg-primary" : "bg-gray-300"
                }`}
              >
                {step.icon}
              </View>
              <Text
                className={`mt-1 text-sm ${
                  index <= 1 ? "text-green-600 font-medium" : "text-gray-400"
                }`}
              >
                {index === 0
                  ? TEXT_TRANSLATE_PERSONAL_EXPENSES.STEP_1
                  : index === 1
                    ? TEXT_TRANSLATE_PERSONAL_EXPENSES.STEP_2
                    : TEXT_TRANSLATE_PERSONAL_EXPENSES.STEP_3}
              </Text>
              <Text
                className={`text-xs ${
                  index <= 1 ? "text-primary" : "text-gray-400"
                }`}
              >
                {step.label}
              </Text>
            </View>

            {/* Progress Line */}
            {index !== STEPS.length - 1 && (
              <View className="flex-1 items-center pb-10">
                <View className="h-0.5 w-3/4 bg-gray-300" />
              </View>
            )}
          </React.Fragment>
        ))}
      </View>

      <Formik
        initialValues={{ startDate: "" }}
        validationSchema={state.validationSchema}
        onSubmit={() => {}}
      >
        {() => (
          <View className="mx-4 my-2 rounded-lg bg-white p-4 shadow-md">
            {/* Date Picker */}
            <View className="">
              <Text className="text-md font-semibold text-primary">
                {TEXT_TRANSLATE_PERSONAL_EXPENSES.START_DATE}
              </Text>
              <DatePickerComponent
                name="startDate"
                label=""
                labelClass="text-text-gray text-[12px] font-bold"
              />
            </View>
            {/* Time Selection */}
            <View>
              <Text className="text-md mb-1 font-semibold text-primary">
                {TEXT_TRANSLATE_PERSONAL_EXPENSES.PERIOD}
              </Text>
              {TIME_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => handler.setSelectedTime(option)}
                  className={`mt-2 rounded-lg border border-gray-300 p-3 ${
                    state.selectedTime === option
                      ? "bg-superlight text-sm font-semibold"
                      : "bg-white"
                  }`}
                >
                  <Text className="text-md">{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Submit Button */}
            <TouchableOpacity
              onPress={() => {}}
              className="mt-4 h-12 w-full items-center justify-center rounded-lg bg-primary"
            >
              <Text className="text-base font-semibold text-white">
                {TEXT_TRANSLATE_PERSONAL_EXPENSES.NEXT_BUTTON}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </SafeAreaViewCustom>
  );
};

export default PersonalExpensesModelStep2;
