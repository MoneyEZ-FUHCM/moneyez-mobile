import LogoApp from "@/assets/images/logo/logo_app.png";
import LogoGoogle from "@/assets/images/logo/logo_google.png";
import {
  ButtonSwitchComponent,
  InputComponent,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";

import { PATH_NAME } from "@/helpers/constants/pathname";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useEffect } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeOut, Layout } from "react-native-reanimated";
import AUTH_SCREEN_CONSTANTS from "../AuthScreen.const";
import TEXT_TRANSLATE_AUTH from "../AuthScreen.translate";
import useLoginScreen from "../hooks/useLoginScreen";
import Register from "../register/Register";

const Login = () => {
  const { handler, state } = useLoginScreen();
  const { BUTTON, TITLE, LABEL } = TEXT_TRANSLATE_AUTH;
  const { FORM_NAME } = AUTH_SCREEN_CONSTANTS;
  const { AUTH } = PATH_NAME;

  useEffect(() => {
    handler.getToken();
  }, []);

  return (
    <SafeAreaViewCustom
      rootClassName={`justify-center items-centers px-10 bg-white`}
    >
      <Animated.View
        entering={FadeInDown.duration(500)}
        exiting={FadeOut.duration(700)}
        layout={Layout.springify().damping(20).stiffness(120)}
      >
        <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.OS === "android" ? 64 : 0}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <SectionComponent rootClassName="flex-row justify-center">
              <Image source={LogoApp} resizeMode="contain" className="h-28" />
            </SectionComponent>
            <Text className="my-3 text-center text-gray-500">
              {TITLE.WELCOME_BACK}
            </Text>
            <ButtonSwitchComponent
              buttonLoginName={BUTTON.LOGIN}
              buttonRegisterName={BUTTON.REGISTER}
              isStatusChange={state.isLogin}
              onChangeStatus={handler.setIsLogin}
            />
            {state.isLogin ? (
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
                      <SectionComponent>
                        <InputComponent
                          name={FORM_NAME.EMAIL}
                          label={LABEL.EMAIL}
                          placeholder={TITLE.ENTER_EMAIL}
                          labelClass="text-text-gray text-[12px]"
                        />
                        <SpaceComponent height={10}></SpaceComponent>
                        <InputComponent
                          name={FORM_NAME.PASSWORD}
                          label={LABEL.PASSWORD}
                          placeholder={TITLE.ENTER_PASSWORD}
                          labelClass="text-text-gray text-[12px]"
                          isPrivate
                        />
                      </SectionComponent>
                      <SectionComponent rootClassName="flex-row justify-between items-center mb-2">
                        <Pressable
                          className="flex-row items-center"
                          onPress={() => handler.setIsChecked(!state.isChecked)}
                        ></Pressable>
                        <TouchableOpacity
                          onPress={() =>
                            router.navigate(AUTH.CONFIRM_EMAIL as any)
                          }
                        >
                          <Text className="text-[12px] font-bold text-primary">
                            {BUTTON.FORGOT_PASSWORD}
                          </Text>
                        </TouchableOpacity>
                      </SectionComponent>
                      <SectionComponent rootClassName="flex-col">
                        <TouchableOpacity
                          onPress={() => handleSubmit()}
                          className="flex-row justify-center rounded-lg bg-primary p-3"
                        >
                          <Text className="text-sm font-bold text-superlight">
                            {BUTTON.LOGIN}
                          </Text>
                        </TouchableOpacity>
                        <SectionComponent rootClassName="justify-center flex-row items-center my-2">
                          <View className="h-[1px] w-full flex-1 bg-stroke" />
                          <Text className="my-2 px-3 text-[12px] text-text-gray">
                            {TITLE.OR_LOGIN_WITH}
                          </Text>
                          <View className="h-[1px] w-full flex-1 bg-stroke" />
                        </SectionComponent>
                        <TouchableOpacity
                          onPress={handler.handleLoginGoogle}
                          className="flex-row items-center justify-center rounded-lg border border-stroke p-3"
                        >
                          <Image source={LogoGoogle} className="mr-1 h-5 w-5" />
                          <Text className="text-sm text-black">
                            {BUTTON.LOGIN_WITH_GOOGLE}
                          </Text>
                        </TouchableOpacity>
                      </SectionComponent>
                    </>
                  )}
                </Formik>
              </Animated.View>
            ) : (
              <Register />
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>
    </SafeAreaViewCustom>
  );
};

export default Login;
