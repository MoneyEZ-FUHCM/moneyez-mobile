import {
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import useHideGroupTabbar from "@/hooks/useHideGroupTabbar";
import AntDesign from "@expo/vector-icons/build/AntDesign";
import React, { useRef } from "react";
import QRCode from "react-native-qrcode-svg";
import { Alert, Share, Text, TouchableOpacity, View } from "react-native";
import * as FileSystem from "expo-file-system";
import useInviteMember from "../hooks/useInviteMember";
import TEXT_TRANSLATE_INVITE_MEMBER_BY_QR_CODE from "./InviteMemberByQRCode.translate";

const InviteMemberByEmail = () => {
  const { handler } = useInviteMember();
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
    <SafeAreaViewCustom>
      <SectionComponent rootClassName="flex-row justify-between items-center h-14 px-4">
        <TouchableOpacity onPress={handler.handleBackInviteByEmail}>
          <AntDesign name="arrowleft" size={24} color="#000000" />
        </TouchableOpacity>
        <View className="flex-row items-center gap-1">
          <Text className="text-lg font-bold text-black">
            {TEXT_TRANSLATE_INVITE_MEMBER_BY_QR_CODE.HEADER_TITLE}
          </Text>
        </View>
        <TouchableOpacity></TouchableOpacity>
      </SectionComponent>

      {/* Nội dung */}
      <View className="mt-5 rounded-lg bg-[#fafafa] p-5">
        <Text className="text-base font-semibold">
          {TEXT_TRANSLATE_INVITE_MEMBER_BY_QR_CODE.GROUP_NAME}
        </Text>
        <Text className="text-sm text-gray-500">
          {TEXT_TRANSLATE_INVITE_MEMBER_BY_QR_CODE.DESCRIPTION}
        </Text>

        {/* Mã QR */}
        <View className="my-4 items-center">
          <QRCode
            value={INVITE_LINK}
            size={150}
            getRef={(c) => (QR_REF.current = c)}
          />
        </View>

        <Text className="text-center text-xs text-gray-500">
          {TEXT_TRANSLATE_INVITE_MEMBER_BY_QR_CODE.QR_CODE_REFRESH}
        </Text>

        {/* Link mời */}
        <TouchableOpacity className="mt-2 items-center rounded-lg bg-light py-2">
          <Text className="font-medium text-primary">{INVITE_LINK}</Text>
        </TouchableOpacity>

        {/* Hành động */}
        <View className="mt-4 flex-row justify-around">
          <TouchableOpacity className="items-center">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-light">
              <AntDesign name="copy1" size={24} color={PRIMARY_COLOR} />
            </View>
            <Text className="pt-1 text-xs text-gray-600">
              {TEXT_TRANSLATE_INVITE_MEMBER_BY_QR_CODE.COPY_LINK}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={shareLink} className="items-center">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-light">
              <AntDesign name="sharealt" size={24} color={PRIMARY_COLOR} />
            </View>
            <Text className="pt-1 text-xs text-gray-600">
              {TEXT_TRANSLATE_INVITE_MEMBER_BY_QR_CODE.SHARE_LINK}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={downloadQR} className="items-center">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-light">
              <AntDesign name="download" size={24} color={PRIMARY_COLOR} />
            </View>
            <Text className="pt-1 text-xs text-gray-600">
              {TEXT_TRANSLATE_INVITE_MEMBER_BY_QR_CODE.DOWNLOAD_QR}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <SectionComponent rootClassName="flex-row flex-1 absolute bottom-5 mx-4">
        <SpaceComponent width={15} />
        <TouchableOpacity className="mt-10 w-1/2 flex-1 items-center rounded-lg bg-primary p-3">
          <Text className="text-base font-semibold text-white">
            {TEXT_TRANSLATE_INVITE_MEMBER_BY_QR_CODE.BUTTON}
          </Text>
        </TouchableOpacity>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
};

export default InviteMemberByEmail;
