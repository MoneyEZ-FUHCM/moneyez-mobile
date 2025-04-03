import {
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text } from "react-native";

const ActionLogHistory = () => {
  return (
    <SafeAreaViewCustom rootClassName="bg-[#fafafa]">
      <SectionComponent rootClassName="h-14 bg-white items-center justify-center relative">
        <Pressable
          // onPress={handleGoBack}
          className="absolute left-3 rounded-full p-2"
        >
          <MaterialIcons name="arrow-back" size={24} />
        </Pressable>
        <Text className="text-xl font-semibold text-black">
          Nhật kí chỉnh sửa
        </Text>
        <SpaceComponent width={24} />
      </SectionComponent>
    </SafeAreaViewCustom>
  );
};

export default ActionLogHistory;
