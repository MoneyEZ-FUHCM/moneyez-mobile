import { SafeAreaViewCustom } from "@/components";
import { handleLogout } from "@/hooks/useLogout";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

const HomeScreen = () => {
  return (
    <SafeAreaViewCustom rootClassName=" relative">
      <TouchableOpacity
        onPress={handleLogout}
        className="flex-row items-center justify-center rounded-lg border border-stroke p-3"
      >
        <Text>Đăng xuất</Text>
      </TouchableOpacity>
    </SafeAreaViewCustom>
  );
};

export default HomeScreen;
