import { InputComponent, SectionComponent, SpaceComponent } from "@/components";
import { Formik } from "formik";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import Animated, { FadeInDown, FadeOut, Layout } from "react-native-reanimated";
import AUTH_SCREEN_CONSTANTS from "../AuthScreen.const";
import TEXT_TRANSLATE_AUTH from "../AuthScreen.translate";
import useRegisterScreen from "../hooks/useRegisterScreen";

const Register = () => {
  const { handler, state } = useRegisterScreen();
  const { BUTTON, TITLE, LABEL } = TEXT_TRANSLATE_AUTH;
  const { FORM_NAME } = AUTH_SCREEN_CONSTANTS;

  return (
    <Animated.View
      entering={FadeInDown.duration(500)}
      exiting={FadeOut.duration(700)}
      layout={Layout.springify().damping(20).stiffness(120)}
    >
      <Formik
        initialValues={{
          email: "",
          fullName: "",
          password: "",
          phoneNumber: "",
          confirmPassword: "",
        }}
        validationSchema={handler.registerValidationSchema}
        onSubmit={handler.handleRegister}
      >
        {({ handleSubmit }) => (
          <>
            <SectionComponent rootClassName="mb-3">
              <InputComponent
                name={FORM_NAME.EMAIL}
                label={LABEL.EMAIL}
                placeholder={TITLE.ENTER_EMAIL}
                labelClass="text-text-gray text-[12px]"
              />
              <SpaceComponent height={5}></SpaceComponent>
              <InputComponent
                name={FORM_NAME.FULLNAME}
                label={LABEL.FULLNAME}
                placeholder={TITLE.ENTER_FULLNAME}
                labelClass="text-text-gray text-[12px]"
                inputMode="decimal"
              />
              <SpaceComponent height={5}></SpaceComponent>
              <InputComponent
                name={FORM_NAME.PHONE_NUMBER}
                label={LABEL.PHONE_NUMBER}
                placeholder={TITLE.ENTER_PHONE_NUMBER}
                labelClass="text-text-gray text-[12px]"
                inputMode="decimal"
              />
              <SpaceComponent height={5}></SpaceComponent>
              <InputComponent
                name={FORM_NAME.PASSWORD}
                label={LABEL.PASSWORD}
                placeholder={TITLE.ENTER_PASSWORD}
                labelClass="text-text-gray text-[12px]"
                isPrivate
              />
              <SpaceComponent height={5}></SpaceComponent>
              <InputComponent
                name={FORM_NAME.CONFIRM_PASSWORD}
                label={LABEL.CONFIRM_PASSWORD}
                placeholder={TITLE.CONFIRM_PASSWORD}
                labelClass="text-text-gray text-[12px]"
                isPrivate
              />
            </SectionComponent>
            <SectionComponent rootClassName="flex-col">
              <TouchableOpacity
                onPress={() => handleSubmit()}
                className="flex-row justify-center rounded-lg bg-primary p-3"
              >
                <Text className="text-sm font-bold text-superlight">
                  {BUTTON.REGISTER}
                </Text>
              </TouchableOpacity>
            </SectionComponent>
          </>
        )}
      </Formik>
    </Animated.View>
  );
};

export default Register;
