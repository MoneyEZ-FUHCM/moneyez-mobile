import Admin from "@/assets/images/logo/avatar_admin.jpg";
import {
  SafeAreaViewCustom,
  ScrollViewCustom,
  SectionComponent,
} from "@/components";
import { MaterialIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import React from "react";
import {
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ProgressBar } from "react-native-paper";
import TEXT_TRANSLATE_GROUP_RATIO_MEMBER from "./GroupRatioMember.translate";
import useGroupRatioMember from "./hooks/useGroupRatioMember";
import { GroupMember } from "@/types/group.type";

const SliderTooltip = ({ value }: { value: number }) => (
  <View
    style={{
      position: "absolute",
      backgroundColor: "#609084",
      padding: 4,
      borderRadius: 4,
      minWidth: 35,
      alignItems: "center",
      top: -25,
      alignSelf: "center",
    }}
  >
    <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>
      {value}%
    </Text>
    <View
      style={{
        position: "absolute",
        bottom: -4,
        borderLeftWidth: 4,
        borderRightWidth: 4,
        borderTopWidth: 4,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: "#609084",
      }}
    />
  </View>
);

const GroupRatioMemberPage = () => {
  const { state, handler } = useGroupRatioMember();

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-[#f9f9f9]">
      <SectionComponent rootClassName="h-14 bg-white justify-center shadow-sm">
        <View className="flex-row items-center justify-between px-5">
          <TouchableOpacity onPress={handler.handleGoBack}>
            <MaterialIcons name="arrow-back" size={24} color="#609084" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-black">
            {TEXT_TRANSLATE_GROUP_RATIO_MEMBER.TITLE.HEADER}
          </Text>
          <View style={{ width: 24 }} />
        </View>
      </SectionComponent>

      <ScrollViewCustom
        showsVerticalScrollIndicator={false}
        isBottomTab={false}
        className="mb-24"
      >
        <View className="p-4">
          <SectionComponent rootClassName="mb-4 rounded-lg bg-white p-5 shadow-sm">
            <Text className="text-base italic leading-5 text-gray-700">
              <Text className="font-semibold text-red">* </Text>
              Lưu ý: Tổng tỉ lệ đóng góp của các thành viên phải bằng 100%
            </Text>
          </SectionComponent>

          <SectionComponent rootClassName="mb-4 rounded-lg bg-white p-5 shadow-sm">
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-medium">
                Tổng tỉ lệ đóng góp:
              </Text>
              <View className="flex-row items-center space-x-3">
                <Text
                  style={{
                    color: handler.getTotalColor(),
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  {state.displayTotal}%
                </Text>
              </View>
            </View>
            <ProgressBar
              progress={state.localTotal / 100}
              color={handler.getTotalColor()}
              className="mt-3 h-2 rounded-full"
            />
          </SectionComponent>
          <SectionComponent rootClassName="rounded-lg bg-white px-5 py-2 shadow-sm">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-base font-semibold text-gray-800">
                Danh sách đóng góp ({state?.groupMembersDetail?.length})
              </Text>
              <TouchableOpacity
                onPress={handler.handleEqualShare}
                className="flex-row items-center space-x-1 rounded-lg bg-[#E8F5E9] px-3 py-1.5"
              >
                <MaterialIcons name="swap-horiz" size={16} color="#4CAF50" />
                <Text className="text-xs font-medium text-[#4CAF50]">
                  Chia đều
                </Text>
              </TouchableOpacity>
            </View>

            {state.groupMembersDetail?.map(
              (member: GroupMember, index: number) => {
                const currentValue = state.localSliderValues[member?.userId];
                const displayValue = Math.round(currentValue);
                const showTooltip =
                  state?.isDragging &&
                  state?.tooltipValue?.id === member?.userId;

                return (
                  <View
                    key={member?.userId}
                    className={`mb-6 pb-6 ${index === (state.groupMembersDetail?.length ?? 0) - 1 ? "mb-0 pb-0" : "border-b border-gray-100"}`}
                  >
                    <View className="mb-3 flex-row items-center">
                      {member?.userInfo?.avatarUrl ? (
                        <Image
                          source={
                            member?.userInfo?.avatarUrl
                              ? { uri: member.userInfo.avatarUrl }
                              : Admin
                          }
                          className="mr-3 h-12 w-12 rounded-full border border-gray-200"
                          resizeMode="cover"
                        />
                      ) : (
                        <View className="mr-3 h-12 w-12 items-center justify-center rounded-full bg-primary">
                          <Text className="text-2xl font-medium uppercase text-white">
                            {member?.userInfo?.fullName?.charAt(0)}
                          </Text>
                        </View>
                      )}
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-800">
                          {member?.userInfo?.fullName}{" "}
                          {member?.userId === state?.userInfo?.id
                            ? "(Bạn)"
                            : ""}
                        </Text>
                      </View>
                      <TextInput
                        className="min-w-[60px] rounded-full bg-[#E8F5E9] px-3 py-1 text-center font-bold text-[#4CAF50]"
                        value={
                          state.editingId === member?.userId
                            ? ""
                            : displayValue.toString()
                        }
                        keyboardType="numeric"
                        maxLength={3}
                        onChangeText={(text) =>
                          handler.handleInputChange(member?.userId, text)
                        }
                        onBlur={() => handler.handleInputBlur(member?.userId)}
                        selectTextOnFocus
                      />
                    </View>
                    <View className="flex-row items-center">
                      <Text className="w-8 text-xs text-gray-500">0%</Text>
                      <View style={{ flex: 1, height: 40 }}>
                        {showTooltip && (
                          <SliderTooltip value={state?.tooltipValue?.value} />
                        )}
                        <Slider
                          style={{ width: "100%", height: "100%" }}
                          minimumValue={0}
                          maximumValue={100}
                          step={1}
                          value={currentValue}
                          onSlidingStart={() =>
                            handler.handleSliderStart(member?.userId)
                          }
                          onValueChange={(value) =>
                            handler.handleSliderChange(member?.userId, value)
                          }
                          onSlidingComplete={() =>
                            handler.handleSliderComplete(member?.userId)
                          }
                          minimumTrackTintColor="#609084"
                          maximumTrackTintColor="#d1d5db"
                          thumbTintColor="#609084"
                        />
                      </View>
                      <Text className="w-10 text-right text-xs text-gray-500">
                        100%
                      </Text>
                    </View>
                  </View>
                );
              },
            )}
          </SectionComponent>
        </View>
      </ScrollViewCustom>

      <View className="absolute bottom-0 left-0 right-0 bg-white px-6 py-4 shadow-lg">
        <Pressable
          onPress={handler.handleUpdate}
          className={`${
            state?.displayTotal === 100 ? "bg-[#609084]" : "bg-gray-400"
          } items-center rounded-lg py-3.5`}
          disabled={state?.displayTotal !== 100}
        >
          <Text className="text-base font-semibold text-white">
            {TEXT_TRANSLATE_GROUP_RATIO_MEMBER.BUTTON?.UPDATE}
          </Text>
        </Pressable>
      </View>
    </SafeAreaViewCustom>
  );
};

export default GroupRatioMemberPage;
