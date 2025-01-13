import "@/globals.css";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const index = () => {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Text className="text-center text-5xl text-red-600">SplashScreen</Text>
    </SafeAreaView>
  );
};

export default index;
