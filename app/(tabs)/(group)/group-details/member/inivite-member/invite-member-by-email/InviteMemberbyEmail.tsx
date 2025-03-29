import { FlatListCustom, SafeAreaViewCustom } from "@/components";
import useHideGroupTabbar from "@/hooks/useHideGroupTabbar";
import { selectUserInfo } from "@/redux/slices/userSlice";
import AntDesign from "@expo/vector-icons/build/AntDesign";
import Feather from "@expo/vector-icons/build/Feather";
import React from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import useInviteMemberByEmail from "./hooks/useInviteMemberByEmail";

const COLORS = {
  PRIMARY: "#609084",
  BACKGROUND: "#F5F5F5",
  WHITE: "#FFFFFF",
  TEXT_DARK: "#333333",
  TEXT_LIGHT: "#666666",
  BORDER: "#E0E0E0",
};

const InviteMemberByEmail: React.FC = () => {
  const { handler, state } = useInviteMemberByEmail();
  const userInfo = useSelector(selectUserInfo);

  useHideGroupTabbar();

  const ToneButton = ({
    tone,
    isSelected,
    onPress,
  }: {
    tone: (typeof state.inviteSuggestions)[0];
    isSelected: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      key={tone.id}
      onPress={onPress}
      className={`mr-2 rounded-full px-3 py-1.5 ${
        isSelected ? "bg-primary" : "bg-gray-200"
      }`}
    >
      <Text className={`text-sm ${isSelected ? "text-white" : "text-black"}`}>
        {tone.label}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View className="h-14 flex-row items-center justify-between bg-white px-4 shadow-sm">
      <TouchableOpacity onPress={() => {}} className="p-2">
        <AntDesign name="arrowleft" size={24} color={COLORS.TEXT_DARK} />
      </TouchableOpacity>
      <Text className="text-lg font-bold text-black">Mời thành viên</Text>
      <View className="w-8" />
    </View>
  );

  const renderSearchBox = () => (
    <View className="mx-4 mt-3">
      <View className="flex-row items-center rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 shadow-sm">
        <AntDesign name="search1" size={20} color={COLORS.TEXT_LIGHT} />
        <TextInput
          className="ml-3 h-8 flex-1 text-base text-black"
          placeholderTextColor={COLORS.TEXT_LIGHT}
          placeholder="Tìm kiếm theo tên hoặc email"
          onChangeText={handler.handleSearch}
          value={state.searchUserQuery}
        />
        {state.searchUserQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => handler.handleSearch("")}
            className="p-1"
          >
            <AntDesign name="close" size={20} color={COLORS.TEXT_LIGHT} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderToneButtons = () => (
    <View className="mx-4 mt-3 bg-white p-3">
      <Text className="mb-2 text-base font-bold">Chọn lời mời vào nhóm</Text>
      <View className="flex-row">
        {state.inviteSuggestions.map((tone) => (
          <ToneButton
            key={tone.id}
            tone={tone}
            isSelected={state.selectedTone.id === tone.id}
            onPress={() => handler.setSelectedTone(tone)}
          />
        ))}
      </View>

      <View className="mt-3 rounded-xl bg-thirdly p-3">
        <Text className="text-base text-gray-700">
          {state.selectedTone.text(userInfo?.fullName || "Bạn")}
        </Text>
      </View>
    </View>
  );

  const renderSearchResults = () => (
    <View className="mx-4 flex-1">
      <Text className="mt-3 pb-2 text-base font-semibold text-black">
        Kết quả tìm kiếm
      </Text>
      {state.userInfo &&
      state.userInfo.length > 0 &&
      state.searchUserQuery.length > 0 ? (
        <FlatListCustom
          isBottomTab={state.selectedForInvite.length !== 0}
          data={state.userInfo}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View className="flex-row items-center justify-between border-t border-[#F0F0F0] bg-white px-4 py-3">
              <View className="flex-row items-center">
                <Image
                  source={{ uri: item.avatarUrl as string }}
                  className="mr-3 h-10 w-10 rounded-full"
                />
                <View>
                  <Text className="text-base font-medium text-black">
                    {item.fullName}
                  </Text>
                  <Text className="text-sm text-gray-500">{item.email}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handler.toggleInvite(item)}
                className={`rounded-full p-2 ${
                  state.selectedForInvite.includes(item.email)
                    ? "bg-[#E6F3F0]"
                    : "bg-[#F0F0F0]"
                }`}
              >
                {state.selectedForInvite.includes(item.email) ? (
                  <Feather name="minus" size={20} color={COLORS.PRIMARY} />
                ) : (
                  <Feather name="plus" size={20} color={COLORS.PRIMARY} />
                )}
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <View className="items-center justify-center border-t border-[#F0F0F0] bg-white px-4 py-14">
          <View className="mb-2 h-20 w-20 items-center justify-center rounded-full bg-gray-50">
            <Feather name="user" size={32} color="#609084" />
          </View>
          <Text className="text-center text-base text-gray-500">
            Không tìm thấy kết quả
          </Text>
        </View>
      )}
    </View>
  );

  const renderActionButton = () =>
    state.selectedForInvite.length > 0 && (
      <TouchableOpacity
        onPress={handler.handleSentInvite}
        className="mx-4 mt-2.5 items-center rounded-xl bg-[#609084] py-[14px]"
      >
        <Text className="text-base font-semibold text-white">
          Mời {state.selectedForInvite.length} thành viên
        </Text>
      </TouchableOpacity>
    );

  return (
    <SafeAreaViewCustom rootClassName="bg-gray-50 relative">
      {renderHeader()}
      <View className="flex-1">
        {renderSearchBox()}
        {renderToneButtons()}
        {renderSearchResults()}
      </View>
      <View className="absolute bottom-0 w-full bg-[#F5F5F5] pb-4">
        {renderActionButton()}
      </View>
    </SafeAreaViewCustom>
  );
};

export default InviteMemberByEmail;
