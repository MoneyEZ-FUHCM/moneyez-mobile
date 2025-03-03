import {
  FlatListCustom,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import AntDesign from "@expo/vector-icons/build/AntDesign";
import { router } from "expo-router";
import React from "react";
import { View, Text, TextInput, Image, TouchableOpacity } from "react-native";
import INVITE_MEMBER_CONSTANTS from "../InviteMember.constant";
import INVITE_MEMBER_TEXT_TRANSLATE from "../InviteMember.translate";
import useInviteMember from "../hooks/UseInviteMember";

const InviteMemberByEmail = () => {
  const { state, handler } = useInviteMember();
  const { search, filteredUsers, searchInitiated } = state;
  const { handleSearch } = handler;

  return (
    <SafeAreaViewCustom>
      <SectionComponent rootClassName="flex-row justify-between items-center h-14 px-4">
        <TouchableOpacity onPress={router.back}>
          <AntDesign name="arrowleft" size={24} color="#000000" />
        </TouchableOpacity>
        <View className="flex-row items-center gap-1">
          <Text className="text-lg font-bold text-black">
            {INVITE_MEMBER_TEXT_TRANSLATE.INVITE_MEMBER_BY_EMAIL.HEADER}
          </Text>
        </View>
        <TouchableOpacity></TouchableOpacity>
      </SectionComponent>

      {/* Search Box */}
      <View className="mx-4 mt-3 flex-row items-center rounded-lg bg-white p-3">
        <AntDesign name="search1" size={20} color="gray" />
        <TextInput
          className="ml-2 flex-1 text-base"
          placeholder={
            INVITE_MEMBER_TEXT_TRANSLATE.INVITE_MEMBER_BY_EMAIL
              .SEARCH_PLACEHOLDER
          }
          value={search}
          onChangeText={handleSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <AntDesign name="close" size={20} color="gray" />
          </TouchableOpacity>
        )}
      </View>

      {/* Invite Messages */}
      <View className="mx-4 mt-3 rounded-lg bg-white p-3">
        <Text className="mb-2 text-sm font-semibold">
          {
            INVITE_MEMBER_TEXT_TRANSLATE.INVITE_MEMBER_BY_EMAIL
              .INVITE_MESSAGE_TITLE
          }
        </Text>
        <View className="flex-row flex-wrap">
          {INVITE_MEMBER_CONSTANTS.INVITE_MESSAGES.map((msg, index) => (
            <TouchableOpacity
              key={index}
              className="mb-2 mr-2 rounded-full bg-pink-100 px-3 py-1"
            >
              <Text className="font-semibold text-pink-600">{msg}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text className="mt-2 text-sm text-gray-600">
          {
            INVITE_MEMBER_TEXT_TRANSLATE.INVITE_MEMBER_BY_EMAIL
              .INVITE_MESSAGE_NOTE
          }
        </Text>
      </View>

      {filteredUsers.length > 0 ? (
        <FlatListCustom
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="flex-row items-center p-3">
              <Image
                source={{ uri: item.avatar }}
                className="h-12 w-12 rounded-full"
              />
              <Text className="ml-3 text-base">{item.name}</Text>
            </View>
          )}
        />
      ) : (
        searchInitiated && (
          <View className="mt-5 flex-1 items-center justify-center">
            <AntDesign name="frowno" size={40} color="gray" />

            <Text className="mt-2 text-lg font-bold text-black">
              {INVITE_MEMBER_TEXT_TRANSLATE.INVITE_MEMBER_BY_EMAIL.NO_RESULTS}
            </Text>
          </View>
        )
      )}
    </SafeAreaViewCustom>
  );
};

export default InviteMemberByEmail;
