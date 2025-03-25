import React from "react";
import { Image, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import Slider from "@react-native-community/slider";
import { MaterialIcons } from "@expo/vector-icons";
import {
  SafeAreaViewCustom,
  ScrollViewCustom,
  SectionComponent,
} from "@/components";
import Admin from "@/assets/images/logo/avatar_admin.jpg";
import TEXT_TRANSLATE_GROUP_RATIO_MEMBER from "./GroupRatioMember.translate";
import useGroupRatioMember from "./hooks/useGroupRatioMember";

const GroupRatioMemberPage = () => {
  const { state, handler } = useGroupRatioMember();
  const { members, localSliderValues, activeSlider, displayTotal, localTotal } = state;

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

      <ScrollViewCustom showsVerticalScrollIndicator={false} isBottomTab={false} className="mb-24">
        <View className="p-4">
          <SectionComponent rootClassName="mb-4 rounded-lg bg-white p-5 shadow-sm">
            <Text className="text-sm text-gray-700 leading-5">
              <Text className="font-semibold text-[#609084]">* </Text>
              {TEXT_TRANSLATE_GROUP_RATIO_MEMBER.NOTE?.slice(1) ||
                "Adjust the contribution ratio for each member. The total must equal 100%."}
            </Text>
          </SectionComponent>

          <SectionComponent rootClassName="mb-4 rounded-lg bg-white p-5 shadow-sm">
            <View className="flex-row justify-between items-center">
              <Text className="text-base font-medium">Tổng tỉ lệ đóng góp:</Text>
              <View className="flex-row items-center">
                <Text style={{ color: handler.getTotalColor(), fontWeight: "bold", fontSize: 18 }}>
                  {displayTotal}%
                </Text>
              </View>
            </View>
            <View className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
              <View
                className="h-full"
                style={{
                  width: `${Math.min(localTotal, 100)}%`,
                  backgroundColor: handler.getTotalColor(),
                }}
              />
            </View>
          </SectionComponent>

          <SectionComponent rootClassName="rounded-lg bg-white p-5 shadow-sm">
            <Text className="text-base font-semibold mb-4 text-gray-800">
              {TEXT_TRANSLATE_GROUP_RATIO_MEMBER.MEMBER_LIST_HEADER || "Member Contributions"}
            </Text>

            {members.map((member) => {
              const currentValue = localSliderValues[member.id];
              const displayValue = Math.round(currentValue);

              return (
                <View
                  key={member.id}
                  className="mb-6 border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                >
                  <View className="flex-row items-center mb-3">
                    <Image
                      source={member.avatar || Admin}
                      className="h-12 w-12 rounded-full mr-3 border border-gray-200"
                      resizeMode="cover"
                    />
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-800">
                        {member.name} {member.isYou ? "(Bạn)" : ""}
                      </Text>
                    </View>
                    <TextInput
                      className="bg-[#E8F5E9] px-3 py-1 rounded-full min-w-[60px] text-center text-[#4CAF50] font-bold"
                      value={displayValue.toString()}
                      keyboardType="numeric"
                      maxLength={3}
                      onChangeText={(text) => handler.handleInputChange(member.id, text)}
                      selectTextOnFocus
                    />
                  </View>

                  <View className="flex-row items-center">
                    <Text className="text-xs text-gray-500 w-8">0%</Text>
                    <Slider
                      style={{ flex: 1, height: 40 }}
                      minimumValue={0}
                      maximumValue={100}
                      step={1}
                      value={currentValue}
                      onSlidingStart={() => {
                        handler.setActiveSlider(member.id);
                      }}
                      onValueChange={(value: number) => {
                        if (activeSlider === member.id) {
                          handler.adjustOtherMembers(member.id, value);
                        }
                      }}
                      onSlidingComplete={() => {
                        handler.updateMemberRatio(
                          member.id,
                          Math.round(localSliderValues[member.id])
                        );
                        handler.setActiveSlider(null);
                      }}
                      minimumTrackTintColor="#609084"
                      maximumTrackTintColor="#d1d5db"
                      thumbTintColor="#609084"
                    />
                    <Text className="text-xs text-gray-500 w-10 text-right">100%</Text>
                  </View>
                </View>
              );
            })}
          </SectionComponent>
        </View>
      </ScrollViewCustom>

      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-6 shadow-lg">
        <Pressable
          onPress={handler.handleUpdate}
          className={`${
            displayTotal === 100 ? "bg-[#609084]" : "bg-gray-400"
          } rounded-lg py-4 items-center`}
          disabled={displayTotal !== 100}
        >
          <Text className="text-white text-base font-semibold">
            {TEXT_TRANSLATE_GROUP_RATIO_MEMBER.BUTTON?.UPDATE || "Update Ratios"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaViewCustom>
  );
};

export default GroupRatioMemberPage;