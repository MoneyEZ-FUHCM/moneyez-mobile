import {
  CustomModal,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { Formik } from "formik";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import usePersonalExpensesModel from "./hooks/usePersonalExpensesModel";
import PERSONAL_EXPENSES_MODEL_CONSTANTS, {
  TIME_OPTIONS,
} from "./PersonalExpensesModel.constants";
import TEXT_TRANSLATE_PERSONAL_EXPENSES from "./PersonalExpensesModel.translate";
import { DatePickerComponent } from "@/components/personal-expenses/DatePickerComponent";

const PersonalExpensesModel = () => {
  const { state, handler } = usePersonalExpensesModel();
  const MODELS = PERSONAL_EXPENSES_MODEL_CONSTANTS.MODELS;
  const STEPS = PERSONAL_EXPENSES_MODEL_CONSTANTS.STEPS;

  return (
    <SafeAreaViewCustom rootClassName="relative">
      <SectionComponent rootClassName="flex-row justify-between items-center h-14 px-4">
        <TouchableOpacity onPress={handler.handleBack}>
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
        {STEPS.map((stepItem, index) => {
          const isActive = index + 1 <= state.step;
          return (
            <React.Fragment key={index}>
              {/* Step Circle */}
              <TouchableOpacity onPress={() => handler.setStep(index + 1)}>
                <View className="items-center">
                  <View
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      isActive ? "bg-primary" : "bg-gray-300"
                    }`}
                  >
                    {stepItem.icon}
                  </View>
                  <Text
                    className={`mt-1 text-sm ${
                      isActive ? "text-green-600 font-medium" : "text-gray-400"
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
                      isActive ? "text-primary" : "text-gray-400"
                    }`}
                  >
                    {stepItem.label}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Progress Line */}
              {index !== STEPS.length - 1 && (
                <View className="flex-1 items-center pb-10">
                  <View
                    className={`h-0.5 w-3/4 ${
                      state.step > index + 1 ? "bg-primary" : "bg-gray-300"
                    }`}
                  />
                </View>
              )}
            </React.Fragment>
          );
        })}
      </View>

      {/* Model Selection */}
      {state.step === 1 ? (
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
                    <Entypo name="info-with-circle" size={18} color="#609084" />
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
      ) : state.step === 2 ? (
        <Formik
          initialValues={{ startDate: "" }}
          validationSchema={handler.validationSchema}
          onSubmit={() => {}}
        >
          {() => (
            <View className="mx-4 mt-4 rounded-lg bg-white p-4 shadow-md">
              <View className="">
                <DatePickerComponent
                  isRequired
                  name="startDate"
                  label={TEXT_TRANSLATE_PERSONAL_EXPENSES.START_DATE}
                  labelClass="text-md font-semibold text-primary"
                  selectedDate={state.startDate} // Add this line to set the selected date
                  onChange={(date: Date) =>
                    handler.setStartDate(date.toISOString().split("T")[0])
                  }
                />
              </View>
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
                        ? "bg-secondary text-sm font-semibold"
                        : "bg-white"
                    }`}
                  >
                    <Text className="text-md">{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </Formik>
      ) : state.step === 3 ? (
        <View className="min-h-screen bg-gray-100 p-4">
          {/* Mô hình */}
          <View className="mb-4 rounded-lg bg-white p-4 shadow-sm">
            <Text className="font-semibold text-primary">Mô hình</Text>
            <Text className="text-md mt-1">{state.selectedModel}</Text>
          </View>

          {/* Ngày bắt đầu & Thời hạn */}
          <View className="mb-4 flex-row justify-between rounded-lg bg-white p-4 shadow-sm">
            <View className="flex-col justify-between">
              <Text className="font-semibold text-primary">Ngày bắt đầu</Text>
              <Text className="text-md">{state.startDate}</Text>
            </View>
            <View className="mt-1 flex-col justify-between pr-14">
              <Text className="font-semibold text-primary">Thời hạn</Text>
              <Text className="text-md">{state.selectedTime}</Text>
            </View>
          </View>

          {/* Phạm vi */}
          <View className="rounded-lg bg-white p-4 shadow-sm">
            <Text className="font-semibold text-primary">Phạm vi</Text>
            <Text className="text-md mt-1">Cá nhân</Text>
          </View>
        </View>
      ) : null}

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
      {/* Next Button */}
      <SectionComponent rootClassName="flex-row flex-1 absolute bottom-5 mx-4">
        <SpaceComponent width={15} />
        <TouchableOpacity
          onPress={() => {
            if (state.step === 3) {
              return;
            }
            handler.setStep(state.step + 1);
          }}
          className="mt-10 w-1/2 flex-1 items-center rounded-lg bg-primary p-3"
        >
          <Text className="text-base font-semibold text-white">
            {state.step === 3
              ? "Xong"
              : TEXT_TRANSLATE_PERSONAL_EXPENSES.NEXT_BUTTON}
          </Text>
        </TouchableOpacity>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
};

export default PersonalExpensesModel;
