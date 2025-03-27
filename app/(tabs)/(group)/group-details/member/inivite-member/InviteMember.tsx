import AdminAvatar from "@/assets/images/logo/avatar_admin.jpg";
import {
  FlatListCustom,
  LoadingSectionWrapper,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { Colors } from "@/helpers/constants/color";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import TEXT_TRANSLATE_INVITE_MEMBER from "./InviteMember.translate";
import useInviteMember from "./hooks/useInviteMember";

const InviteMember = () => {
  const { handler, state } = useInviteMember();

  const InviteMethodButton = ({
    onPress,
    label,
    routePath,
    icon: Icon,
    iconColor,
  }: {
    onPress: () => void;
    label: string;
    routePath: string;
    icon: React.ComponentType<{ size: number; color: string }>;
    iconColor: string;
  }) => (
    <TouchableOpacity
      className="flex flex-1 items-center justify-center rounded-2xl bg-white p-3 shadow-md"
      onPress={() => {
        router.navigate(routePath as any);
      }}
    >
      <View className="mb-1 h-12 w-12 items-center justify-center rounded-full bg-gray-50/95">
        <Icon size={24} color={iconColor} />
      </View>
      <Text className="text-sm font-medium text-gray-700">{label}</Text>
    </TouchableOpacity>
  );

  const MemberItem = ({ item }: { item: any }) => (
    <View className="mx-4 mb-4 rounded-2xl bg-white p-4 shadow-md">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center space-x-3">
          <Image
            source={{ uri: item?.userInfo?.avatarUrl as string }}
            className="h-14 w-14 rounded-full"
            defaultSource={AdminAvatar}
          />
          <View>
            {item.role === "LEADER" && (
              <Text className="text-xs font-medium text-primary">
                {TEXT_TRANSLATE_INVITE_MEMBER.INVITE_MEMBER.OWNER}
              </Text>
            )}
            <Text className="text-base font-bold text-gray-900">
              {item?.userInfo?.fullName}
            </Text>
            <Text className="text-sm text-gray-500">
              {item?.userInfo?.email}
            </Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="mb-1 text-xs text-gray-500">Tỉ lệ đóng góp</Text>
          <Text className="text-base font-bold text-primary">
            {item?.contributionPercentage}%
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaViewCustom rootClassName="bg-gray-50">
      <SectionComponent rootClassName="flex-row justify-between items-center h-14 bg-white px-4 shadow-sm">
        <TouchableOpacity
          onPress={handler.handleBack}
          className="p-2 active:opacity-50"
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">
          {TEXT_TRANSLATE_INVITE_MEMBER.INVITE_MEMBER.HEADER}
        </Text>
        <View className="w-8" />
      </SectionComponent>
      <View className="mx-4 my-5 flex-row space-x-4">
        <InviteMethodButton
          label={TEXT_TRANSLATE_INVITE_MEMBER.INVITE_MEMBER.INVITE_BY_EMAIL}
          routePath={PATH_NAME.MEMBER.INVITE_MEMBER_BY_EMAIL}
          onPress={() => {}}
          icon={({ size, color }) => (
            <MaterialIcons name="email" size={size} color={color} />
          )}
          iconColor={Colors.colors.green}
        />
        <SpaceComponent width={12} />
        <InviteMethodButton
          label={TEXT_TRANSLATE_INVITE_MEMBER.INVITE_MEMBER.INVITE_BY_QR_CODE}
          routePath={PATH_NAME.MEMBER.INVITE_MEMBER_BY_QR_CODE}
          onPress={() => {}}
          icon={({ size, color }) => (
            <Ionicons name="qr-code" size={size} color={color} />
          )}
          iconColor="#2196F3"
        />
      </View>
      <Text className="mb-3 ml-4 text-lg font-bold text-gray-900">
        {TEXT_TRANSLATE_INVITE_MEMBER.INVITE_MEMBER.MEMBER_LIST(
          state.groupMembers?.length,
        )}
      </Text>
      <FlatListCustom
        data={state.groupMembers ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MemberItem item={item} />}
        ListEmptyComponent={
          <View className="mt-10 items-center justify-center p-6">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-white shadow-md">
              <MaterialIcons name="group-add" size={40} color="#609084" />
            </View>
            <Text className="text-center text-xl font-bold text-gray-700">
              Không có dữ liệu
            </Text>
            <Text className="mt-2 px-8 text-center text-base text-gray-500">
              Mời thêm bạn bè để cùng nhau góp quỹ
            </Text>
          </View>
        }
      />
    </SafeAreaViewCustom>
  );
};

export default InviteMember;
