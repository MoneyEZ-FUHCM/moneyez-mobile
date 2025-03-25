import { SafeAreaViewCustom, SectionComponent } from "@/components";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RECENT_ACTIVITIES from "./GroupHomeDefault.constant";
import TEXT_TRANSLATE_GROUP_HOME_DEFAULT from "./GroupHomeDefault.translate";
import useGroupHomeDefault from "./hooks/useGroupHomeDefault";

const GroupHomeDefault = () => {
  const { TITLE, BUTTON, TEXT } = TEXT_TRANSLATE_GROUP_HOME_DEFAULT;
  const recentActivities = RECENT_ACTIVITIES;
  const { state, handler } = useGroupHomeDefault();

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
        <View className="mx-4 mt-8 rounded-2xl bg-white p-4 shadow-md">
          <Text className="text-lg font-bold">{TEXT.FUND_OVERVIEW}</Text>
          <Text className="text-2xl font-bold text-gray-800">
            {TEXT.FUND_AMOUNT}
          </Text>
          <Text className="text-gray-500">{TEXT.FUND_GOAL}</Text>
          <View className="mt-4 flex-row justify-between">
            <TouchableOpacity
              className="mx-1 flex-1 flex-row items-center justify-center rounded-full bg-thirdly/70 px-4 py-2 "
              onPress={handler.handleCreateFundRequest}
            >
              <AntDesign name="plus" size={16} color="#609084" />
              <Text className="ml-2 text-base font-bold text-[#609084]">
                {BUTTON.CONTRIBUTE}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="mx-1 flex-1 flex-row items-center justify-center rounded-full bg-thirdly/70 px-4 py-2"
            >
              <AntDesign name="swap" size={16} color="#609084" />
              <Text className="ml-2 text-base font-bold text-[#609084]">
                {BUTTON.WITHDRAW}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="mx-4 mt-4 flex-row justify-around rounded-2xl bg-white p-4 shadow-md">
          <TouchableOpacity
            className="items-center"
            onPress={() =>
              router.push(
                PATH_NAME.GROUP.CREATE_FUND_CONTRIBUTION_REQUEST as any,
              )
            }
          >
            <AntDesign name="wallet" size={24} color="#5F8575" />
            <Text className="mt-1 font-bold text-primary">Nhắc góp quỹ</Text>
          </TouchableOpacity>

          {/* Thống kê */}
          <TouchableOpacity className="items-center">
            <AntDesign name="linechart" size={24} color="#5F8575" />
            <Text className="mt-1 font-bold text-primary">Thống kê</Text>
          </TouchableOpacity>
        </View>
        {/* Recent Activities */}
        <View className="z-10 mx-4 mt-4 rounded-2xl bg-white p-4 shadow-md">
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
        {/* Recent Activities */}
        <View className="z-10 mx-4 mb-24 mt-4 rounded-2xl bg-white p-4 shadow-md">
          <Text className="mb-4 text-lg font-bold">{TEXT.EDIT_LOG}</Text>
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
                <View className="flex-row">
                  <Text className="mt-3 font-bold">{activity.name}</Text>
                  <Text className="mt-3"> {TEXT.LEFT_GROUP}</Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-xs text-gray-500">{activity.date}</Text>
                <Text className="text-xs text-gray-500">20:00</Text>
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
