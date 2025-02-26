import { SafeAreaViewCustom, SectionComponent } from "@/components";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import PERSONAL_EXPENSES_MODEL_CONSTANTS from "./PersonalExpensesModel.constants";
import TEXT_TRANSLATE_PERSONAL_EXPENSES from "./PersonalExpensesModel.translate";

const PersonalExpensesModelStep3 = () => {
  const STEPS = PERSONAL_EXPENSES_MODEL_CONSTANTS.STEPS;
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
        <TouchableOpacity></TouchableOpacity>
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
    </SafeAreaViewCustom>
  );
};

export default PersonalExpensesModelStep3;
