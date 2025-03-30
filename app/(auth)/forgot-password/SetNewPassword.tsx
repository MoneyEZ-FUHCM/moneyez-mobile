import {
  BackScreenButton,
  InputComponent,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { useRouter } from "expo-router";
import { Formik } from "formik";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import AUTH_SCREEN_CONSTANTS from "../AuthScreen.const";
import TEXT_TRANSLATE_AUTH from "../AuthScreen.translate";
import useForgotPassword from "../hooks/useForgotPassword";

const SetNewPassword = () => {
  const { handler, state } = useForgotPassword();
  const { TITLE, BUTTON, LABEL } = TEXT_TRANSLATE_AUTH;
  const { FORM_NAME } = AUTH_SCREEN_CONSTANTS;
  const router = useRouter();

  return (
    <SafeAreaViewCustom rootClassName="justify-center px-10 items-center bg-white relative">
      <SectionComponent rootClassName="w-full mb-10">
        <BackScreenButton onPress={() => router.back()} />
      </SectionComponent>
      <SectionComponent rootClassName="w-full">
        <Text className="text-2xl font-semibold">
          {TITLE.RESET_PASSWORD_TITLE}
        </Text>
        <SpaceComponent height={10} />
        <Text className="text-[16px] font-normal leading-6 text-text-gray">
          {TITLE.RESET_PASSWORD_DESCRIPTION}
        </Text>
      </SectionComponent>
      <SpaceComponent height={25} />
      <SectionComponent rootClassName="w-full mb-20">
        <Formik
          initialValues={{
            password: "",
            confirmPassword: "",
          }}
          validationSchema={() => handler.validationChangePasswordSchema}
          onSubmit={handler.handleChangePassword}
        >
          {({ handleSubmit }) => (
            <>
              <SectionComponent rootClassName="w-full">
                <InputComponent
                  name={FORM_NAME.PASSWORD}
                  label={LABEL.PASSWORD}
                  placeholder={TITLE.ENTER_PASSWORD}
                  labelClass="text-[15px] font-medium"
                  isPrivate
                />
                <SpaceComponent height={5} />
                <InputComponent
                  name={FORM_NAME.CONFIRM_PASSWORD}
                  label={LABEL.CONFIRM_PASSWORD}
                  placeholder={TITLE.CONFIRM_PASSWORD}
                  labelClass="text-[15px] font-medium"
                  isPrivate
                />
              </SectionComponent>
              <SpaceComponent height={10} />
              <TouchableOpacity
                className="w-full flex-row items-center justify-center rounded-lg bg-primary p-3"
                onPress={() => handleSubmit()}
              >
                <Text className="text-center text-[16px] font-bold text-superlight">
                  {BUTTON.CHANGE_PASSWORD}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
};

export default SetNewPassword;
