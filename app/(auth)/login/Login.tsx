import { SafeAreaViewCustom } from "@/components";
import React from "react";
import { Button, Text } from "react-native";
import useLoginScreen from "../hooks/useLoginScreen";
import HOME_SCREEN_CONSTANTS from "../AuthScreen.const";

const Login = () => {
  const { handler, state } = useLoginScreen();
  const { TITLE, BUTTON } = HOME_SCREEN_CONSTANTS;

  return (
    <SafeAreaViewCustom rootClassName="justify-center items-centers">
      <Text className="text-primary">{TITLE.LOGIN}</Text>
      <Text className="text-rose-600">{state.data}</Text>
      <Button
        title={BUTTON.BUTTON_LOGIN}
        onPress={() => handler.setData((prev) => prev + 1)}
      />
    </SafeAreaViewCustom>
  );
};

export default Login;
