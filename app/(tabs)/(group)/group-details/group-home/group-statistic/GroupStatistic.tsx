import {
  LoadingSectionWrapper,
  ProgressCircleComponent,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import { formatCurrency } from "@/helpers/libs";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import TEXT_TRANSLATE_GROUP_STATISTIC from "./GroupStatistic.translate";
import useGroupStatistic from "./hooks/useGroupStatistic";

export default function GroupStatisticPage() {
  const { state, handler } = useGroupStatistic();
  const { LABELS } = TEXT_TRANSLATE_GROUP_STATISTIC;

  return (
    <SafeAreaViewCustom rootClassName="bg-[#f5f7fa] flex-1">
      <SectionComponent rootClassName="h-14 bg-white justify-center relative shadow-sm">
        <Pressable
          onPress={handler.handleGoBack}
          className="absolute left-4 h-10 w-10 items-center justify-center rounded-full"
        >
          <MaterialIcons name="arrow-back" size={24} />
        </Pressable>
        <View className="items-center justify-between">
          <Text className="text-lg font-bold">
            {TEXT_TRANSLATE_GROUP_STATISTIC.TITLE.GROUP_STATISTIC}
          </Text>
        </View>
      </SectionComponent>

      <LoadingSectionWrapper isLoading={state.isLoading}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View className="space-y-4 p-4">
            <SectionComponent rootClassName="rounded-2xl bg-white p-5 shadow-md">
              {state.hasGroupName ? (
                <>
                  <View className="mb-3 flex-row items-center justify-between">
                    <Text className="text-lg font-bold">
                      {LABELS.GROUP_TARGET}
                    </Text>
                    <View className="rounded-full bg-[#E6F2EF] px-3 py-1">
                      <Text className="text-sm font-medium text-primary">
                        {state.members.length} thành viên
                      </Text>
                    </View>
                  </View>

                  <Text className="mb-4 text-base font-semibold text-primary">
                    {state.goalName}
                  </Text>

                  <View className="mb-2 rounded-xl bg-[#F8FBFA] p-4">
                    <View className="flex-row items-center space-x-4">
                      <View>
                        <ProgressCircleComponent
                          value={
                            Math.floor(
                              (state.groupCurrent / state.groupGoal > 1
                                ? 1
                                : state.groupCurrent / state.groupGoal) * 100,
                            ) / 100
                          }
                          size={70}
                          thickness={6}
                          showPercentage={true}
                        />
                      </View>
                      <View className="flex-1 gap-2">
                        <Text>
                          <Text className="text-xl font-bold text-primary">
                            {formatCurrency(state.groupCurrent)}
                          </Text>
                          <Text className="text-sm text-gray-500">
                            {" / "}
                            {formatCurrency(state.groupGoal)}
                          </Text>
                        </Text>
                        <Text className="text-sm font-medium text-[#848484]">
                          {LABELS.REMAINING}: {formatCurrency(state.remain)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {state.dueDate && state.dueDate !== "N/A" && (
                    <View className="mt-3 flex-row items-center justify-between rounded-lg bg-[#F5F7FA] p-3">
                      <View className="flex-row items-center">
                        <MaterialIcons name="event" size={18} color="#609084" />
                        <Text className="ml-2 font-medium text-gray-700">
                          {LABELS.DUE_DATE}: {state.dueDate}
                        </Text>
                      </View>
                      <Text
                        className={`rounded-md px-2 py-1 text-xs font-bold ${
                          state.groupCurrent >= state.groupGoal
                            ? "bg-green/10 text-green"
                            : "bg-red/10 text-red"
                        }`}
                      >
                        {state.groupCurrent >= state.groupGoal ? (
                          <>Đã hoàn thành</>
                        ) : state.remainDays.days > 0 ? (
                          <>Còn {state.remainDays.days} ngày</>
                        ) : state.remainDays.hours > 0 ? (
                          <>Còn {state.remainDays.hours} giờ</>
                        ) : state.remainDays.minutes > 0 ? (
                          <>Còn {state.remainDays.minutes} phút</>
                        ) : (
                          <>Chưa hoàn thành</>
                        )}
                      </Text>
                    </View>
                  )}
                </>
              ) : (
                <View className="items-center py-3">
                  <Text className="mb-3 text-base font-medium text-primary">
                    Tổng số tiền đã đóng góp
                  </Text>
                  <Text className="mb-2 text-4xl font-bold text-[#2A3240]">
                    {formatCurrency(state.groupCurrent)}
                  </Text>
                  <View className="mt-1 h-1 w-16 rounded-full bg-primary text-primary opacity-70" />
                </View>
              )}
            </SectionComponent>

            <SectionComponent rootClassName="rounded-2xl bg-white p-5 shadow-md">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-lg font-bold">{LABELS.MEMBER_LIST}</Text>
                <View className="rounded-full bg-[#E6F2EF] px-3 py-1">
                  <Text className="text-sm font-medium text-primary">
                    {state.members?.length || 0} người
                  </Text>
                </View>
              </View>
              <View>
                <Text>Đã góp: </Text>
                <Text>Đã rút:</Text>
                <Text>Còn lại:</Text>
              </View>

              {state.members?.length > 0 ? (
                <View className="space-y-1">
                  {state.members?.map((member, index) => (
                    <View
                      key={member.id}
                      className={`flex-row items-center justify-between px-2 py-3 ${
                        index < state.members.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                    >
                      {member?.avatar ? (
                        <Image
                          source={member.avatar}
                          className="h-14 w-14 rounded-full"
                          resizeMode="cover"
                        />
                      ) : (
                        <LinearGradient
                          colors={["#609084", "#4A7A70"]}
                          className="h-14 w-14 items-center justify-center rounded-full shadow-md"
                        >
                          <Text className="text-2xl font-semibold uppercase text-white">
                            {member?.name?.charAt(0)}
                          </Text>
                        </LinearGradient>
                      )}

                      <View className="ml-3 mr-2 flex-1">
                        <View className="flex-row items-center">
                          <Text
                            className="text-ellipsis text-base font-semibold text-[#2A3240]"
                            numberOfLines={1}
                          >
                            {member.name}
                          </Text>
                        </View>
                        <View className="mt-1 flex-row items-center">
                          <Text className="text-sm text-[#848484]">
                            {LABELS.CONTRIBUTED}:{" "}
                          </Text>
                          <Text className="text-base font-bold text-primary">
                            {formatCurrency(member.contributed)}
                          </Text>
                        </View>
                      </View>

                      <View className="rounded-lg p-1">
                        <ProgressCircleComponent
                          value={member.ratio / 100}
                          // exactPercentage={member.ratio}
                          size={60}
                          thickness={4}
                          showPercentage={true}
                          percentageTextStyle={{
                            fontSize: 12,
                          }}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View className="items-center py-6">
                  <MaterialIcons name="group-off" size={40} color="#CCCCCC" />
                  <Text className="mt-2 text-center text-sm text-gray-500">
                    Chưa có thành viên nào trong nhóm
                  </Text>
                </View>
              )}
            </SectionComponent>
          </View>
        </ScrollView>
      </LoadingSectionWrapper>
    </SafeAreaViewCustom>
  );
}
