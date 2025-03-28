import { SafeAreaViewCustom, SectionComponent } from "@/components";
import useHideGroupTabbar from "@/hooks/useHideGroupTabbar";
import AntDesign from "@expo/vector-icons/build/AntDesign";
import * as FileSystem from "expo-file-system";
import { router } from "expo-router";
import React, { useRef } from "react";
import { Alert, Share, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import useInviteMemberByQRCode from "./hooks/useInviteMemberByQRCode";
import TEXT_TRANSLATE_INVITE_MEMBER_BY_QR_CODE from "./InviteMemberByQRCode.translate";

const InviteMemberByQRCode = () => {
  const { handler, state } = useInviteMemberByQRCode();
  const PRIMARY_COLOR = "#609084";
  const QR_REF = useRef<{
    toDataURL: (callback: (data: string) => void) => void;
  } | null>(null);
  const INVITE_LINK = "https://ezmoney.com.vn/daylalinhthamgianhom";

  // Chia sẻ link qua ứng dụng khác
  const shareLink = async () => {
    try {
      await Share.share({ message: INVITE_LINK });
    } catch (error) {
      console.log(TEXT_TRANSLATE_INVITE_MEMBER_BY_QR_CODE.SHARE_ERROR, error);
    }
  };

  // Tải ảnh QR
  const downloadQR = async () => {
    if (!QR_REF.current) return;

    QR_REF.current.toDataURL((data) => {
      const FILE_PATH = FileSystem.documentDirectory + "qr_code.png";
      FileSystem.writeAsStringAsync(FILE_PATH, data, {
        encoding: FileSystem.EncodingType.Base64,
      })
        .then(() => {
          Alert.alert(
            TEXT_TRANSLATE_INVITE_MEMBER_BY_QR_CODE.DOWNLOAD_SUCCESS,
            TEXT_TRANSLATE_INVITE_MEMBER_BY_QR_CODE.DOWNLOAD_SUCCESS_MESSAGE,
          );
        })
        .catch((error) => {
          console.error(
            TEXT_TRANSLATE_INVITE_MEMBER_BY_QR_CODE.DOWNLOAD_ERROR,
            error,
          );
        });
    });
  };
  useHideGroupTabbar();

  return (
    <SafeAreaViewCustom rootClassName="bg-gray-50">
      <SectionComponent rootClassName="flex-row bg-white justify-between items-center h-16 px-6 shadow-sm">
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#000000" />
        </TouchableOpacity>
        <View className="flex-row items-center">
          <Text className="text-lg font-bold text-black">
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
          <View className="my-8 items-center">
            <View className="rounded-2xl bg-white p-4 shadow-lg">
              <QRCode
                value={state.groupDetail?.description}
                size={230}
                getRef={(c) => (QR_REF.current = c)}
              />
            </View>
          </View>
          <Text className="mb-4 text-center text-xs text-gray-500">
            {TEXT_TRANSLATE_INVITE_MEMBER_BY_QR_CODE.QR_CODE_REFRESH}
          </Text>
          <TouchableOpacity className="mb-6 rounded-xl bg-gray-50 p-4">
            <Text
              className="text-center font-medium text-primary"
              numberOfLines={1}
            >
              {INVITE_LINK}
            </Text>
          </TouchableOpacity>
          <View className="flex-row justify-between px-4">
            <TouchableOpacity className="items-center">
              <View className="mb-2 h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <AntDesign name="copy1" size={24} color={PRIMARY_COLOR} />
              </View>
              <Text className="text-xs text-gray-600">
                {TEXT_TRANSLATE_INVITE_MEMBER_BY_QR_CODE.COPY_LINK}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={shareLink} className="items-center">
              <View className="mb-2 h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <AntDesign name="sharealt" size={24} color={PRIMARY_COLOR} />
              </View>
              <Text className="text-xs text-gray-600">
                {TEXT_TRANSLATE_INVITE_MEMBER_BY_QR_CODE.SHARE_LINK}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={downloadQR} className="items-center">
              <View className="mb-2 h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <AntDesign name="download" size={24} color={PRIMARY_COLOR} />
              </View>
              <Text className="text-xs text-gray-600">
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
