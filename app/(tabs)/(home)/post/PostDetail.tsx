import {
  LoadingSectionWrapper,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import { appInfo } from "@/helpers/constants/appInfos";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import RenderHTML from "react-native-render-html";
import usePostDetail from "./hooks/usePostDetail";
import TEXT_TRANSLATE_POST from "./post.translate";
import { TouchableOpacity } from "react-native";

const PostDetail = () => {
  const { state, handler } = usePostDetail();

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-gray-50">
      {/* Header */}
      <SectionComponent rootClassName="h-14 bg-white justify-center shadow-md">
        <View className="flex-row items-center justify-between px-4">
          <TouchableOpacity
            onPress={() => handler.handleBack()}
            className="rounded-full bg-gray-50 p-2"
          >
            <MaterialIcons name="arrow-back" size={24} />
          </TouchableOpacity>
          <Text className="text-lg font-bold">
            {TEXT_TRANSLATE_POST.TITLE.POST}
          </Text>
          <View className="w-6" />
        </View>
      </SectionComponent>
      <LoadingSectionWrapper isLoading={state.isLoading}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {state.postDetail?.thumbnail && (
            <Image
              source={{ uri: state.postDetail.thumbnail }}
              className="h-56 w-full rounded-b-2xl"
              resizeMode="cover"
            />
          )}
          <View className="-mt-3 rounded-t-3xl bg-white px-5 pb-10 pt-5 shadow-sm">
            {state.postDetail?.title && (
              <Text className="mb-4 text-2xl font-semibold leading-snug text-gray-900">
                {state.postDetail.title}
              </Text>
            )}
            {state.postDetail?.content ? (
              <RenderHTML
                contentWidth={appInfo.sizes.WIDTH}
                source={{ html: state.postDetail.content }}
              />
            ) : (
              <Text className="text-base text-gray-600">
                {TEXT_TRANSLATE_POST.TITLE.NO_DATA}
              </Text>
            )}
          </View>
        </ScrollView>
      </LoadingSectionWrapper>
    </SafeAreaViewCustom>
  );
};

export default PostDetail;
