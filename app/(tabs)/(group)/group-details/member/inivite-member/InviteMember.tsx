import AdminAvatar from "@/assets/images/logo/avatar_admin.jpg";
import {
  FlatListCustom,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { GROUP_MEMBER_STATUS } from "@/enums/globals";
import { Colors } from "@/helpers/constants/color";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { GroupMember } from "@/types/group.type";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import TEXT_TRANSLATE_INVITE_MEMBER from "./InviteMember.translate";
import useInviteMember from "./hooks/useInviteMember";

const CountdownDisplay = memo(({ createdDate }: { createdDate: string }) => {
  const [countdown, setCountdown] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const expireTime = new Date(createdDate).getTime() + 24 * 60 * 60 * 1000;

    const updateCountdown = () => {
      const now = Date.now();
      const remainingTime = expireTime - now;

      if (remainingTime <= 0) {
        setIsExpired(true);
        setCountdown("");
        return true;
      }

      const hours = String(
        Math.floor(remainingTime / (1000 * 60 * 60)),
      ).padStart(2, "0");
      const minutes = String(
        Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)),
      ).padStart(2, "0");
      const seconds = String(
        Math.floor((remainingTime % (1000 * 60)) / 1000),
      ).padStart(2, "0");

      setCountdown(`${hours}:${minutes}:${seconds}`);
      return false;
    };
    if (updateCountdown()) return;

    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [createdDate]);

  return (
    <Text className="text-sm font-medium text-[#b62d2d]">
      {isExpired ? "Lời mời đã hết hạn" : `Lời mời sẽ hết hạn sau ${countdown}`}
    </Text>
  );
});

const InviteMember = () => {
  const { handler, state } = useInviteMember();

  const InviteMethodButton = ({
    label,
    routePath,
    icon: Icon,
    iconColor,
  }: {
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

  const MemberItem = memo(({ item }: { item: GroupMember }) => {
    return (
      <View className="mx-4 mb-4 rounded-2xl bg-white p-4 shadow-md">
        <View className="flex-row items-center justify-between">
          <View
            className={`${item.status === GROUP_MEMBER_STATUS.ACTIVE ? "flex-[0.6]" : ""} flex-row items-center space-x-3`}
          >
            <Image
              source={
                item?.userInfo?.avatarUrl
                  ? { uri: item.userInfo.avatarUrl }
                  : AdminAvatar
              }
              className="h-12 w-12 rounded-full"
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
              {item.status === GROUP_MEMBER_STATUS.PENDING && (
                <CountdownDisplay createdDate={item.createdDate} />
              )}
            </View>
          </View>
          {item.status === GROUP_MEMBER_STATUS.ACTIVE && (
            <View className="flex-[0.4] items-end">
              <Text className="mb-1 text-xs text-gray-500">Tỉ lệ đóng góp</Text>
              <Text className="text-base font-bold text-primary">
                {item?.contributionPercentage}%
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  });

  const TabSelector = () => (
    <View className="mx-4 mb-4 flex-row rounded-lg bg-gray-100 p-1">
      <TouchableOpacity
        onPress={() => {
          handler.setActiveTab(GROUP_MEMBER_STATUS.ACTIVE);
        }}
        className={`flex-1 rounded-md py-1 ${
          state.activeTab === GROUP_MEMBER_STATUS.ACTIVE ? "bg-white" : ""
        }`}
      >
        <Text
          className={`text-center text-sm ${
            state.activeTab === GROUP_MEMBER_STATUS.ACTIVE
              ? "font-bold text-primary"
              : "text-gray-500"
          }`}
        >
          Đang hoạt động
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          handler.setActiveTab(GROUP_MEMBER_STATUS.PENDING);
        }}
        className={`flex-1 rounded-md py-1 ${
          state.activeTab === GROUP_MEMBER_STATUS.PENDING ? "bg-white" : ""
        }`}
      >
        <Text
          className={`text-center text-sm ${
            state.activeTab === GROUP_MEMBER_STATUS.PENDING
              ? "font-medium text-primary"
              : "text-gray-500"
          }`}
        >
          Đang chờ
        </Text>
      </TouchableOpacity>
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
          icon={({ size, color }) => (
            <MaterialIcons name="email" size={size} color={color} />
          )}
          iconColor={Colors.colors.green}
        />
        <SpaceComponent width={12} />
        <InviteMethodButton
          label={TEXT_TRANSLATE_INVITE_MEMBER.INVITE_MEMBER.INVITE_BY_QR_CODE}
          routePath={PATH_NAME.MEMBER.INVITE_MEMBER_BY_QR_CODE}
          icon={({ size, color }) => (
            <Ionicons name="qr-code" size={size} color={color} />
          )}
          iconColor="#2196F3"
        />
      </View>
      {state.activeTab === GROUP_MEMBER_STATUS.ACTIVE ? (
        <Text className="mb-3 ml-4 text-lg font-bold text-gray-900">
          {TEXT_TRANSLATE_INVITE_MEMBER.INVITE_MEMBER.MEMBER_LIST(
            state.activeMembers?.length,
          )}
        </Text>
      ) : (
        <Text className="mb-3 ml-4 text-lg font-bold text-gray-900">
          {TEXT_TRANSLATE_INVITE_MEMBER.INVITE_MEMBER.MEMBER_LIST(
            state.pendingMembers?.length,
          )}
        </Text>
      )}
      {state.isLeader && <TabSelector />}
      <FlatListCustom
        refreshing={state.isRefreshing}
        onRefresh={handler.handleRefresh}
        isBottomTab={true}
        data={
          state.activeTab === GROUP_MEMBER_STATUS.ACTIVE
            ? state.activeMembers
            : state.pendingMembers
        }
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
