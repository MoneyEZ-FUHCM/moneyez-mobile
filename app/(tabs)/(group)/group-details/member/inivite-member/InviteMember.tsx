<<<<<<< HEAD
import { SafeAreaViewCustom, SectionComponent } from "@/components";
=======
import {
  FlatListCustom,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
>>>>>>> 22cc4ef35538064a218ff85ccfe9e6e636b0f616
import { PATH_NAME } from "@/helpers/constants/pathname";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
<<<<<<< HEAD
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { MEMBERS } from "./InviteMember.constants";
import TEXT_TRANSLATE_INVITE_MEMBER from "./InviteMember.translate";

const InviteMember = () => {
  const members = MEMBERS;
=======
import { Image, Text, TouchableOpacity, View } from "react-native";
import INVITE_MEMBER_CONSTANTS from "./InviteMember.constant";
import TEXT_TRANSLATE_INVITE_MEMBER from "./InviteMember.translate";
import useInviteMember from "./hooks/useInviteMember";

const InviteMember = () => {
  const members = INVITE_MEMBER_CONSTANTS.MEMBERS;
  const { state, handler } = useInviteMember();
>>>>>>> 22cc4ef35538064a218ff85ccfe9e6e636b0f616

  return (
    <SafeAreaViewCustom>
      <SectionComponent rootClassName="flex-row justify-between items-center h-14 px-4">
<<<<<<< HEAD
        <TouchableOpacity onPress={router.back}>
=======
        <TouchableOpacity onPress={handler.handleBack}>
>>>>>>> 22cc4ef35538064a218ff85ccfe9e6e636b0f616
          <AntDesign name="arrowleft" size={24} color="#000000" />
        </TouchableOpacity>
        <View className="flex-row items-center gap-1">
          <Text className="text-lg font-bold text-black">
<<<<<<< HEAD
            {TEXT_TRANSLATE_INVITE_MEMBER.HEADER}
=======
            {TEXT_TRANSLATE_INVITE_MEMBER.INVITE_MEMBER.HEADER}
>>>>>>> 22cc4ef35538064a218ff85ccfe9e6e636b0f616
          </Text>
        </View>
        <TouchableOpacity></TouchableOpacity>
      </SectionComponent>
      <View className="mx-4 mb-4 flex-row justify-between">
        <TouchableOpacity
          className="flex flex-1 items-center rounded-lg bg-white p-3"
<<<<<<< HEAD
          onPress={() =>
            router.navigate(PATH_NAME.MEMBER.INVITE_MEMBER_BY_EMAIL as any)
          }
        >
          <Text className="text-sm font-semibold">
            {TEXT_TRANSLATE_INVITE_MEMBER.INVITE_BY_EMAIL}
=======
          onPress={() => {
            router.navigate(PATH_NAME.MEMBER.INVITE_MEMBER_BY_EMAIL as any);
          }}
        >
          <Text className="text-sm font-semibold">
            {TEXT_TRANSLATE_INVITE_MEMBER.INVITE_MEMBER.INVITE_BY_EMAIL}
>>>>>>> 22cc4ef35538064a218ff85ccfe9e6e636b0f616
          </Text>
          <View className="flex-row pt-2">
            <View className="h-5 w-5 items-center justify-center rounded-full bg-primary">
              <AntDesign name="arrowright" size={12} color="#ffffff" />
            </View>
          </View>
        </TouchableOpacity>
        <View className="ml-2 flex flex-1 items-center rounded-lg bg-white p-3">
          <Text className="text-sm font-semibold">
<<<<<<< HEAD
            {TEXT_TRANSLATE_INVITE_MEMBER.JOIN_LINK}
=======
            {TEXT_TRANSLATE_INVITE_MEMBER.INVITE_MEMBER.JOIN_LINK}
>>>>>>> 22cc4ef35538064a218ff85ccfe9e6e636b0f616
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
<<<<<<< HEAD
        {TEXT_TRANSLATE_INVITE_MEMBER.MEMBER_LIST(MEMBERS.length)}
      </Text>

      <FlatList
=======
        {TEXT_TRANSLATE_INVITE_MEMBER.INVITE_MEMBER.MEMBER_LIST(
          INVITE_MEMBER_CONSTANTS.MEMBERS.length,
        )}
      </Text>

      <FlatListCustom
>>>>>>> 22cc4ef35538064a218ff85ccfe9e6e636b0f616
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
<<<<<<< HEAD
                    {TEXT_TRANSLATE_INVITE_MEMBER.OWNER}
=======
                    {TEXT_TRANSLATE_INVITE_MEMBER.INVITE_MEMBER.OWNER}
>>>>>>> 22cc4ef35538064a218ff85ccfe9e6e636b0f616
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
