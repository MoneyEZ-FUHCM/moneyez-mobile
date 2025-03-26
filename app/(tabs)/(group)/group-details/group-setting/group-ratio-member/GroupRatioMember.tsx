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
  const {
    members,
    localSliderValues,
    displayTotal,
    localTotal,
    tooltipValue,
    isDragging,
  } = state;

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
            <Text className="text-sm leading-5 text-gray-700">
              <Text className="font-semibold text-[#609084]">* </Text>
              {TEXT_TRANSLATE_GROUP_RATIO_MEMBER.NOTE?.slice(1) ||
                "Adjust the contribution ratio for each member. The total must equal 100%."}
            </Text>
          </SectionComponent>

          <SectionComponent rootClassName="mb-4 rounded-lg bg-white p-5 shadow-sm">
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-medium">
                Tổng tỉ lệ đóng góp:
              </Text>
              <View className="flex-row items-center">
                <Text
                  style={{
                    color: handler.getTotalColor(),
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  {displayTotal}%
                </Text>
              </View>
            </View>
            <ProgressBar
              progress={localTotal / 100}
              color={handler.getTotalColor()}
              className="mt-3 h-2 rounded-full"
            />
          </SectionComponent>
          <SectionComponent rootClassName="rounded-lg bg-white p-5 shadow-sm">
            <Text className="mb-4 text-base font-semibold text-gray-800">
              {TEXT_TRANSLATE_GROUP_RATIO_MEMBER.MEMBER_LIST_HEADER ||
                "Member Contributions"}
            </Text>

            {members.map((member) => {
              const currentValue = localSliderValues[member.id];
              const displayValue = Math.round(currentValue);
              const showTooltip = isDragging && tooltipValue.id === member.id;

              return (
                <View
                  key={member.id}
                  className="mb-6 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                >
                  <View className="mb-3 flex-row items-center">
                    <Image
                      source={member.avatar || Admin}
                      className="mr-3 h-12 w-12 rounded-full border border-gray-200"
                      resizeMode="cover"
                    />
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-800">
                        {member.name} {member.isYou ? "(Bạn)" : ""}
                      </Text>
                    </View>
                    <TextInput
                      className="min-w-[60px] rounded-full bg-[#E8F5E9] px-3 py-1 text-center font-bold text-[#4CAF50]"
                      value={displayValue.toString()}
                      keyboardType="numeric"
                      maxLength={3}
                      onChangeText={(text) =>
                        handler.handleInputChange(member.id, text)
                      }
                      selectTextOnFocus
                    />
                  </View>

                  <View className="flex-row items-center">
                    <Text className="w-8 text-xs text-gray-500">0%</Text>
                    <View style={{ flex: 1, height: 40 }}>
                      {showTooltip && (
                        <SliderTooltip value={tooltipValue.value} />
                      )}
                      <Slider
                        style={{ width: "100%", height: "100%" }}
                        minimumValue={0}
                        maximumValue={100}
                        step={1}
                        value={currentValue}
                        onSlidingStart={() =>
                          handler.handleSliderStart(member.id)
                        }
                        onValueChange={(value) =>
                          handler.handleSliderChange(member.id, value)
                        }
                        onSlidingComplete={() =>
                          handler.handleSliderComplete(member.id)
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
            })}
          </SectionComponent>
        </View>
      </ScrollViewCustom>

      <View className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-6 py-4 shadow-lg">
        <Pressable
          onPress={handler.handleUpdate}
          className={`${
            displayTotal === 100 ? "bg-[#609084]" : "bg-gray-400"
          } items-center rounded-lg py-4`}
          disabled={displayTotal !== 100}
        >
          <Text className="text-base font-semibold text-white">
            {TEXT_TRANSLATE_GROUP_RATIO_MEMBER.BUTTON?.UPDATE ||
              "Update Ratios"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaViewCustom>
  );
};

export default GroupRatioMemberPage;
