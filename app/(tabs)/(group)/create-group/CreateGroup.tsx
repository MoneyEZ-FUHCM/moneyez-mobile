import {
  InputComponent,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import { formatCurrencyInput } from "@/helpers/libs";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useMemo } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useCreateGroupScreen from "../hooks/useCreateGroupScreen";
import TEXT_TRANSLATE_CREATE_GROUP from "./CreateGroup.translate";

const CreateGroup = () => {
  const { TITLE, STEPS, BUTTON, TEXT, PLACEHOLDER } =
    TEXT_TRANSLATE_CREATE_GROUP;
  const { state, handler } = useCreateGroupScreen();

  const renderImage = useMemo(
    () => (
      <View className="flex flex-row items-center space-x-3">
        {state?.imageUrl ? (
          <Pressable
            onPress={handler.pickAndUploadImage}
            className="relative h-[90px] w-[90px] overflow-hidden rounded-full border border-gray-300 shadow-sm"
          >
            <Image
              source={{ uri: state.imageUrl }}
              className="h-full w-full"
              resizeMode="cover"
            />
          </Pressable>
        ) : (
          <Pressable
            onPress={handler.pickAndUploadImage}
            className="relative mx-1 mb-2 h-[82px] w-[82px] items-center justify-center overflow-hidden rounded-lg border border-[#ccc]"
          >
            <MaterialIcons name="add-circle-outline" size={40} color="#ccc" />
          </Pressable>
        )}
      </View>
    ),
    [state.imageUrl, handler],
  );

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-gray-50">
      {/* Header */}
      <SectionComponent rootClassName="relative flex-row bg-white items-center justify-center h-14 px-5 shadow-sm">
        <TouchableOpacity
          onPress={router.back}
          className="absolute left-2 rounded-full p-2 active:opacity-75"
        >
          <AntDesign name="arrowleft" size={24} color="#609084" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-primary">
          {TITLE.CREATE_NEW_GROUP}
        </Text>
      </SectionComponent>

      <Formik
        initialValues={{
          name: "",
          description: "",
          currentBalance: "",
          accountBankId: "",
        }}
        validationSchema={handler.validationSchema}
        onSubmit={(values) => handler.handleCreateGroup(values as any)}
      >
        {({ handleSubmit }) => (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 px-6 py-6"
          >
            <Text className="mb-2 text-lg font-semibold text-primary">
              {STEPS.INFORMATION}
            </Text>

            <View className="rounded-lg bg-white p-5 shadow-md">
              {/* Nhập thông tin nhóm */}
              <InputComponent
                name="name"
                label={TEXT.GROUP_NAME}
                placeholder={PLACEHOLDER.ENTER_GROUP_NAME}
                isRequired
                containerClass="mb-5"
                labelClass="text-sm text-gray-600"
                inputClass="text-sm text-gray-800"
              />
              <InputComponent
                name="description"
                label={TEXT.DESCRIPTION}
                placeholder={PLACEHOLDER.ENTER_DESCRIPTION}
                isRequired
                containerClass="mb-5"
                labelClass="text-sm text-gray-600"
                inputClass="text-sm text-gray-800"
              />
              <InputComponent
                name="accountBankId"
                label={TEXT.ACCOUNT_BANKING}
                placeholder={PLACEHOLDER.ENTER_ACCOUNT_BANKING}
                isRequired
                containerClass="mb-5"
                labelClass="text-sm text-gray-600"
                inputClass="text-sm text-gray-800"
              />
              <InputComponent
                name="currentBalance"
                label={TEXT.CURRENT_BALANCE}
                placeholder={PLACEHOLDER.ENTER_CURRENT_BALANCE}
                isRequired
                inputMode="numeric"
                containerClass="mb-5"
                labelClass="text-sm text-gray-600"
                inputClass="text-sm text-gray-800"
                formatter={formatCurrencyInput}
              />
              <Text className="mb-2 text-sm text-gray-600">Ảnh</Text>
              {renderImage}
            </View>

            {/* Nút tiếp tục */}
            <View className="absolute bottom-5 left-6 right-6">
              <TouchableOpacity
                onPress={() => handleSubmit()}
                className="w-full items-center rounded-lg bg-primary py-3 shadow-lg"
              >
                <Text className="text-lg font-semibold text-white">
                  {BUTTON.NEXT}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}
      </Formik>
    </SafeAreaViewCustom>
  );
};

export default CreateGroup;
