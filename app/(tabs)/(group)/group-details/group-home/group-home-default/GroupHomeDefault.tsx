import ArrowDown from "@/assets/icons/arrow-down-short-wide.png";
import ArrowUp from "@/assets/icons/arrow-up-wide-short.png";
import AdminAvatar from "@/assets/images/logo/avatar_admin.jpg";
import { SafeAreaViewCustom, SectionComponent } from "@/components";
import { TRANSACTION_TYPE_TEXT } from "@/enums/globals";
import { Colors } from "@/helpers/constants/color";
import {
  formatCurrency,
  formatDateMonthYear,
  formatTime,
} from "@/helpers/libs";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ImageBackground,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TEXT_TRANSLATE_GROUP_HOME_DEFAULT from "./GroupHomeDefault.translate";
import useGroupHomeDefault from "./hooks/useGroupHomeDefault";

const GroupHomeDefault = () => {
  const { BUTTON, TEXT } = TEXT_TRANSLATE_GROUP_HOME_DEFAULT;
  const { state, handler } = useGroupHomeDefault();

  return (
    <SafeAreaViewCustom>
      <SectionComponent rootClassName="h-14 bg-white justify-center items-center relative">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-4"
        >
          <AntDesign name="arrowleft" size={24} color="#000000" />
        </TouchableOpacity>
        <Text className="text-center text-lg font-bold">
          {state.groupDetail?.name}
        </Text>
        <View className="w-8" />
      </SectionComponent>
      <ScrollView
        className="flex-1 bg-gray-100"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={state.refreshing}
            onRefresh={handler.handleRefetchData}
          />
        }
      >
        {/* Header */}
        <ImageBackground
          source={{
            uri: state.groupDetail?.imageUrl,
          }}
          className="relative h-52 w-full"
          resizeMode="stretch"
        />
        <View className="mx-4 mt-8 rounded-2xl bg-white p-4 shadow-md">
          <Text className="text-lg font-bold">
            💰 {state.groupDetail?.name}
          </Text>
          <Text className="text-2xl font-bold text-gray-800">
            {formatCurrency(state.groupDetail?.currentBalance as number)}
          </Text>
          <Text className="mt-1 text-gray-500">
            {state.groupDetail?.description}
          </Text>
          <View className="mt-4 flex-row justify-between">
            <TouchableOpacity
              className="mx-1 flex-1 flex-row items-center justify-center rounded-full bg-thirdly/70 px-4 py-2"
              onPress={handler.handleCreateFundRequest}
            >
              <AntDesign name="plus" size={16} color={Colors.colors.primary} />
              <Text className="ml-2 text-base font-bold text-[#609084]">
                {BUTTON.CONTRIBUTE}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="mx-1 flex-1 flex-row items-center justify-center rounded-full bg-thirdly/70 px-4 py-2"
              onPress={handler.handleCreateWithdrawRequest}
            >
              <AntDesign name="swap" size={16} color={Colors.colors.primary} />
              <Text className="ml-2 text-base font-bold text-[#609084]">
                {BUTTON.WITHDRAW}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <SectionComponent rootClassName="mt-4 bg-white p-4 shadow-sm">
          <View className="w-full flex-row">
            <TouchableOpacity
              className="flex-1 items-center justify-center"
              onPress={handler.handleFundRemind}
            >
              <MaterialIcons
                name="trending-up"
                size={32}
                color={Colors.colors.primary}
              />
              <Text className="mt-2 text-base font-bold text-primary">
                {TEXT.REMIND_CONTRIBUTE}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 items-center justify-center"
              onPress={handler.handleStatistic}
            >
              <MaterialIcons
                name="bar-chart"
                size={32}
                color={Colors.colors.primary}
              />
              <Text className="mt-2 text-base font-bold text-primary">
                {TEXT.STATISTICS}
              </Text>
            </TouchableOpacity>
          </View>
        </SectionComponent>

        <SectionComponent>
          {/* Recent Activities */}
          <View className="z-10 mx-4 mt-4 rounded-2xl bg-white p-4 shadow-md">
            <Text className="mb-4 text-lg font-bold">
              {TEXT.RECENT_ACTIVITIES}
            </Text>
            {state.groupTransaction?.length === 0 ? (
              <View className="mb-1 items-center">
                <View className="rounded-[100%] bg-gray-100 p-3">
                  <FontAwesome
                    name="inbox"
                    size={32}
                    color={Colors.colors.primary}
                  />
                </View>
                <Text className="mt-2 text-gray-500">Không có lịch sử</Text>
              </View>
            ) : (
              <>
                {state.groupTransaction?.slice(0, 3)?.map((activity, index) => (
                  <View
                    key={activity?.id || index}
                    className={`relative flex-row items-center border-b border-gray-200 pb-6 pt-2 ${index === 0 && "border-t"}`}
                  >
                    <View>
                      <View className="my-1 flex-row items-center gap-x-1">
                        <Image
                          source={
                            activity?.type === TRANSACTION_TYPE_TEXT.INCOME
                              ? ArrowDown
                              : ArrowUp
                          }
                          className="h-5 w-5"
                          resizeMode="contain"
                        />
                        <Text
                          className={`${activity?.type === TRANSACTION_TYPE_TEXT.INCOME ? "text-green" : "text-red"} text-xs font-bold`}
                        >
                          {activity?.type === "INCOME" ? "Góp quỹ" : "Rút quỹ"}
                        </Text>
                      </View>
                      <View className="w-full flex-1 flex-row items-center justify-between">
                        <View className="flex-[0.7] flex-row space-x-3">
                          <Image
                            source={{ uri: activity.avatarUrl }}
                            className="h-9 w-9 rounded-full"
                          />
                          <View>
                            <Text className="flex-1 text-sm font-bold">
                              {activity?.createdBy}{" "}
                            </Text>
                            <Text>"{activity?.description}"</Text>
                          </View>
                        </View>
                        <View className="flex-[0.3]">
                          <Text
                            className={`text-right text-base font-bold ${
                              activity?.type === TRANSACTION_TYPE_TEXT.INCOME
                                ? "text-green"
                                : "text-red"
                            }`}
                          >
                            {activity?.type === TRANSACTION_TYPE_TEXT.INCOME
                              ? `+ ${formatCurrency(activity?.amount)}`
                              : `- ${formatCurrency(activity?.amount)}`}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View className="absolute bottom-1 right-0 flex-row">
                      <Text className="text-xs text-text-gray">
                        {formatTime(activity?.createdDate)} - {""}
                      </Text>
                      <Text className="text-xs text-text-gray">
                        {formatDateMonthYear(activity?.createdDate)}
                      </Text>
                    </View>
                  </View>
                ))}
                {(state.groupTransaction?.length ?? 0) >= 3 && (
                  <TouchableOpacity className="mt-4 flex-row items-center justify-center">
                    <Text className="pr-3 text-center font-bold text-[#609084]">
                      {BUTTON.VIEW_ALL}
                    </Text>
                    <AntDesign
                      name="right"
                      size={16}
                      color={Colors.colors.primary}
                    />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
          <View className="z-10 mx-4 mb-24 mt-4 rounded-2xl bg-white p-4 shadow-md">
            <Text className="mb-4 text-lg font-bold">{TEXT.EDIT_LOG}</Text>
            {state.groupLogs?.length === 0 ? (
              <View className="mb-1 items-center">
                <View className="rounded-[100%] bg-gray-100 p-3">
                  <FontAwesome
                    name="inbox"
                    size={32}
                    color={Colors.colors.primary}
                  />
                </View>
                <Text className="mt-2 text-gray-500">Không có lịch sử</Text>
              </View>
            ) : (
              <>
                {state.groupLogs?.slice(0, 3)?.map((activity, index) => (
                  <View
                    key={activity?.id || index}
                    className={`relative flex-row items-center border-b border-gray-200 pb-6 pt-2 ${index === 0 && "border-t"}`}
                  >
                    <View className="flex-1 flex-row items-center space-x-3">
                      <Image
                        source={
                          activity.imageUrl
                            ? { uri: activity.imageUrl }
                            : AdminAvatar
                        }
                        className="h-9 w-9 rounded-full"
                      />
                      <Text className="flex-1 text-sm font-bold">
                        {activity?.changedBy}{" "}
                        <Text className="font-normal">
                          {activity.changeDescription}
                        </Text>
                      </Text>
                    </View>
                    <View className="absolute bottom-1 right-0 flex-row">
                      <Text className="text-xs text-text-gray">
                        {formatTime(activity?.createdDate)} - {""}
                      </Text>
                      <Text className="text-xs text-text-gray">
                        {formatDateMonthYear(activity?.createdDate)}
                      </Text>
                    </View>
                  </View>
                ))}
                {(state.groupLogs?.length ?? 0) >= 3 && (
                  <TouchableOpacity className="mt-4 flex-row items-center justify-center">
                    <Text className="pr-3 text-center font-bold text-[#609084]">
                      {BUTTON.VIEW_ALL}
                    </Text>
                    <AntDesign
                      name="right"
                      size={16}
                      color={Colors.colors.primary}
                    />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </SectionComponent>
      </ScrollView>
    </SafeAreaViewCustom>
  );
};

export default GroupHomeDefault;
