import { SafeAreaViewCustom, SectionComponent } from "@/components";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Image,
} from "react-native";
import TEXT_TRANSLATE_GROUP_HOME_DEFAULT from "./GroupHomeDefault.translate";
import RECENT_ACTIVITIES from "./GroupHomeDefault.constant";
import { PATH_NAME } from "@/helpers/constants/pathname";

const GroupHomeDefault = () => {
  const { TITLE, BUTTON, TEXT } = TEXT_TRANSLATE_GROUP_HOME_DEFAULT;
  const recentActivities = RECENT_ACTIVITIES;

  return (
    <SafeAreaViewCustom>
      <SectionComponent rootClassName="flex-row justify-between items-center h-14 px-4">
        <TouchableOpacity onPress={router.back}>
          <AntDesign name="arrowleft" size={24} color="#000000" />
        </TouchableOpacity>
        <View className="flex-row items-center gap-1">
          <Text className="text-lg font-bold text-black">
            {TITLE.GROUP_FUNDS}
          </Text>
        </View>
        <TouchableOpacity></TouchableOpacity>
      </SectionComponent>
      <ScrollView className="flex-1 bg-gray-100">
        {/* Header */}
        <ImageBackground
          source={{
            uri: "https://static.tnex.com.vn/uploads/2022/12/word-image-11078-6.jpeg",
          }}
          className="relative h-52 w-full"
        ></ImageBackground>

        {/* Fund Overview Card */}
        <View className="mx-4 -mt-8 rounded-2xl bg-white p-4 shadow-md">
          <Text className="text-lg font-bold">{TEXT.FUND_OVERVIEW}</Text>
          <Text className="text-2xl font-bold text-gray-800">
            {TEXT.FUND_AMOUNT}
          </Text>
          <Text className="text-gray-500">{TEXT.FUND_GOAL}</Text>
          <View className="mt-4 flex-row justify-between">
            <TouchableOpacity className="mx-1 flex-1 flex-row items-center justify-center rounded-full bg-thirdly/70 px-4 py-2">
              <AntDesign name="plus" size={16} color="#609084" />
              <Text className="ml-2 text-base font-bold text-[#609084]">
                {BUTTON.CONTRIBUTE}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="mx-1 flex-1 flex-row items-center justify-center rounded-full bg-thirdly/70 px-4 py-2">
              <AntDesign name="swap" size={16} color="#609084" />
              <Text className="ml-2 text-base font-bold text-[#609084]">
                {BUTTON.WITHDRAW}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="mx-4 mt-4 rounded-2xl bg-white p-4 shadow-md">
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <AntDesign name="wallet" size={24} color="orange" />
              <Text className="ml-2 text-[14px] font-normal">
                {TEXT.AUTO_SAVE}
              </Text>
            </View>
            <TouchableOpacity className="rounded-[10px] border border-gray-300 bg-white px-4 py-1">
              <Text className="text-sm font-bold text-black">
                {BUTTON.ACTIVATE}
              </Text>
            </TouchableOpacity>
          </View>
          {/* Savings Info */}
          <View className="flex-row justify-between rounded-2xl bg-thirdly/70 p-4">
            <View className="w-1/3 items-center">
              <AntDesign name="exclamationcircleo" size={30} color="#609084" />
              <Text className="mt-2 text-sm font-bold">{TEXT.ONLY_FROM}</Text>
              <Text className="text-xs text-gray-600">{TEXT.IN_FUND}</Text>
            </View>
            <View className="w-1/3 items-center">
              <AntDesign name="linechart" size={30} color="#609084" />
              <Text className="mt-2 text-sm font-bold">{TEXT.EARN_UP_TO}</Text>
              <Text className="text-xs text-gray-600">{TEXT.PER_YEAR}</Text>
            </View>
            <View className="w-1/3 items-center">
              <AntDesign name="creditcard" size={30} color="#609084" />
              <Text className="mt-2 text-[12px] font-bold">
                {TEXT.FLEXIBLE_PAYMENT}
              </Text>
            </View>
          </View>
        </View>
        <View className="mt-2 flex-row justify-between bg-white p-4">
          <View className="flex-row justify-between">
            <View className="w-1/3 items-center">
              <Ionicons
                name="notifications-outline"
                size={30}
                color="#609084"
              />
              <Text className="mt-2 text-center text-xs">
                {TEXT.REMIND_CONTRIBUTE}
              </Text>
            </View>
            <View className="relative w-1/3 items-center">
              <View className="absolute right-0 top-0 rounded-full bg-[#FF3B30] px-2">
                <Text className="text-xs text-white">{TEXT.NEW}</Text>
              </View>
              <Ionicons name="qr-code-outline" size={30} color="#609084" />
              <Text className="mt-2 text-center text-xs">
                {TEXT.QR_CONTRIBUTE}
              </Text>
            </View>
            <View className="w-1/3 items-center">
              <TouchableOpacity
                onPress={() =>
                  router.navigate(PATH_NAME.GROUP.STATISTICS as any)
                }
              >
                <Ionicons name="bar-chart-outline" size={30} color="#609084" />
                <Text className="mt-2 text-center text-xs">
                  {TEXT.STATISTICS}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Recent Activities */}
        <View className="z-10 mx-4 mb-24 mt-4 rounded-2xl bg-white p-4 shadow-md">
          <Text className="mb-4 text-lg font-bold">
            {TEXT.RECENT_ACTIVITIES}
          </Text>
          {recentActivities.map((activity, index) => (
            <View
              key={index}
              className="flex-row border-b border-gray-200 py-2"
            >
              <Image
                source={{ uri: activity.avatar }}
                className="h-10 w-10 rounded-full"
              />
              <View className="ml-4 flex-1">
                <Text className="font-bold text-[#609084]">
                  {activity.type}
                </Text>
                <Text className="font-bold">{activity.name}</Text>
                <Text className="text-gray-600">{activity.comment}</Text>
              </View>
              <View className="items-end">
                <Text className="text-xs text-gray-500">{activity.date}</Text>
                <Text className="font-bold">{activity.amount}</Text>
              </View>
            </View>
          ))}
          <TouchableOpacity className="mt-4 flex-row items-center justify-center">
            <Text className="pr-3 text-center font-bold text-[#609084]">
              {BUTTON.VIEW_ALL}
            </Text>
            <AntDesign name="right" size={16} color="#609084" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaViewCustom>
  );
};

export default GroupHomeDefault;
