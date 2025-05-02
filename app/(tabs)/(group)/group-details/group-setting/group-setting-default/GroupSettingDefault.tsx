import {
  ModalLizeComponent,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import { Colors } from "@/helpers/constants/color";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TEXT_TRANSLATE_GROUP_SETTINGS from "./GroupSettingDefault.translate";
import useGroupSettings from "./hooks/useGroupSettingDefault";

export default function GroupSettingsDefault() {
  const { handler, state } = useGroupSettings();
  return (
    <GestureHandlerRootView>
      <SafeAreaViewCustom rootClassName="flex-1 bg-[#f9f9f9]">
        {/* HEADER */}
        <SectionComponent rootClassName="h-14 bg-white justify-center items-center relative">
          <Text className="text-center text-lg font-bold">
            {TEXT_TRANSLATE_GROUP_SETTINGS.TITLE.HEADER}
          </Text>
        </SectionComponent>

        <View className="min-h-full bg-gray-50 p-5">
          {state.isLeader && (
            <View className="space-y-5">
              <SectionComponent rootClassName="bg-white rounded-2xl shadow-md">
                <Pressable
                  onPress={handler.handleEditGroupInfo}
                  className="flex-row items-center px-5 py-3"
                >
                  <View className="mr-5 h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                    <MaterialIcons
                      name="edit"
                      size={24}
                      color={Colors.colors.blue}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-800">
                      Chỉnh Sửa Thông Tin Nhóm
                    </Text>
                    <Text className="mt-1 text-sm text-gray-500">
                      Cập nhật tên, mô tả và hình ảnh nhóm
                    </Text>
                  </View>
                  <View className="rounded-full">
                    <MaterialIcons
                      name="chevron-right"
                      size={22}
                      color="#6b7280"
                    />
                  </View>
                </Pressable>
              </SectionComponent>

              <SectionComponent rootClassName="bg-white rounded-2xl shadow-md">
                <Pressable
                  onPress={handler.handleFinancialGoal}
                  className="flex-row items-center px-5 py-3"
                >
                  <View className="mr-5 h-14 w-14 items-center justify-center rounded-full bg-light/50">
                    <MaterialIcons
                      name="flag"
                      size={24}
                      color={Colors.colors.primary}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-800">
                      Mục Tiêu Tài Chính
                    </Text>
                    <Text className="mt-1 text-sm text-gray-500">
                      Thiết lập và theo dõi tiến độ tài chính của nhóm
                    </Text>
                  </View>
                  <View className="rounded-full">
                    <MaterialIcons
                      name="chevron-right"
                      size={22}
                      color="#6b7280"
                    />
                  </View>
                </Pressable>
              </SectionComponent>

              <SectionComponent rootClassName="bg-white rounded-2xl shadow-md">
                <Pressable
                  onPress={handler.handleViewRule}
                  className="flex-row items-center px-5 py-3"
                >
                  <View className="mr-5 h-14 w-14 items-center justify-center rounded-full bg-purple-100">
                    <MaterialIcons
                      name="rule"
                      size={24}
                      color={Colors.colors.purple}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-800">
                      Quy Định Nhóm
                    </Text>
                    <Text className="mt-1 text-sm text-gray-500">
                      Quản lý quy định và hướng dẫn thành viên
                    </Text>
                  </View>
                  <View className="rounded-full">
                    <MaterialIcons
                      name="chevron-right"
                      size={22}
                      color="#6b7280"
                    />
                  </View>
                </Pressable>
              </SectionComponent>
              <SectionComponent rootClassName="bg-white rounded-2xl shadow-md">
                <Pressable
                  onPress={() => {
                    state.clsoeGroupModalizeRef.current?.open();
                    handler.handleOpenModal();
                  }}
                  className="flex-row items-center px-5 py-3"
                >
                  <View className="mr-5 h-14 w-14 items-center justify-center rounded-full bg-red/10">
                    <MaterialIcons
                      name="close"
                      size={24}
                      color={Colors.colors.red}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-800">
                      Đóng quỹ nhóm
                    </Text>
                    <Text className="mt-1 text-sm text-gray-500">
                      Kết thúc quỹ nhóm
                    </Text>
                  </View>
                  <View className="rounded-full">
                    <MaterialIcons
                      name="chevron-right"
                      size={22}
                      color="#6b7280"
                    />
                  </View>
                </Pressable>
              </SectionComponent>
            </View>
          )}

          {!state.isLeader && (
            <View className="space-y-5">
              <SectionComponent rootClassName="bg-white rounded-2xl shadow-md">
                <Pressable
                  onPress={() => {
                    state.modalizeRef.current?.open();
                    handler.handleOpenModal();
                  }}
                  className="flex-row items-center px-5 py-3"
                >
                  <View className="mr-5 h-14 w-14 items-center justify-center rounded-full bg-red/10">
                    <MaterialIcons
                      name="delete"
                      size={24}
                      color={Colors.colors.red}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-800">
                      Rời Khỏi Nhóm
                    </Text>
                    <Text className="mt-1 text-sm text-gray-500">
                      Rời khỏi nhóm này và đóng quỹ liên kết của bạn
                    </Text>
                  </View>
                  <View className="rounded-full">
                    <MaterialIcons
                      name="chevron-right"
                      size={22}
                      color="#6b7280"
                    />
                  </View>
                </Pressable>
              </SectionComponent>
            </View>
          )}
        </View>

        {/* member */}
        <ModalLizeComponent
          ref={state.modalizeRef}
          onClose={handler.handleCloseModal}
        >
          <View className="space-y-5 p-6">
            <View className="mb-2 items-center">
              <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-red">
                <MaterialIcons name="warning" size={30} color="white" />
              </View>
              <Text className="text-xl font-bold text-gray-900">
                Xác nhận rời nhóm
              </Text>
            </View>
            <View className="mt-2 flex-row space-x-4">
              <Pressable
                onPress={() => {
                  state.modalizeRef.current?.close();
                  handler.handleCloseModal();
                }}
                className="flex-1 rounded-lg border border-gray-300 py-3.5"
              >
                <Text className="text-center font-semibold text-gray-700">
                  Hủy
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  handler.handleCloseGroupFund("member");
                }}
                className="flex-1 rounded-lg bg-red py-3.5 shadow-sm"
              >
                <Text className="text-center font-semibold text-white">
                  Xác nhận
                </Text>
              </Pressable>
            </View>
          </View>
        </ModalLizeComponent>
        {/* leader */}
        <ModalLizeComponent
          ref={state.clsoeGroupModalizeRef}
          onClose={handler.handleCloseModal}
          adjustToContentHeight
        >
          <View className="space-y-6 p-6">
            <View className="items-center">
              <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-red shadow-md">
                <MaterialIcons name="warning" size={32} color="white" />
              </View>
              <Text className="text-xl font-bold text-gray-800">
                Xác nhận đóng nhóm
              </Text>
            </View>
            <View className="rounded-xl border border-amber-100 bg-amber-50 p-4">
              <Text className="text-center leading-6 text-gray-700">
                Đảm bảo bạn đã rút toàn bộ số dư trong nhóm. Đồng thời, mọi giao
                dịch sẽ được lưu lại và sẽ không có thêm bất kì tương tác nào
                trong nhóm được diễn ra
              </Text>
            </View>
            <View className="mt-2 flex-row space-x-4">
              <Pressable
                onPress={() => {
                  state.clsoeGroupModalizeRef.current?.close();
                  handler.handleCloseModal();
                }}
                className="flex-1 rounded-lg border border-gray-300 py-3.5"
              >
                <Text className="text-center font-semibold text-gray-700">
                  Hủy
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  handler.handleCloseGroupFund("leader");
                }}
                className="flex-1 rounded-lg bg-red py-3.5 shadow-sm"
              >
                <Text className="text-center font-semibold text-white">
                  Xác nhận
                </Text>
              </Pressable>
            </View>
          </View>
        </ModalLizeComponent>
      </SafeAreaViewCustom>
    </GestureHandlerRootView>
  );
}
