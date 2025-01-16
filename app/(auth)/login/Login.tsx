import LogoApp from "@/assets/images/logo/logo_app.png";
import LogoGoogle from "@/assets/images/logo/logo_google.png";
import {
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import InputComponent from "@/components/InputComponent";
import LoadingWrapper from "@/components/LoadingWrapper";
import { Formik } from "formik";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Checkbox } from "react-native-ui-lib";
import AUTH_SCREEN_CONSTANTS from "../AuthScreen.const";
import TEXT_TRANSLATE_AUTH from "../AuthScreen.translate";
import useLoginScreen from "../hooks/useLoginScreen";

const Login = () => {
  const { handler, state } = useLoginScreen();
  const { BUTTON, TITLE, LABEL } = TEXT_TRANSLATE_AUTH;
  const { FORM_NAME } = AUTH_SCREEN_CONSTANTS;

  return (
    <LoadingWrapper isLoading={state.isLoading}>
      <SafeAreaViewCustom
        rootClassName={`justify-center items-centers mx-10 mb-10`}
      >
        <SectionComponent rootClassName="flex-row justify-center">
          <Image source={LogoApp} resizeMode="contain" />
        </SectionComponent>
        <Text className="my-3 text-center text-gray-500">
          {TITLE.WELCOME_BACK}
        </Text>
        <SectionComponent rootClassName="bg-[#ececec]  h-9 flex-row justify-between items-center  rounded-md mb-6">
          <SectionComponent
            rootClassName={`${state.isLogin && "bg-superlight"}  flex-1 mx-1 rounded-md`}
          >
            <TouchableOpacity onPress={() => handler.setIsLogin(true)}>
              <Text
                className={`text-center text-text-gray ${state.isLogin && "py-1 font-semibold text-primary"}`}
              >
                {BUTTON.BUTTON_LOGIN}
              </Text>
            </TouchableOpacity>
          </SectionComponent>
          <SectionComponent
            rootClassName={`${!state.isLogin && "bg-superlight"}  flex-1 mx-1 rounded-md`}
          >
            <TouchableOpacity onPress={() => handler.setIsLogin(false)}>
              <Text
                className={`py-1 text-center text-text-gray ${!state.isLogin && "font-semibold text-primary"}`}
              >
                {BUTTON.BUTTON_REGISTER}
              </Text>
            </TouchableOpacity>
          </SectionComponent>
        </SectionComponent>
        {state.isLogin ? (
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
                <SectionComponent rootClassName="flex-row justify-between mt-2 mb-3">
                  <TouchableOpacity
                    className="flex-row items-center"
                    onPress={() => handler.setIsChecked(!state.isChecked)}
                  >
                    <Checkbox
                      value={state.isChecked}
                      onValueChange={handler.setIsChecked}
                      color="#609084"
                      className="mx-2 rounded-[3px]"
                      size={15}
                    />
                    <Text className="text-[12px] text-text-gray">
                      {BUTTON.REMEMBER_ME}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
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
                      {BUTTON.BUTTON_LOGIN}
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
                      {BUTTON.BUTTON_LOGIN_WITH_GOOGLE}
                    </Text>
                  </TouchableOpacity>
                </SectionComponent>
              </>
            )}
          </Formik>
        ) : (
          ""
        )}
      </SafeAreaViewCustom>
    </LoadingWrapper>
  );
};

export default Login;
