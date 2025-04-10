import {
  ModalLizeComponent,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
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

        <View className="space-y-2 p-4">
          {state.isLeader && (
            <>
              <SectionComponent rootClassName="bg-white rounded-xl shadow-sm">
                <Pressable
                  onPress={handler.handleEditGroupInfo}
                  className="flex-row items-center px-4 py-3"
                >
                  <View className="mr-4 h-10 w-10 items-center justify-center rounded-full">
                    <MaterialIcons name="edit" size={20} color="#609084" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-medium">
                      {TEXT_TRANSLATE_GROUP_SETTINGS.OPTION.EDIT_GROUP_INFO}
                    </Text>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={20}
                    color="#9e9e9e"
                  />
                </Pressable>
              </SectionComponent>
              <SpaceComponent height={10} />
              <SectionComponent rootClassName="bg-white rounded-xl shadow-sm">
                <Pressable
                  onPress={handler.handleUpdateContributionRate}
                  className="flex-row items-center px-4 py-3"
                >
                  <View className="mr-4 h-10 w-10 items-center justify-center rounded-full">
                    <MaterialIcons name="percent" size={20} color="#609084" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-medium">
                      {
                        TEXT_TRANSLATE_GROUP_SETTINGS.OPTION
                          .UPDATE_CONTRIBUTION_RATE
                      }
                    </Text>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={20}
                    color="#9e9e9e"
                  />
                </Pressable>
              </SectionComponent>
              <SpaceComponent height={10} />
              <SectionComponent rootClassName="bg-white rounded-xl shadow-sm">
                <Pressable
                  onPress={handler.handleFinancialGoal}
                  className="flex-row items-center px-4 py-3"
                >
                  <View className="mr-4 h-10 w-10 items-center justify-center rounded-full">
                    <MaterialIcons name="flag" size={20} color="#609084" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-medium">
                      {
                        TEXT_TRANSLATE_GROUP_SETTINGS.OPTION
                          .GROUP_FINANCIAL_GOAL
                      }
                    </Text>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={20}
                    color="#9e9e9e"
                  />
                </Pressable>
              </SectionComponent>
            </>
          )}
          <SpaceComponent height={10} />
          {!state.isLeader && (
            <SectionComponent rootClassName="bg-white rounded-xl shadow-sm">
              <Pressable
                onPress={() => {
                  state.modalizeRef.current?.open();
                  handler.handleOpenModal();
                }}
                className="flex-row items-center px-4 py-3"
              >
                <View className="mr-4 h-10 w-10 items-center justify-center rounded-full">
                  <MaterialIcons name="delete" size={20} color="#dd6b55" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium">
                    {TEXT_TRANSLATE_GROUP_SETTINGS.OPTION.CLOSE_GROUP_FUND}
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color="#9e9e9e" />
              </Pressable>
            </SectionComponent>
          )}
        </View>

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

            <View className="rounded-lg bg-orange-50 p-4">
              <Text className="text-center text-base leading-6 text-gray-700">
                Khi rời nhóm, toàn bộ số tiền bạn đã đóng trong thời gian qua sẽ
                không được hoàn trả.
                {"\n\n"}Bạn có chắc chắn muốn rời nhóm?
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
                  handler.handleCloseGroupFund();
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
