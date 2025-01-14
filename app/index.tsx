import { SafeAreaViewCustom } from "@/components";
import "@/globals.css";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { router } from "expo-router";
import React from "react";
import { Button, Text } from "react-native";

const index = () => {
  const { AUTH } = PATH_NAME;
  return (
    <SafeAreaViewCustom rootClassName="bg-red-500 items-center justify-center ">
      <Text className="text-center text-5xl text-yellow-600">SplashScreen</Text>
      <Button
        title="Chuyển trang"
        onPress={() => router.navigate(AUTH.LOGIN as any)}
      />
    </SafeAreaViewCustom>
  );
};

export default index;
