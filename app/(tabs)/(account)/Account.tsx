import { SafeAreaViewCustom } from "@/components";
import { handleLogout } from "@/hooks/useLogout";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

const Account = () => {
  return (
    <SafeAreaViewCustom>
      <TouchableOpacity onPress={handleLogout}>
        <Text>Đăng xuất</Text>
      </TouchableOpacity>
    </SafeAreaViewCustom>
  );
};

export default Account;
