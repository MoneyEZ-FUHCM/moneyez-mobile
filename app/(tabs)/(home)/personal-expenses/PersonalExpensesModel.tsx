import {
  SafeAreaViewCustom,
  SectionComponent,
  CustomModal,
} from "@/components";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import TEXT_TRANSLATE_PERSONAL_EXPENSES from "./PersonalExpensesModel.translate";
import { usePersonalExpensesModel } from "./UsePersonalExpensesModel";
import PERSONAL_EXPENSES_MODEL_CONSTANTS from "./PersonalExpensesModel.constants";
import { PATH_NAME } from "@/helpers/constants/pathname";

const PersonalExpensesModel = () => {
  const { state, handler } = usePersonalExpensesModel();
  const MODELS = PERSONAL_EXPENSES_MODEL_CONSTANTS.MODELS;
  const STEPS = PERSONAL_EXPENSES_MODEL_CONSTANTS.STEPS;
  const { HOME } = PATH_NAME;

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
                  step.isActive ? "bg-primary" : "bg-gray-300"
                }`}
              >
                {step.icon}
              </View>
              <Text
                className={`mt-1 text-sm ${
                  step.isActive ? "text-green-600 font-medium" : "text-gray-400"
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
                  step.isActive ? "text-primary" : "text-gray-400"
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
      {/* Model Selection */}
      <View className="mx-4 mt-4 rounded-xl bg-white p-4">
        <Text className="mb-3 text-base font-medium">
          {TEXT_TRANSLATE_PERSONAL_EXPENSES.MODEL_SELECTION}
        </Text>
        {MODELS.map((model) => (
          <TouchableOpacity
            key={model.name}
            className={`mb-2 rounded-lg border p-3 ${
              state.selectedModel === model.name
                ? "border-gray-400 bg-secondary"
                : "border-gray-300 bg-white"
            }`}
            onPress={() => handler.setSelectedModel(model.name)}
          >
            <View className="flex-row items-center justify-between">
              <Text>{model.name}</Text>
              {model.name !== "Tùy chọn" && (
                <TouchableOpacity
                  onPress={() => {
                    handler.setIsModalVisible(true);
                    handler.setSelectedModel(model.name);
                  }}
                >
                  <Entypo name="info-with-circle" size={24} color="#000000" />
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        ))}

        {/* Custom Input */}
        {state.selectedModel === "Tùy chọn" && (
          <TextInput
            placeholder={
              TEXT_TRANSLATE_PERSONAL_EXPENSES.CUSTOM_MODEL_PLACEHOLDER
            }
            value={state.customModel}
            onChangeText={handler.setCustomModel}
            className="mt-2 rounded-lg border border-gray-300 bg-white p-3"
          />
        )}

        <TouchableOpacity className="mt-4">
          <Text className="text-green-600 text-center underline">
            {TEXT_TRANSLATE_PERSONAL_EXPENSES.HELP_TEXT}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Next Button */}
      <TouchableOpacity
        onPress={() =>
          router.navigate(HOME.PERSONAL_EXPENSES_MODEL_STEP_2 as any)
        }
        className="mx-4 mt-10 items-center rounded-lg bg-primary p-4"
      >
        <Text className="font-semibold text-white">
          {TEXT_TRANSLATE_PERSONAL_EXPENSES.NEXT_BUTTON}
        </Text>
      </TouchableOpacity>
      <CustomModal
        visible={state.isModalVisible}
        title={TEXT_TRANSLATE_PERSONAL_EXPENSES.MODAL_TITLE(
          state.selectedModel,
        )}
        content={
          MODELS.find((model) => model.name === state.selectedModel)
            ?.description || ""
        }
        onClose={() => handler.setIsModalVisible(false)}
      />
    </SafeAreaViewCustom>
  );
};

export default PersonalExpensesModel;
