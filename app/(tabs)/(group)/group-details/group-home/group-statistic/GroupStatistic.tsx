import Admin from "@/assets/images/logo/avatar_admin.jpg";
import {
  ProgressCircleComponent,
  SafeAreaViewCustom,
  SectionComponent,
  LoadingSectionWrapper,
} from "@/components";
import { formatCurrency } from "@/helpers/libs";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import TEXT_TRANSLATE_GROUP_STATISTIC from "./GroupStatistic.translate";
import useGroupStatistic from "./hooks/useGroupStatistic";

export default function GroupStatisticPage() {
  const { state, handler } = useGroupStatistic();
  const { LABELS } = TEXT_TRANSLATE_GROUP_STATISTIC;

  if (!state.isLoading && (!state.isGoalActive || !state.hasFinancialGoal)) {
    return (
      <SafeAreaViewCustom rootClassName="bg-[#f9f9f9] flex-1">
        <SectionComponent rootClassName="h-14 bg-white justify-center relative">
          <View className="flex-row items-center justify-between px-5">
            <Pressable onPress={handler.handleGoBack}>
              <MaterialIcons name="arrow-back" size={24} color="#609084" />
            </Pressable>
            <Text className="text-lg font-bold">
              {TEXT_TRANSLATE_GROUP_STATISTIC.TITLE.GROUP_STATISTIC}
            </Text>
            <Text></Text>
          </View>
        </SectionComponent>

        <View className="flex-1 items-center justify-center p-5">
          <Text className="text-center text-base text-gray-500">
            Nhóm chưa có mục tiêu tài chính nào được thiết lập.
          </Text>
        </View>
      </SafeAreaViewCustom>
    );
  }

  return (
    <SafeAreaViewCustom rootClassName="bg-[#f9f9f9] flex-1">
      {/* HEADER */}
      <SectionComponent rootClassName="h-14 bg-white justify-center relative">
        <View className="flex-row items-center justify-between px-5">
          <Pressable onPress={handler.handleGoBack}>
            <MaterialIcons name="arrow-back" size={24} color="#609084" />
          </Pressable>
          <Text className="text-lg font-bold">
            {TEXT_TRANSLATE_GROUP_STATISTIC.TITLE.GROUP_STATISTIC}
          </Text>
          <Text></Text>
        </View>
      </SectionComponent>

      <LoadingSectionWrapper isLoading={state.isLoading}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View className="p-4">
            {/* Group Target Info */}
            <SectionComponent rootClassName="rounded-2 bg-white p-4 shadow-sm">
              <Text className="text-base font-semibold">
                {LABELS.GROUP_TARGET}: {state.goalName} ({state.members.length}{" "}
                thành viên)
              </Text>
              <View className="mt-2 flex-row items-center space-x-3">
                <View>
                  <ProgressCircleComponent
                    value={state.groupCurrent / state.groupGoal}
                    size={60}
                    thickness={4}
                    showPercentage={true}
                  />
                </View>
                <View className="gap-1">
                  <Text>
                    <Text className="text-lg font-semibold text-[#609084]">
                      {formatCurrency(state.groupCurrent)}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {" / "}
                      {formatCurrency(state.groupGoal)}
                    </Text>
                  </Text>
                  <Text className="text-sm text-[#848484]">
                    {LABELS.REMAINING}: {formatCurrency(state.remain)}
                  </Text>
                  <Text className="text-sm">
                    <Text className="font-semibold text-gray-500">
                      {LABELS.DUE_DATE}: {state.dueDate}
                    </Text>
                    <Text className="text-gray-500">
                      {" "}
                      (còn lại {state.remainDays} ngày)
                    </Text>
                  </Text>
                </View>
              </View>
            </SectionComponent>

            {/* Members List */}
            <SectionComponent rootClassName="mt-4 rounded-[10px] bg-white p-4 shadow-sm">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-base font-semibold">
                  {LABELS.MEMBER_LIST}
                </Text>
              </View>
              {state.members?.length > 0 &&
                state.members?.map((member) => (
                  <View
                    key={member.id}
                    className="flex-row items-center justify-between py-2"
                  >
                    <Image
                      source={member.avatar ? member.avatar : Admin}
                      className="h-12 w-12 rounded-full"
                      resizeMode="cover"
                    />
                    <View className="ml-3 mr-2 flex-1">
                      <View className="flex-row items-center">
                        <Text className="text-base font-semibold">
                          {member.name}
                        </Text>
                        {/* {member.hasFundedEnough && (
                          <View className="ml-2 rounded-md bg-[#E6F2EF] px-2 py-0.5">
                            <Text className="text-xs font-medium text-[#609084]">
                              {LABELS.FUNDED}
                            </Text>
                          </View>
                        )} */}
                      </View>
                      {/* <Text className="text-sm text-gray-500">
                        {LABELS.CONTRIBUTE_RATIO}: {member.ratio}%
                      </Text> */}
                      <Text className="pt-1 text-sm">
                        <Text className="text-[#848484]">
                          {LABELS.CONTRIBUTED}
                        </Text>
                        {/* <Text className="text-base font-semibold text-[#609084]">
                          {formatCurrency(member.contributed)}
                        </Text>
                        <Text className="text-[#848484]">
                          {" "}
                          / {formatCurrency(member.target)}
                        </Text> */}
                      </Text>
                    </View>
                    <View>
                      <ProgressCircleComponent
                        value={
                          member.target > 0
                            ? member.contributed / member.target
                            : 0
                        }
                        size={50}
                        thickness={4}
                        showPercentage={true}
                      />
                    </View>
                  </View>
                ))}
            </SectionComponent>
          </View>
        </ScrollView>
      </LoadingSectionWrapper>
    </SafeAreaViewCustom>
  );
}
