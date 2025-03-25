import { SafeAreaViewCustom, SectionComponent } from "@/components";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-paper";
import TEXT_TRANSLATE_GROUP_MEMBER_DEFAULT from "./GroupMember.translate";
import useGroupMember from "./hooks/useGroupMember";

const GroupMember = () => {
  const { TITLE, TEXT, BUTTON } = TEXT_TRANSLATE_GROUP_MEMBER_DEFAULT;
  const { state, handler } = useGroupMember();

  return (
    <SafeAreaViewCustom>
      <SectionComponent rootClassName="flex-row justify-between items-center h-14 px-4">
        <TouchableOpacity></TouchableOpacity>
        <View className="flex-row items-center gap-1">
          <Text className="text-lg font-bold text-black">{TITLE}</Text>
        </View>
        <TouchableOpacity></TouchableOpacity>
      </SectionComponent>
      <ScrollView
        className="flex-1 bg-gray-100"
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={{
            uri: "https://img.freepik.com/free-vector/family-couple-saving-money_74855-5240.jpg?t=st=1740372328~exp=1740375928~hmac=155741d254352afefdffac627bb458ff24c19578a137b14276b11ab53c20393f&w=2000",
          }}
          className="relative h-52 w-full"
        ></ImageBackground>
        <View className="mx-4 -mt-8 rounded-2xl bg-white p-4 shadow-md">
          <Text className="mb-2 font-semibold">{TEXT.CONTACT}</Text>
          <View className="mb-4 flex-row items-center rounded-xl border border-gray-300 px-4 py-3">
            <Image
              source={{
                uri: "https://fn.vinhphuc.edu.vn/UploadImages/mnhoihop/admin/anh-la-co-viet-nam-dep-1.png",
              }}
              className="mr-4 h-6 w-6"
            />
            <TextInput placeholder={TEXT.ENTER_EMAIL} className="flex-1" />
            <TouchableOpacity>
              <AntDesign name="plus" size={24} color="gray" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="mx-4 mt-4 rounded-2xl bg-white p-4 shadow-md">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="font-semibold">{TEXT.CONTACT_FROM_CONTACTS}</Text>
            <TouchableOpacity>
              <Text className="text-blue-500">{TEXT.VIEW_MORE}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal className="mb-6">
            <View className="mr-4 items-center">
              <TouchableOpacity
                className="h-16 w-16 items-center justify-center rounded-full bg-gray-200"
                onPress={() =>
                  router.navigate(PATH_NAME.MEMBER.INVITE_MEMBER as any)
                }
              >
                <AntDesign name="plus" size={30} color="#007bff" />
              </TouchableOpacity>
              <Text className="mt-2 text-xs">{BUTTON.ADD_NEW_MEMBER}</Text>
            </View>
            {state.contactList?.map((item, index) => (
              <View key={index} className="mr-4 items-center">
                <TouchableOpacity className="h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                  <Image
                    source={{
                      uri: `https://i.pravatar.cc/150?img=${index + 2}`,
                    }}
                    className="h-full w-full rounded-full"
                  />
                </TouchableOpacity>
                <Text className="mt-2 text-xs">{item}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <View className="mx-4 mt-4 rounded-2xl bg-white p-4 shadow-md">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="font-semibold">{TEXT.CURRENT_GROUP}</Text>
            <TouchableOpacity>
              <Text className="text-blue-500">{TEXT.VIEW_MORE}</Text>
            </TouchableOpacity>
          </View>
          {state.recentActivities?.map((member, index) => (
            <View key={index} className="mb-3 flex-row items-center">
              <Image
                source={{
                  uri: member.avatar,
                }}
                className="h-12 w-12 rounded-full"
              />
              <View className="ml-3 flex-1">
                <Text className="font-semibold">{member.name}</Text>
                <Text className="text-xs text-gray-500">{member.email}</Text>
              </View>
              {member.isOwner && (
                <AntDesign name="star" size={20} color="#FFD700" />
              )}
            </View>
          ))}
        </View>
        <View className="mx-4 mt-4 rounded-2xl bg-superlight p-4 shadow-md">
          <Text className="mb-2 font-semibold">{TEXT.GROUP_REMINDER}</Text>
          <TouchableOpacity
            className="flex-row items-center justify-between rounded-lg bg-white px-2 py-3"
            onPress={() =>
              router.navigate(PATH_NAME.GROUP_HOME.CREATE_FUND as any)
            }
          >
            <View className="flex-row items-center">
              <View className="flex-1 flex-row items-center">
                <Icon source="piggy-bank" size={28} color="#609084" />
                <Text className="ml-2 font-medium">{TEXT.CREATE_FUND}</Text>
              </View>
              <AntDesign name="right" size={16} color="gray" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.navigate(PATH_NAME.MEMBER.GROUP_FUND as any)}
            className="mt-2 flex-row items-center justify-between rounded-lg bg-white px-2 py-3"
          >
            <View className="flex-row items-center">
              <AntDesign name="clockcircleo" size={28} color="#609084" />
              <Text className="ml-2 font-medium">
                {TEXT.SET_RECURRING_REMINDER}
              </Text>
            </View>
            <AntDesign name="right" size={16} color="gray" />
          </TouchableOpacity>
        </View>

        <View className="z-10 mx-4 mb-24 mt-4 rounded-2xl bg-white shadow-md">
          <View className="flex-row gap-0">
            <TouchableOpacity
              className={`flex-1 rounded-[15px_0_0_0] px-4 py-2 ${
                state.selectedTab === "contribution"
                  ? "bg-primary"
                  : "bg-[#E8F5E9]"
              }`}
              onPress={() => handler.setSelectedTab("contribution")}
            >
              <Text
                className={`text-center font-bold ${
                  state.selectedTab === "contribution"
                    ? "text-white"
                    : "text-primary"
                }`}
              >
                {TEXT.CONTRIBUTION}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 rounded-[0_15px_0_0] px-4 py-2 ${
                state.selectedTab === "done" ? "bg-primary" : "bg-[#E8F5E9]"
              }`}
              onPress={() => handler.setSelectedTab("done")}
            >
              <Text
                className={`text-center font-bold ${
                  state.selectedTab === "done" ? "text-white" : "text-primary"
                }`}
              >
                {TEXT.DONE}
              </Text>
            </TouchableOpacity>
          </View>
          <View className="px-4 pb-4">
            <View className="flex-row items-center">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-light">
                <Icon source="piggy-bank" size={28} color="#609084" />
              </View>
              <View className="flex-start flex-1 rounded-lg p-2">
                <Text className="ml-2 font-semibold">{TEXT.REMINDER}</Text>
                <TextInput
                  placeholder={TEXT.REMINDER_TEXT}
                  className="mb-3 rounded-lg border border-gray-300 p-2 text-xs text-gray-500"
                />
              </View>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="my-1 text-xs text-gray-600">
                  {TEXT.CONTRIBUTION_AMOUNT}
                </Text>
                <View className="mr-2 h-2 w-full rounded-full bg-gray-200">
                  <View className="h-2 w-3/4 rounded-full bg-primary" />
                </View>
              </View>
              <TouchableOpacity className="ml-2 items-center rounded-md bg-primary px-3 py-1">
                <Text className="text-sm font-semibold text-white">
                  {TEXT.CONTRIBUTE}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaViewCustom>
  );
};

export default GroupMember;
