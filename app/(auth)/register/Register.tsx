import { InputComponent, SectionComponent, SpaceComponent } from "@/components";
import { Formik } from "formik";
import { Calendar } from "iconsax-react-native";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import Animated, { FadeInDown, FadeOut, Layout } from "react-native-reanimated";
import { DateTimePicker } from "react-native-ui-lib";
import AUTH_SCREEN_CONSTANTS from "../AuthScreen.const";
import TEXT_TRANSLATE_AUTH from "../AuthScreen.translate";
import useLoginScreen from "../hooks/useLoginScreen";

const Register = () => {
  const { handler } = useLoginScreen();
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
          password: "",
        }}
        validationSchema={handler.loginValidationSchema}
        onSubmit={handler.handleLogin}
      >
        {({ handleSubmit }) => (
          <>
            <SectionComponent rootClassName="mb-3">
              <SectionComponent rootClassName="flex-row ">
                <InputComponent
                  name={FORM_NAME.EMAIL}
                  label={LABEL.NAME}
                  placeholder={TITLE.NAME}
                  labelClass="text-text-gray text-[12px]"
                  containerClass="flex-1"
                />
                <SpaceComponent width={15}></SpaceComponent>
                <InputComponent
                  name={FORM_NAME.EMAIL}
                  label={LABEL.FIRST_NAME}
                  placeholder={TITLE.FIRST_NAME}
                  labelClass="text-text-gray text-[12px]"
                  containerClass="flex-1"
                />
              </SectionComponent>
              <SpaceComponent height={5}></SpaceComponent>
              <InputComponent
                name={FORM_NAME.EMAIL}
                label={LABEL.EMAIL}
                placeholder={TITLE.ENTER_EMAIL}
                labelClass="text-text-gray text-[12px]"
              />
              <SpaceComponent height={5}></SpaceComponent>
              <SectionComponent rootClassName="mb-5">
                <Text className="mb-1 text-[12px] text-text-gray">
                  {LABEL.DOB}
                </Text>
                <TouchableOpacity className="h-10 flex-row items-center justify-between overflow-hidden rounded-md border border-gray-300 px-3">
                  <DateTimePicker
                    placeholder={TITLE.DOB}
                    mode={"date"}
                    className="w-[300px]"
                  />
                  <Calendar size="20" color="#609084" />
                </TouchableOpacity>
              </SectionComponent>
              <SpaceComponent height={5}></SpaceComponent>
              <InputComponent
                name={FORM_NAME.EMAIL}
                label={LABEL.PHONE_NUMBER}
                placeholder={TITLE.PHONE_NUMBER}
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
