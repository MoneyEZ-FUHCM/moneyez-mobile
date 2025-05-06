import {
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { Colors } from "@/helpers/constants/color";
import AntDesign from "@expo/vector-icons/build/AntDesign";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import Animated from "react-native-reanimated";
import useInviteMemberByQRCode from "./hooks/useInviteMemberByQRCode";
import TEXT_TRANSLATE_INVITE_MEMBER_BY_QR_CODE from "./InviteMemberByQRCode.translate";

const InviteMemberByQRCode = () => {
  const { handler, state } = useInviteMemberByQRCode();

  return (
    <SafeAreaViewCustom rootClassName="bg-gray-50">
      <SectionComponent rootClassName="flex-row bg-white justify-between items-center h-16 px-6 shadow-sm">
        <TouchableOpacity
          onPress={() => router.back()}
          className="rounded-full bg-gray-50 p-2"
        >
          <AntDesign name="arrowleft" size={24} />
        </TouchableOpacity>
        <View className="flex-row items-center">
          <Text className="text-xl font-bold text-black">
            {TEXT_TRANSLATE_INVITE_MEMBER_BY_QR_CODE.HEADER_TITLE}
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </SectionComponent>
      <View className="flex-1 px-6 pt-6">
        <View className="rounded-2xl bg-white p-6 shadow-md">
          <Text className="text-lg font-semibold text-gray-800">
            {state.groupDetail?.name}
          </Text>
          <Text className="mt-2 text-sm text-gray-600">
            {state.groupDetail?.description}
          </Text>
          <View className="my-5 items-center">
            <View className="rounded-2xl bg-white p-4 shadow-lg">
              {state.isLoading ? (
                <View className="h-[290px] w-[260px] items-center justify-center">
                  <ActivityIndicator
                    size="large"
                    color={Colors.colors.primary}
                  />
                  <Text className="mt-2 text-sm text-gray-600">
                    Đang tạo mã QR...
                  </Text>
                </View>
              ) : state.qrData ? (
                <Animated.View style={state.animatedStyle}>
                  <QRCode
                    value={state.qrData}
                    size={260}
                    getRef={(c) => (state.QR_REF.current = c)}
                  />
                </Animated.View>
              ) : (
                <View className="h-[260px] w-[260px] items-center justify-center">
                  <Text className="text-gray-500">Không thể tạo mã QR</Text>
                </View>
              )}
            </View>

            {!state.isLoading && state.countdown && (
              <View className="mt-2 rounded-full bg-gray-100 px-3 py-1">
                <Text className="text-xs text-gray-700">
                  {state.countdown === "Đã hết hạn"
                    ? state.countdown
                    : `Còn lại: ${state.countdown}`}
                </Text>
              </View>
            )}
          </View>
          <Text className="mb-2 text-center text-xs text-gray-500">
            Mã QR sẽ tự động làm mới khi hết hạn
          </Text>
          <SpaceComponent height={20} />
          <View className="flex-row justify-between px-4">
            {/* <TouchableOpacity
              className="items-center"
              onPress={handler.handleCopyLink}
              disabled={state.isLoading || !state.qrDataObj}
            >
              <View
                className={`mb-2 h-14 w-14 items-center justify-center rounded-full ${state.isLoading ? "bg-gray-200" : "bg-primary/10"}`}
              >
                <AntDesign
                  name="copy1"
                  size={24}
                  color={
                    state.isLoading ? Colors.colors.gray : Colors.colors.primary
                  }
                />
              </View>
              <Text
                className={`text-xs ${state.isLoading ? "text-gray-400" : "text-gray-600"}`}
              >
                {TEXT_TRANSLATE_INVITE_MEMBER_BY_QR_CODE.COPY_LINK}
              </Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              onPress={handler.handleCreateQRCode}
              className="items-center"
              disabled={state.isLoading}
            >
              <View
                className={`mb-2 h-14 w-14 items-center justify-center rounded-full ${state.isLoading ? "bg-gray-200" : "bg-primary/10"}`}
              >
                <AntDesign
                  name="reload1"
                  size={24}
                  color={
                    state.isLoading ? Colors.colors.gray : Colors.colors.primary
                  }
                />
              </View>
              <Text
                className={`text-xs ${state.isLoading ? "text-gray-400" : "text-gray-600"}`}
              >
                Làm mới mã QR
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handler.downloadQR}
              className="items-center"
              disabled={state.isLoading || !state.qrDataObj}
            >
              <View
                className={`mb-2 h-14 w-14 items-center justify-center rounded-full ${state.isLoading ? "bg-gray-200" : "bg-primary/10"}`}
              >
                <AntDesign
                  name="download"
                  size={24}
                  color={
                    state.isLoading ? Colors.colors.gray : Colors.colors.primary
                  }
                />
              </View>
              <Text
                className={`text-xs ${state.isLoading ? "text-gray-400" : "text-gray-600"}`}
              >
                {TEXT_TRANSLATE_INVITE_MEMBER_BY_QR_CODE.DOWNLOAD_QR}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View className="px-6 pb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-14 w-full items-center justify-center rounded-xl bg-primary"
        >
          <Text className="text-base font-semibold text-white">
            {TEXT_TRANSLATE_INVITE_MEMBER_BY_QR_CODE.BUTTON}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaViewCustom>
  );
};

export default InviteMemberByQRCode;
