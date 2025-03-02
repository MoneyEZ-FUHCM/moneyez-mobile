import { SafeAreaViewCustom, SectionComponent } from "@/components";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import TEXT_TRANSLATE_INVITE_MEMBER from "./InviteMember.translate";
import INVITE_MEMBER_CONSTANTS from "./InviteMember.constants";

const InviteMember = () => {
  const members = INVITE_MEMBER_CONSTANTS.MEMBERS;

  return (
    <SafeAreaViewCustom>
      <SectionComponent rootClassName="flex-row justify-between items-center h-14 px-4">
        <TouchableOpacity onPress={router.back}>
          <AntDesign name="arrowleft" size={24} color="#000000" />
        </TouchableOpacity>
        <View className="flex-row items-center gap-1">
          <Text className="text-lg font-bold text-black">
            {TEXT_TRANSLATE_INVITE_MEMBER.INVITE_MEMBER.HEADER}
          </Text>
        </View>
        <TouchableOpacity></TouchableOpacity>
      </SectionComponent>
      <View className="mx-4 mb-4 flex-row justify-between">
        <TouchableOpacity
          className="flex flex-1 items-center rounded-lg bg-white p-3"
          onPress={() =>
            router.navigate(PATH_NAME.MEMBER.INVITE_MEMBER_BY_EMAIL as any)
          }
        >
          <Text className="text-sm font-semibold">
            {TEXT_TRANSLATE_INVITE_MEMBER.INVITE_MEMBER.INVITE_BY_EMAIL}
          </Text>
          <View className="flex-row pt-2">
            <View className="h-5 w-5 items-center justify-center rounded-full bg-primary">
              <AntDesign name="arrowright" size={12} color="#ffffff" />
            </View>
          </View>
        </TouchableOpacity>
        <View className="ml-2 flex flex-1 items-center rounded-lg bg-white p-3">
          <Text className="text-sm font-semibold">
            {TEXT_TRANSLATE_INVITE_MEMBER.INVITE_MEMBER.JOIN_LINK}
          </Text>
          <View className="flex-row pt-2">
            <View className="h-5 w-5 items-center justify-center rounded-full bg-primary">
              <AntDesign name="arrowright" size={12} color="#ffffff" />
            </View>
          </View>
        </View>
      </View>

      {/* Danh sách thành viên */}
      <Text className="text-md mb-2 ml-4 font-bold">
        {TEXT_TRANSLATE_INVITE_MEMBER.INVITE_MEMBER.MEMBER_LIST(
          INVITE_MEMBER_CONSTANTS.MEMBERS.length,
        )}
      </Text>

      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mb-2 flex-row items-center justify-between rounded-lg bg-white p-4">
            <View className="flex-row items-center">
              <Image
                source={{ uri: item.avatar }}
                className="h-12 w-12 rounded-full"
              />
              <View className="ml-3">
                {item.isOwner && (
                  <Text className="text-xs text-gray-500">
                    {TEXT_TRANSLATE_INVITE_MEMBER.INVITE_MEMBER.OWNER}
                  </Text>
                )}
                <Text className="text-base font-semibold">{item.name}</Text>
                <Text className="text-gray-500">{item.phone}</Text>
              </View>
            </View>
            <View>
              <Text className="text-xs text-gray-500">Đã góp quỹ</Text>
              <Text className="text-base font-semibold text-black">
                {item.contribution}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaViewCustom>
  );
};

export default InviteMember;
