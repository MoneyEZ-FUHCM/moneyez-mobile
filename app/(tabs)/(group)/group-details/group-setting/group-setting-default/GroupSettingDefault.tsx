import { SafeAreaViewCustom, SectionComponent } from "@/components";
import React from "react";
import { Pressable, Text, View } from "react-native";
import TEXT_TRANSLATE_GROUP_SETTINGS from "./GroupSettingDefault.translate";
import useGroupSettings from "./hooks/useGroupSettingDefault";
import { MaterialIcons } from "@expo/vector-icons";

export default function GroupSettingsDefault() {
  const { handler } = useGroupSettings();

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-[#f9f9f9]">
      {/* HEADER */}
      <SectionComponent rootClassName="h-14 bg-white justify-center items-center relative">
        <Text className="text-center text-lg font-bold">
          {TEXT_TRANSLATE_GROUP_SETTINGS.TITLE.HEADER}
        </Text>
      </SectionComponent>

      {/* Content */}
      <View className="space-y-2 p-4">
        <SectionComponent rootClassName="bg-white rounded-xl shadow-sm">
          <Pressable
            onPress={handler.handleEditGroupInfo}
            className="flex-row items-center px-4 py-3"
          >
            <View className="mr-4 h-10 w-10 items-center justify-center rounded-full">
              <MaterialIcons name="edit" size={20} color="#609084" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-medium">
                {TEXT_TRANSLATE_GROUP_SETTINGS.OPTION.EDIT_GROUP_INFO}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#9e9e9e" />
          </Pressable>
        </SectionComponent>

        <SectionComponent rootClassName="bg-white rounded-xl shadow-sm">
          <Pressable
            onPress={handler.handleUpdateContributionRate}
            className="flex-row items-center px-4 py-3"
          >
            <View className="mr-4 h-10 w-10 items-center justify-center rounded-full">
              <MaterialIcons name="percent" size={20} color="#609084" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-medium">
                {TEXT_TRANSLATE_GROUP_SETTINGS.OPTION.UPDATE_CONTRIBUTION_RATE}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#9e9e9e" />
          </Pressable>
        </SectionComponent>

        <SectionComponent rootClassName="bg-white rounded-xl shadow-sm">
          <Pressable
            onPress={handler.handleCloseGroupFund}
            className="flex-row items-center px-4 py-3"
          >
            <View className="mr-4 h-10 w-10 items-center justify-center rounded-full">
              <MaterialIcons name="delete" size={20} color="#dd6b55" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-medium">
                {TEXT_TRANSLATE_GROUP_SETTINGS.OPTION.CLOSE_GROUP_FUND}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#9e9e9e" />
          </Pressable>
        </SectionComponent>
      </View>
    </SafeAreaViewCustom>
  );
}
