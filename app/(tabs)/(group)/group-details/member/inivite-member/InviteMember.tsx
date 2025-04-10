import AdminAvatar from "@/assets/images/logo/avatar_admin.jpg";
import {
  FlatListCustom,
  ModalLizeComponent,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { GROUP_MEMBER_STATUS, GROUP_ROLE } from "@/enums/globals";
import { Colors } from "@/helpers/constants/color";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { formatCurrency, formatDate } from "@/helpers/libs";
import { GroupMember } from "@/types/group.type";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { memo, useEffect, useRef, useState } from "react";
import {
  Image,
  Linking,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
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
    const swipeRef = useRef<Swipeable>(null);

    const renderRightActions = () => {
      if (
        !(
          item.status === GROUP_MEMBER_STATUS.ACTIVE &&
          state.isLeader &&
          item.role !== GROUP_ROLE.LEADER
        )
      ) {
        return null;
      }

      return (
        <View className="flex h-full w-20 items-center justify-center bg-red">
          <MaterialIcons name="delete" size={24} color="white" />
        </View>
      );
    };

    const handleSwipeOpen = () => {
      if (swipeRef.current) {
        swipeRef.current.close();
      }
      handler.handleOpenModalRemoveMember(item);
    };

    const memberContent = (
      <TouchableOpacity
        onPress={() => handler.handleOpenMemberDetails(item)}
        className="flex-row items-center justify-between bg-white p-4"
      >
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
      </TouchableOpacity>
    );

    return (
      <View className="mx-4 mb-4 overflow-hidden rounded-2xl shadow-md">
        {item.status === GROUP_MEMBER_STATUS.ACTIVE &&
        state.isLeader &&
        item.role !== GROUP_ROLE.LEADER ? (
          <Swipeable
            ref={swipeRef}
            renderRightActions={renderRightActions}
            rightThreshold={40}
            onSwipeableOpen={handleSwipeOpen}
            overshootRight={false}
          >
            {memberContent}
          </Swipeable>
        ) : (
          memberContent
        )}
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

  const MemberDetailsContent = () => {
    const member = state.selectedMember;
    if (!member) return null;

    return (
      <View className="rounded-3xl bg-white p-4">
        <View className="mb-5 flex-row">
          <View className="relative mr-4">
            <Image
              source={
                member?.userInfo?.avatarUrl
                  ? { uri: member.userInfo.avatarUrl }
                  : AdminAvatar
              }
              className="h-20 w-20 rounded-full border-2 border-primary"
            />
            {member.role === GROUP_ROLE.LEADER && (
              <View className="absolute -right-1 top-0 h-6 w-6 items-center justify-center rounded-full border border-white bg-amber-500">
                <Ionicons name="star" size={12} color="#FFFFFF" />
              </View>
            )}
          </View>

          <View className="flex-1 justify-center">
            <Text className="mb-1 text-xl font-bold text-gray-900">
              {member?.userInfo?.fullName}
            </Text>

            <View className="mb-1 flex-row items-center">
              <Feather name="mail" size={12} color="#6B7280" className="w-4" />
              <Text
                className="ml-1 text-xs text-gray-600"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {member?.userInfo?.email}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Feather name="phone" size={12} color="#6B7280" className="w-4" />
              <Text className="ml-1 text-xs text-gray-600">
                {member?.userInfo?.phoneNumber || "Chưa cập nhật"}
              </Text>
            </View>
          </View>
        </View>

        <View className="mb-4 flex-row">
          <View className="flex-1 rounded-xl border border-gray-200 bg-gray-50 p-3">
            <View className="mb-2 flex-row items-center">
              <Feather name="users" size={14} color={Colors.colors.primary} />
              <Text className="ml-1 text-sm font-semibold text-gray-800">
                Thông tin nhóm
              </Text>
            </View>
            <CompactInfoRow
              label="Vai trò"
              value={
                member.role === GROUP_ROLE.LEADER ? "Trưởng nhóm" : "Thành viên"
              }
              valueStyle={
                member.role === GROUP_ROLE.LEADER
                  ? "text-primary"
                  : "text-gray-900"
              }
            />
            <CompactInfoRow
              label="Trạng thái"
              value={
                member.status === GROUP_MEMBER_STATUS.ACTIVE
                  ? "Đang hoạt động"
                  : "Đang chờ"
              }
              valueStyle={
                member.status === GROUP_MEMBER_STATUS.ACTIVE
                  ? "text-green-600"
                  : "text-amber-600"
              }
            />
            <CompactInfoRow
              label="Ngày tham gia"
              value={formatDate(member?.createdDate)}
            />
          </View>
          <SpaceComponent width={10} />
          <View className="flex-1 rounded-xl border border-gray-200 bg-gray-50 p-3">
            <View className="mb-2 flex-row items-center">
              <Feather name="info" size={14} color={Colors.colors.primary} />
              <Text className="ml-1 text-sm font-semibold text-gray-800">
                Thông tin khác
              </Text>
            </View>
            <CompactInfoRow
              label="Địa chỉ"
              value={member?.userInfo?.address || "Chưa cập nhật"}
            />
            <CompactInfoRow
              label="Ngày sinh"
              value={
                member?.userInfo?.dob
                  ? formatDate(member?.userInfo?.dob)
                  : "Chưa cập nhật"
              }
            />
            <CompactInfoRow
              label="Số giao dịch"
              value={member.transactionCount as string}
            />
          </View>
        </View>
        <View className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
          <View className="mb-3 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Feather
                name="dollar-sign"
                size={14}
                color={Colors.colors.primary}
              />
              <Text className="ml-1 text-sm font-semibold text-gray-800">
                Đóng góp
              </Text>
            </View>
            <Text className="text-sm font-bold text-primary">
              {member.contributionPercentage}%
            </Text>
          </View>
          <View className="mb-3 h-2 overflow-hidden rounded-full bg-gray-200">
            <View
              className="h-full rounded-full bg-primary"
              style={{ width: `${member.contributionPercentage}%` }}
            />
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-gray-600">Tổng đóng góp:</Text>
            <Text className="text-sm font-bold text-primary">
              {formatCurrency(member?.totalContribution)}
            </Text>
          </View>
        </View>
        <View className="flex-row">
          <TouchableOpacity
            className="flex-1 rounded-lg bg-gray-100 py-3"
            onPress={handler.handleCloseMemberDetails}
          >
            <Text className="text-center text-sm font-medium text-gray-700">
              Đóng
            </Text>
          </TouchableOpacity>
          <SpaceComponent width={10} />
          <TouchableOpacity
            className="flex-1 rounded-lg bg-primary py-3 shadow-sm"
            onPress={() => {
              const phone = member?.userInfo?.phoneNumber;
              if (phone) {
                Linking.openURL(`tel:${phone}`).catch(() =>
                  ToastAndroid.show(
                    "Không thể mở ứng dụng điện thoại",
                    ToastAndroid.SHORT,
                  ),
                );
              } else {
                ToastAndroid.show(
                  "Số điện thoại chưa được cập nhật",
                  ToastAndroid.SHORT,
                );
              }
            }}
          >
            <Text className="text-center text-sm font-semibold text-white">
              Liên hệ
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const CompactInfoRow = ({
    label,
    value,
    valueStyle = "text-gray-900",
  }: {
    label: string;
    value: string | number;
    valueStyle?: string;
  }) => (
    <View className="mb-1 flex-row items-center justify-between">
      <Text className="text-xs text-gray-600">{label}:</Text>
      <Text
        className={`text-xs font-medium ${valueStyle}`}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {value}
      </Text>
    </View>
  );

  return (
    <GestureHandlerRootView>
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
        {state.isLeader && (
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
              label={
                TEXT_TRANSLATE_INVITE_MEMBER.INVITE_MEMBER.INVITE_BY_QR_CODE
              }
              routePath={PATH_NAME.MEMBER.INVITE_MEMBER_BY_QR_CODE}
              icon={({ size, color }) => (
                <Ionicons name="qr-code" size={size} color={color} />
              )}
              iconColor="#2196F3"
            />
          </View>
        )}

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

        {/* delete */}
        <ModalLizeComponent
          ref={state.modalizeRef}
          onClose={handler.handleCloseModalDetail}
        >
          <View className="p-6">
            <Text className="mb-4 text-center text-lg font-bold text-gray-900">
              Xác nhận xóa thành viên
            </Text>
            <Text className="mb-6 text-center text-gray-600">
              Bạn có chắc chắn muốn xóa thành viên{" "}
              <Text className="font-bold text-primary">
                {state.selectedMember?.userInfo?.fullName}
              </Text>{" "}
              khỏi nhóm?
            </Text>
            <View className="flex-row gap-4">
              <TouchableOpacity
                className="flex-1 rounded-lg border border-gray-200 py-3"
                onPress={() => handler.handleCloseModal()}
              >
                <Text className="text-center font-medium text-gray-700">
                  Hủy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 rounded-lg bg-red py-3"
                onPress={() =>
                  handler.handleRemoveMember(state.selectedMember?.userId)
                }
              >
                <Text className="text-center font-medium text-white">Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ModalLizeComponent>

        {/* detail */}
        <ModalLizeComponent
          ref={state.memberDetailsModalRef}
          onClose={handler.handleCloseModalDetail}
        >
          <MemberDetailsContent />
        </ModalLizeComponent>
      </SafeAreaViewCustom>
    </GestureHandlerRootView>
  );
};

export default InviteMember;
