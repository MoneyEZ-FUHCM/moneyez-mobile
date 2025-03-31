import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaViewCustom, SectionComponent } from "@/components";

export default function FundContributionRequest() {
  const PRIMARY_COLOR = "#609084";

  const handleGoBack = () => {
    // Logic to handle back navigation
  };

  return (
    <SafeAreaViewCustom rootClassName="relative bg-[#fafafa]">
      {/* HEADER */}
      <SectionComponent rootClassName="relative bg-white shadow-md h-14 flex-row items-center justify-center">
        <TouchableOpacity
          onPress={handleGoBack}
          className="absolute left-3 rounded-full p-2"
        >
          <AntDesign name="close" size={24} color={PRIMARY_COLOR} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-primary">
          Fund Contribution Request
        </Text>
        <TouchableOpacity className="absolute right-3 rounded-full p-2">
          <AntDesign name="reload1" size={24} color={PRIMARY_COLOR} />
        </TouchableOpacity>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
}
