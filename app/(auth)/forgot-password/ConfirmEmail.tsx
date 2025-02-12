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

const ConfirmEmail = () => {
  const { handler } = useForgotPassword();
  const { TITLE, BUTTON, LABEL } = TEXT_TRANSLATE_AUTH;
  const { FORM_NAME } = AUTH_SCREEN_CONSTANTS;
  const router = useRouter();

  return (
    <SafeAreaViewCustom rootClassName="justify-center px-10 items-center bg-white relative">
      <SectionComponent rootClassName="w-full absolute left-0 top-2">
        <BackScreenButton onPress={() => router.back()} />
      </SectionComponent>
      <SectionComponent rootClassName="w-full">
        <Text className="text-2xl font-semibold">{TITLE.FORGOT_PASSWORD}</Text>
        <SpaceComponent height={10} />
        <Text className="text-[16px] font-normal text-text-gray">
          {TITLE.CONFIRM_EMAIL_DESCRIPTION}
        </Text>
      </SectionComponent>
      <SpaceComponent height={25} />
      <SectionComponent rootClassName="w-full mb-20">
        <Formik
          initialValues={{
            email: "",
          }}
          validationSchema={() => handler.validationConfirmEmailSchema}
          onSubmit={handler.handleRecoveryPassword}
        >
          {({ handleSubmit }) => (
            <>
              <SectionComponent rootClassName="w-full">
                <InputComponent
                  name={FORM_NAME.EMAIL}
                  label={LABEL.EMAIL}
                  placeholder={TITLE.ENTER_EMAIL}
                  labelClass="text-[15px] font-medium"
                />
              </SectionComponent>
              <SpaceComponent height={10} />
              <TouchableOpacity
                className="w-full flex-row items-center justify-center rounded-lg bg-primary p-3"
                onPress={() => handleSubmit()}
              >
                <Text className="text-center text-[16px] font-bold text-superlight">
                  {BUTTON.RECOVERY_PASSWORD}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
};

export default ConfirmEmail;
