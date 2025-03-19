import NoData from "@/assets/images/InviteMemberAssets/not-found-result.png";
import {
  FlatListCustom,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import useHideGroupTabbar from "@/hooks/useHideGroupTabbar";
import AntDesign from "@expo/vector-icons/build/AntDesign";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import INVITE_MEMBER_CONSTANTS from "../InviteMember.constant";
import INVITE_MEMBER_TEXT_TRANSLATE from "../InviteMember.translate";
import useInviteMember from "../hooks/useInviteMember";

const InviteMemberByEmail = () => {
  const PRIMARY_COLOR = "#609084";
  const { state, handler } = useInviteMember();

  useHideGroupTabbar();

  return (
    <SafeAreaViewCustom>
      <SectionComponent rootClassName="flex-row justify-between items-center h-14 px-4">
        <TouchableOpacity onPress={handler.handleBackInviteByEmail}>
          <AntDesign name="arrowleft" size={24} color="#000000" />
        </TouchableOpacity>
        <View className="flex-row items-center gap-1">
          <Text className="text-lg font-bold text-black">
            Mời thành viên qua QR
          </Text>
        </View>
        <TouchableOpacity></TouchableOpacity>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
};

export default InviteMemberByEmail;
