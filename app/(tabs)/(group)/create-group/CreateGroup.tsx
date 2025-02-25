import {
  SafeAreaViewCustom,
  SectionComponent,
  InputComponent,
} from "@/components";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import TEXT_TRANSLATE_CREATE_GROUP from "./CreateGroup.translate";
import { Formik } from "formik";
import useCreateGroupScreen from "../hooks/useCreateGroupScreen";

const CreateGroup = () => {
  const { TITLE, STEPS, BUTTON, TEXT, PLACEHOLDER } =
    TEXT_TRANSLATE_CREATE_GROUP;
  const { state, handler } = useCreateGroupScreen();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <SafeAreaViewCustom>
        <SectionComponent rootClassName="flex-row justify-between items-center h-14 px-4">
          <TouchableOpacity onPress={router.back}>
            <AntDesign name="arrowleft" size={24} color="#000000" />
          </TouchableOpacity>
          <View className="flex-row items-center gap-1">
            <Text className="text-lg font-bold text-black">
              {TITLE.CREATE_NEW_GROUP}
            </Text>
          </View>
          <TouchableOpacity></TouchableOpacity>
        </SectionComponent>
        <Formik
          initialValues={{
            groupName: state.groupName,
            description: state.description,
            currentBalance: state.currentBalance,
          }}
          validationSchema={handler.validationSchema}
          onSubmit={handler.handleSubmit}
        >
          {({ handleSubmit }) => (
            <View className="flex-1 bg-white px-4 py-6">
              <Text className="mb-2 text-lg font-bold text-primary">
                {STEPS.INFORMATION}
              </Text>
              <View className="rounded-lg bg-gray-100 p-4">
                <InputComponent
                  name="groupName"
                  label={TEXT.GROUP_NAME}
                  placeholder={PLACEHOLDER.ENTER_GROUP_NAME}
                  isRequired
                  containerClass="mb-2"
                  labelClass="text-sm text-gray-600"
                  inputClass="text-sm text-gray-800"
                />
                <InputComponent
                  name="description"
                  label={TEXT.DESCRIPTION}
                  placeholder={PLACEHOLDER.ENTER_DESCRIPTION}
                  isRequired
                  containerClass="mb-2"
                  labelClass="text-sm text-gray-600"
                  inputClass="text-sm text-gray-800"
                />
                <InputComponent
                  name="currentBalance"
                  label={TEXT.CURRENT_BALANCE}
                  placeholder={PLACEHOLDER.ENTER_CURRENT_BALANCE}
                  isRequired
                  inputMode="numeric"
                  containerClass="mb-2"
                  labelClass="text-sm text-gray-600"
                  inputClass="text-sm text-gray-800"
                />
              </View>
              {!state.isKeyboardVisible && (
                <View className="flex-1 justify-end pb-24">
                  <TouchableOpacity
                    onPress={() => handleSubmit()}
                    className="w-full rounded-2xl px-4"
                  >
                    <View className="h-[49px] w-full items-center justify-center overflow-hidden rounded-[10px] bg-[#5f8f84]">
                      <Text className="font-['Inter'] text-base font-extrabold text-white">
                        {BUTTON.NEXT}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </Formik>
      </SafeAreaViewCustom>
    </KeyboardAvoidingView>
  );
};

export default CreateGroup;
