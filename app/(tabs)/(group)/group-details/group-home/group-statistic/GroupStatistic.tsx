import {
  LoadingSectionWrapper,
  ProgressCircleComponent,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import { Colors } from "@/helpers/constants/color";
import { formatCurrency, formatDate } from "@/helpers/libs";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TEXT_TRANSLATE_GROUP_STATISTIC from "./GroupStatistic.translate";
import useGroupStatistic from "./hooks/useGroupStatistic";
import { PieChart } from "react-native-gifted-charts";

export default function GroupStatisticPage() {
  const { state, handler } = useGroupStatistic();
  const { LABELS } = TEXT_TRANSLATE_GROUP_STATISTIC;

  return (
    <SafeAreaViewCustom rootClassName="bg-[#f5f7fa] flex-1">
      <SectionComponent rootClassName="h-14 bg-white justify-center relative shadow-sm">
        <TouchableOpacity
          onPress={handler.handleGoBack}
          className="absolute left-4 rounded-full bg-gray-50 p-2"
        >
          <MaterialIcons name="arrow-back" size={24} />
        </TouchableOpacity>
        <View className="items-center justify-between">
          <Text className="text-lg font-bold">
            {TEXT_TRANSLATE_GROUP_STATISTIC.TITLE.GROUP_STATISTIC}
          </Text>
        </View>
      </SectionComponent>

      <LoadingSectionWrapper isLoading={state.isLoading}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          <View className="space-y-4 p-4">
            {state.hasGroupName && (
              <SectionComponent rootClassName="rounded-2xl bg-white p-5 shadow-md">
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
                  {state.createdDate && (
                    <View className="mt-3 flex-row items-center justify-between rounded-lg bg-[#F5F7FA] p-3">
                      <View className="flex-row items-center py-1">
                        <MaterialIcons
                          name="calendar-month"
                          size={18}
                          color={Colors.colors.primary}
                        />
                        <Text className="ml-2 font-medium text-gray-700">
                          {LABELS.START_DATE}:{" "}
                          {formatDate(state.createdDate, "DD.MM.YYYY")}
                        </Text>
                      </View>
                    </View>
                  )}
                  {state.dueDate && state.dueDate !== "N/A" && (
                    <View className="mt-3 flex-row items-center justify-between rounded-lg bg-[#F5F7FA] p-3">
                      <View className="flex-row items-center">
                        <MaterialIcons
                          name="event"
                          size={18}
                          color={Colors.colors.primary}
                        />
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
              </SectionComponent>
            )}
            <SectionComponent rootClassName="rounded-2xl bg-white p-5 shadow-md">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-lg font-bold">Tổng quan</Text>
              </View>
              <View className="flex-row">
                <View className="mr-2 flex-[0.35] items-center justify-center">
                  {state.groupDetail?.totalIncome &&
                  state.groupDetail.totalIncome > 0 ? (
                    <PieChart
                      data={[
                        {
                          value: Math.min(
                            state.groupDetail.totalExpense ?? 0,
                            state.groupDetail.totalIncome ?? 0,
                          ),
                          color: "#F87171",
                        },
                        {
                          value: Math.max(
                            (state.groupDetail.totalIncome ?? 0) -
                              (state.groupDetail.totalExpense ?? 0),
                            0,
                          ),
                          color: "#60A5FA",
                        },
                      ]}
                      donut
                      showText
                      radius={60}
                      innerRadius={30}
                      sectionAutoFocus
                    />
                  ) : (
                    <Text className="text-sm text-gray-400">
                      Chưa có dữ liệu
                    </Text>
                  )}
                </View>

                <View className="ml-5 flex-[0.65] justify-center space-y-6">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 flex-row items-center gap-3">
                      <View className="rounded-full bg-green/10 p-1.5">
                        <MaterialIcons
                          name="arrow-upward"
                          size={16}
                          color={Colors.colors.primary}
                        />
                      </View>
                      <Text className="text-sm font-medium text-green">
                        Đã góp:
                      </Text>
                    </View>
                    <Text
                      className="min-w-[100px] text-right text-base font-semibold text-green"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {formatCurrency(state.groupDetail?.totalIncome ?? 0)}
                    </Text>
                  </View>

                  {/* Đã rút */}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1 flex-row items-center gap-3">
                      <View className="rounded-full bg-red/10 p-1.5">
                        <MaterialIcons
                          name="arrow-downward"
                          size={16}
                          color={Colors.colors.red}
                        />
                      </View>
                      <Text className="text-sm font-medium text-red">
                        Đã rút:
                      </Text>
                    </View>
                    <Text
                      className="min-w-[100px] text-right text-base font-semibold text-red"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {formatCurrency(state.groupDetail?.totalExpense ?? 0)}
                    </Text>
                  </View>

                  {/* Còn lại */}
                  <View className="border-t border-gray-200 pt-4">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1 flex-row items-center gap-3">
                        <View className="rounded-full bg-blue-100 p-1.5">
                          <MaterialIcons
                            name="account-balance-wallet"
                            size={16}
                            color={Colors.colors.blue}
                          />
                        </View>
                        <Text className="text-sm font-bold text-blue-400">
                          Còn lại:
                        </Text>
                      </View>
                      <Text
                        className="min-w-[100px] text-right text-base font-bold text-blue-400"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {formatCurrency(state.groupDetail?.currentBalance ?? 0)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
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
