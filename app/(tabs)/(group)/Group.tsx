import {
  FlatListCustom,
  LoadingSectionWrapper,
  ModalLizeComponent,
  QRScanner,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import VisibilityIcon from "@/components/GroupListCustom/VisibilityIcon";
import { GROUP_MEMBER_STATUS, GROUP_ROLE, GROUP_STATUS } from "@/enums/globals";
import { appInfo } from "@/helpers/constants/appInfos";
import { Colors } from "@/helpers/constants/color";
import { formatCurrency } from "@/helpers/libs";
import { GroupMember } from "@/types/group.type";
import {
  AntDesign,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Scan } from "iconsax-react-native";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TEXT_TRANSLATE_GROUP_LIST from "./GroupList.translate";
import useGroupList from "./hooks/useGroupList";

const Group = () => {
  const { state, handler } = useGroupList();
  const {
    groups,
    isLoadingMore,
    visibleItems,
    isFetchingData,
    isShowScanner,
    modalizeRef,
    memberCode,
    modalizeJoinGroupRef,
  } = state;
  const {
    handleLoadMore,
    handleScanQR,
    setIsShowScanner,
    handleScanSuccess,
    setMemberCode,
    handleSubmitJoinGroup,
    handleJoinGroup,
    handleJoinGroupByQR,
  } = handler;
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <GestureHandlerRootView>
      <SafeAreaViewCustom rootClassName="bg-gray-50 relative">
        {!isShowScanner && (
          <SectionComponent rootClassName="relative bg-white shadow-md h-14 flex-row items-center justify-center">
            <TouchableOpacity
              onPress={handler.handleBack}
              className="absolute left-3 rounded-full p-2"
            >
              <MaterialIcons name="arrow-back" size={24} />
            </TouchableOpacity>
            <Text className="text-lg font-bold">
              {TEXT_TRANSLATE_GROUP_LIST.TITLE.GROUP_FUND}
            </Text>
            <TouchableOpacity
              onPress={handleScanQR}
              className="absolute right-3 rounded-full p-2"
            >
              <Scan size="24" />
            </TouchableOpacity>
          </SectionComponent>
        )}
        {isShowScanner ? (
          <QRScanner
            onClose={() => setIsShowScanner(false)}
            onScanSuccess={handleScanSuccess}
          />
        ) : (
          <LoadingSectionWrapper
            isLoading={isFetchingData || state.isRefetching}
          >
            {groups && groups?.length > 0 ? (
              <FlatListCustom
                className="mx-5 pt-5"
                showsVerticalScrollIndicator={false}
                data={groups ?? []}
                isBottomTab={true}
                isLoading={isLoadingMore}
                hasMore={state.data?.items?.length === state.pageSize}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="mb-4 flex-row items-center rounded-2xl border border-gray-200 bg-white p-4"
                    onPress={handler.handleNavigateAndHideTabbar(item)}
                  >
                    {item?.imageUrl ? (
                      <Image
                        src={item?.imageUrl}
                        alt="star"
                        className="h-14 w-14 rounded-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="h-14 w-14 items-center justify-center rounded-full bg-primary">
                        <Text className="text-3xl font-medium uppercase text-white">
                          {item?.name?.charAt(0)}
                        </Text>
                      </View>
                    )}

                    <View className="ml-4 flex-1 space-y-1">
                      <Text className="text-lg font-semibold text-gray-900">
                        {item?.name}
                      </Text>
                      <View className="flex-row items-center justify-between">
                        <Text className="text-base text-gray-700">
                          {visibleItems[item?.id]
                            ? formatCurrency(item?.currentBalance)
                            : "*******"}
                        </Text>
                        <VisibilityIcon
                          visible={visibleItems[item?.id] || false}
                          onPress={() => handler.toggleVisibility(item?.id)}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                onLoadMore={handleLoadMore}
                refreshing={state.isRefetching}
                onRefresh={handler.handleRefetchGrouplist}
              />
            ) : (
              <View
                className="mb-20 items-center justify-center"
                style={{ height: appInfo.sizes.HEIGHT - 56 }}
              >
                <View className="mb-28">
                  <View className="items-center justify-center p-6">
                    <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                      <MaterialCommunityIcons
                        name="account-group"
                        size={40}
                        color={Colors.colors.primary}
                      />
                    </View>
                    <Text className="text-center text-lg font-semibold text-gray-500">
                      Bạn chưa có quỹ nhóm nào
                    </Text>
                    <View className="w-[80%]">
                      <Text className="mt-2 text-center text-gray-400">
                        Nhấn nút bên dưới để tạo quỹ nhóm mới hoặc tham gia quỹ
                        nhóm khác
                      </Text>
                    </View>
                  </View>
                  <View className="w-full flex-row justify-between px-8">
                    <TouchableOpacity
                      className="flex-1 rounded-lg bg-primary/10 px-4 py-3"
                      onPress={handleJoinGroupByQR}
                    >
                      <Text className="text-center font-medium text-primary">
                        Tham gia nhóm
                      </Text>
                    </TouchableOpacity>
                    <SpaceComponent width={25} />
                    <TouchableOpacity
                      onPress={handler.handleCreateGroupAndHideTabbar}
                      className="flex-1 rounded-lg bg-primary px-4 py-3 shadow-sm"
                    >
                      <Text className="text-center font-medium text-white">
                        Tạo nhóm
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </LoadingSectionWrapper>
        )}
        {groups && groups?.length > 0 && (
          <View className="absolute bottom-10 right-5 space-y-4">
            <TouchableOpacity
              className="h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-gray-400"
              onPress={handler.handleCreateGroupAndHideTabbar}
            >
              <AntDesign name="addusergroup" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-gray-400"
              onPress={handler.handleJoinGroup}
            >
              <FontAwesome6 name="people-group" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
        <ModalLizeComponent ref={modalizeRef}>
          <View className="rounded-t-2xl bg-white p-5">
            <Text className="mb-6 text-center text-xl font-bold text-gray-800">
              Tham gia nhóm
            </Text>
            <View className="mb-6">
              <Text className="mb-2 text-sm text-gray-600">Mã mời</Text>
              <TextInput
                className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base"
                placeholder="Nhập mã được cung cấp bởi leader"
                placeholderTextColor="#888"
                value={memberCode}
                onChangeText={setMemberCode}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <TouchableOpacity
              className={`items-center rounded-lg px-4 py-3.5 ${
                memberCode.trim() ? "bg-primary" : "bg-gray-300"
              }`}
              onPress={handleSubmitJoinGroup}
              disabled={!memberCode.trim()}
            >
              <Text className="text-base font-semibold text-white">
                Xác nhận
              </Text>
            </TouchableOpacity>
          </View>
        </ModalLizeComponent>
        <ModalLizeComponent ref={modalizeJoinGroupRef} handlePosition="inside">
          {state.groupDetailPreview && (
            <View className="flex-1 rounded-3xl bg-gray-50">
              <View className="relative h-48 w-full overflow-hidden rounded-t-3xl">
                {state.groupDetailPreview?.imageUrl ? (
                  <Image
                    source={{ uri: state.groupDetailPreview?.imageUrl }}
                    className="absolute h-full w-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="h-60 w-full items-center justify-center bg-primary">
                    <Text className="text-4xl font-medium uppercase text-white">
                      {state.groupDetailPreview?.name?.charAt(0)}
                    </Text>
                    <LinearGradient
                      colors={["transparent", "rgba(0,0,0,0.4)"]}
                      className="absolute bottom-0 left-0 right-0 h-32"
                    />
                  </View>
                )}

                <View className="absolute h-full w-full bg-gradient-to-b from-black/10 via-black/30 to-black/80" />
                <View className="absolute right-4 top-4">
                  <View
                    className={`rounded-full px-4 py-1.5 shadow ${
                      state.groupDetailPreview?.visibility ===
                      GROUP_STATUS.PRIVATE
                        ? "bg-amber-100"
                        : "bg-blue-100"
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        state.groupDetailPreview?.visibility ===
                        GROUP_STATUS.PRIVATE
                          ? "text-amber-800"
                          : "text-blue-800"
                      }`}
                    >
                      {state.groupDetailPreview?.visibility ===
                      GROUP_STATUS.PRIVATE
                        ? "🔒 Riêng tư"
                        : "🌍 Công khai"}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  className="absolute left-4 top-4 h-10 w-10 items-center justify-center rounded-full bg-black/30"
                  onPress={() => modalizeJoinGroupRef.current?.close()}
                >
                  <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <View className="absolute bottom-0 left-0 right-0 p-4">
                  <Text className="shadow-text text-xl font-bold text-white">
                    {state.groupDetailPreview?.name}
                  </Text>
                </View>
              </View>
              <View className="px-5 py-6">
                <View className="mb-4 rounded-2xl bg-white p-5 shadow">
                  <View className="mb-3 flex-row items-center">
                    <Ionicons
                      name="information-circle"
                      size={24}
                      color={Colors.colors.primary}
                    />
                    <Text className="ml-2 text-lg font-semibold text-gray-800">
                      Mô tả
                    </Text>
                  </View>
                  <Text className="leading-relaxed text-gray-700">
                    {state.groupDetailPreview?.description || "Không có mô tả"}
                  </Text>
                </View>
                <View className="mb-4 rounded-2xl bg-white p-5 shadow">
                  <View className="mb-4 flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Ionicons
                        name="people"
                        size={24}
                        color={Colors.colors.primary}
                      />
                      <Text className="ml-2 text-lg font-semibold text-gray-800">
                        Thành viên
                      </Text>
                    </View>
                    <View className="rounded-full bg-gray-100 px-4 py-1">
                      <Text className="font-semibold text-gray-800">
                        {state.groupDetailPreview?.groupMembers?.length || 0}
                      </Text>
                    </View>
                  </View>
                  {state.groupDetailPreview?.groupMembers &&
                    state.groupDetailPreview.groupMembers?.length > 0 && (
                      <View className="mt-2">
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}
                        >
                          <View className="flex-row space-x-3">
                            {state.groupDetailPreview?.groupMembers
                              ?.slice(0, 10)
                              ?.map((member: GroupMember, index: number) => (
                                <View key={index} className="items-center">
                                  <View className="h-16 w-16 overflow-hidden rounded-full">
                                    {member?.userInfo?.avatarUrl ? (
                                      <Image
                                        source={{
                                          uri: member?.userInfo?.avatarUrl,
                                        }}
                                        className="h-full w-full"
                                        resizeMode="cover"
                                      />
                                    ) : (
                                      <View className="h-full w-full items-center justify-center rounded-full bg-primary">
                                        <Text className="text-4xl font-medium uppercase text-white">
                                          {member?.userInfo?.fullName?.charAt(
                                            0,
                                          )}
                                        </Text>
                                      </View>
                                    )}
                                  </View>
                                  {member?.role === GROUP_ROLE.LEADER && (
                                    <View className="absolute right-2 top-0 h-5 w-5 items-center justify-center rounded-full border border-white bg-amber-500">
                                      <Ionicons
                                        name="star"
                                        size={12}
                                        color="#FFFFFF"
                                      />
                                    </View>
                                  )}
                                  <Text
                                    className="mt-1 w-[100px] text-center text-xs text-gray-700"
                                    numberOfLines={2}
                                  >
                                    {member?.userInfo?.fullName}
                                  </Text>
                                </View>
                              ))}
                            {state.groupDetailPreview?.groupMembers?.length >
                              10 && (
                              <View className="items-center justify-center">
                                <View className="h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                                  <Text className="font-bold text-gray-700">
                                    +
                                    {state.groupDetailPreview?.groupMembers
                                      ?.length - 10}
                                  </Text>
                                </View>
                              </View>
                            )}
                          </View>
                        </ScrollView>
                      </View>
                    )}
                </View>
                <View className="mb-4 flex-row space-x-4">
                  <View className="flex-1 rounded-2xl bg-white p-4 shadow">
                    <Ionicons
                      name="shield"
                      size={24}
                      color={Colors.colors.primary}
                    />
                    <Text className="mt-1 text-sm text-gray-500">
                      Trạng thái
                    </Text>
                    <Text className="text-base font-semibold text-gray-800">
                      {state.groupDetailPreview?.status ===
                      GROUP_MEMBER_STATUS.ACTIVE
                        ? "Đang hoạt động"
                        : "Tạm dừng"}
                    </Text>
                  </View>
                  <View className="flex-1 rounded-2xl bg-white p-4 shadow">
                    <Ionicons
                      name="people"
                      size={24}
                      color={Colors.colors.primary}
                    />
                    <Text className="mt-1 text-sm text-gray-500">
                      Trưởng nhóm
                    </Text>
                    <Text
                      className="text-base font-semibold text-gray-800"
                      numberOfLines={1}
                    >
                      {state.groupDetailPreview?.groupMembers?.find(
                        (m: GroupMember) => m?.role === GROUP_ROLE.LEADER,
                      )?.userInfo?.fullName || "Không có"}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  className="mt-2 rounded-xl bg-primary py-3.5 shadow-lg"
                  onPress={handler.handleJoinGroupByQR}
                  disabled={
                    state.groupDetailPreview.status !==
                    GROUP_MEMBER_STATUS.ACTIVE
                  }
                >
                  <View className="flex-row items-center justify-center">
                    <Ionicons name="enter-outline" size={24} color="#FFFFFF" />
                    <Text className="ml-2 text-center text-base font-bold text-white">
                      Tham gia nhóm
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ModalLizeComponent>
      </SafeAreaViewCustom>
    </GestureHandlerRootView>
  );
};

export default Group;
