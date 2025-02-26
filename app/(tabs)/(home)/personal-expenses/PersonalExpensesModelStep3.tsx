import { SafeAreaViewCustom, SectionComponent } from "@/components";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import TEXT_TRANSLATE_PERSONAL_EXPENSES from "./PersonalExpensesModel.translate";
const PersonalExpensesModelStep3 = () => {
  return (
    <SafeAreaViewCustom>
      <SectionComponent rootClassName="flex-row justify-between items-center h-14 px-4">
        <TouchableOpacity onPress={router.back}>
          <AntDesign name="arrowleft" size={24} color="#000000" />
        </TouchableOpacity>
        <View className="flex-row items-center gap-1">
          <Text className="text-lg font-bold text-black">
            {TEXT_TRANSLATE_PERSONAL_EXPENSES.HEADER}
          </Text>
        </View>
        <TouchableOpacity>
          <Entypo size={24} color="#000000" />
        </TouchableOpacity>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
};

export default PersonalExpensesModelStep3;
