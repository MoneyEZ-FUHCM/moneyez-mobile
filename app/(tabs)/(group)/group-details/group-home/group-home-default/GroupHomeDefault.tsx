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
import {
  AntDesign,
  Feather,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
import { GroupLogs } from "@/types/group.type";

const GroupHomeDefault = () => {
  const { BUTTON, TEXT } = TEXT_TRANSLATE_GROUP_HOME_DEFAULT;
  const { state, handler } = useGroupHomeDefault();

  // Helper components for better organization
  const HeaderSection = () => (
    <View className="relative z-10 h-14 items-center justify-center bg-white shadow-sm">
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute left-4 h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm"
      >
        <AntDesign name="arrowleft" size={20} color={Colors.colors.primary} />
      </TouchableOpacity>
      <Text className="text-center text-lg font-bold">
        {state.groupDetail?.name}
      </Text>
      <TouchableOpacity className="absolute right-4 h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm">
        <Feather name="more-horizontal" size={20} color="#000000" />
      </TouchableOpacity>
    </View>
  );

  const GroupInfoSection = () => (
    <>
      <ImageBackground
        source={{
          uri: state.groupDetail?.imageUrl,
        }}
        className="h-60 w-full"
        resizeMode="cover"
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          className="absolute bottom-0 left-0 right-0 h-32"
        />
      </ImageBackground>

      <View className="mx-4 -mt-16 rounded-3xl bg-white p-6 shadow-xl">
        <View className="mb-2 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="mr-2 rounded-full bg-primary/10 p-2">
              <FontAwesome
                name="money"
                size={20}
                color={Colors.colors.primary}
              />
            </View>
            <Text className="text-xl font-bold">{state.groupDetail?.name}</Text>
          </View>
        </View>
        <Text className="mt-1 text-3xl font-bold text-gray-800">
          {formatCurrency(state.groupDetail?.currentBalance as number)}
        </Text>
        <Text className="mb-4 mt-2 leading-5 text-gray-600">
          {state.groupDetail?.description}
        </Text>
        <View className="mt-2 flex-row justify-between gap-x-3">
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center rounded-full bg-primary/10 px-4 py-3.5 shadow-sm"
            onPress={handler.handleCreateFundRequest}
            style={{
              elevation: 1,
            }}
          >
            <AntDesign name="plus" size={18} color={Colors.colors.primary} />
            <Text className="ml-2 text-base font-bold text-primary">
              {BUTTON.CONTRIBUTE}
            </Text>
          </TouchableOpacity>
          {!state.isLeader && (
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center rounded-full bg-primary/10 px-4 py-3.5 shadow-sm"
              onPress={handler.handleCreateWithdrawRequest}
              style={{
                elevation: 1,
              }}
            >
              <AntDesign name="swap" size={18} color={Colors.colors.primary} />
              <Text className="ml-2 text-base font-bold text-primary">
                {BUTTON.WITHDRAW}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );

  const QuickActionsSection = () => (
    <View className="mx-4 mt-5 rounded-3xl bg-white shadow-lg">
      <Text className="mb-4 ml-1 text-lg font-bold">
        {BUTTON.FUND_FACILITIES}
      </Text>
      <View className="w-full flex-row justify-around">
        <TouchableOpacity
          className="mx-2 flex-1 items-center justify-center py-3"
          onPress={handler.handleFundRemind}
        >
          <View className="mb-3 rounded-full bg-primary/10 p-4">
            <MaterialIcons
              name="trending-up"
              size={28}
              color={Colors.colors.primary}
            />
          </View>
          <Text className="text-sm font-bold text-primary">
            {TEXT.REMIND_CONTRIBUTE}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="mx-2 flex-1 items-center justify-center py-3"
          onPress={handler.handleStatistic}
        >
          <View className="mb-3 rounded-full bg-primary/10 p-4">
            <MaterialIcons
              name="bar-chart"
              size={28}
              color={Colors.colors.primary}
            />
          </View>
          <Text className="text-sm font-bold text-primary">
            {TEXT.STATISTICS}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const EmptyStateView = ({ message = "Không có lịch sử" }) => (
    <View className="items-center py-8">
      <View className="mb-4 rounded-full bg-gray-100/80 p-5">
        <FontAwesome name="inbox" size={32} color={Colors.colors.primary} />
      </View>
      <Text className="text-base text-gray-500">{message}</Text>
    </View>
  );

  const TransactionItem = ({
    activity,
    index,
  }: {
    activity: any;
    index: number;
  }) => (
    <View
      key={activity?.id || index}
      className={`relative flex-row border-b border-gray-100 py-4 ${
        index === 0 ? "border-t border-t-gray-100" : ""
      }`}
    >
      <View className="flex-1">
        <View className="mb-2 flex-row items-center gap-x-2">
          <View
            className={`rounded-full p-1 ${activity?.type === TRANSACTION_TYPE_TEXT.INCOME ? "bg-green/10" : "bg-red/10"}`}
          >
            <Image
              source={
                activity?.type === TRANSACTION_TYPE_TEXT.INCOME
                  ? ArrowDown
                  : ArrowUp
              }
              className="h-4 w-4"
              resizeMode="contain"
            />
          </View>
          <Text
            className={`${
              activity?.type === TRANSACTION_TYPE_TEXT.INCOME
                ? "text-green"
                : "text-red"
            } text-xs font-bold`}
          >
            {activity?.type === TRANSACTION_TYPE_TEXT.INCOME
              ? "Góp quỹ"
              : "Rút quỹ"}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="mr-4 flex-1 flex-row items-center space-x-3">
            <Image
              source={{
                uri: activity.avatarUrl,
              }}
              className="h-12 w-12 rounded-full"
            />
            <View className="flex-1">
              <Text className="text-base font-bold">{activity?.createdBy}</Text>
              <Text className="text-gray-600" numberOfLines={2}>
                "{activity?.description}"
              </Text>
            </View>
          </View>

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

        <View className="absolute bottom-1 right-0 flex-row rounded-full bg-gray-50 px-2 py-0.5">
          <Text className="text-xs text-gray-500">
            {formatTime(activity?.createdDate)} -{" "}
            {formatDateMonthYear(activity?.createdDate)}
          </Text>
        </View>
      </View>
    </View>
  );

  const LogItem = ({
    activity,
    index,
  }: {
    activity: GroupLogs;
    index: number;
  }) => (
    <View
      key={activity?.id || index}
      className={`relative flex-row items-center border-b border-gray-100 py-4 ${
        index === 0 ? "border-t border-t-gray-100" : ""
      }`}
    >
      <View className="flex-1 flex-row items-center space-x-3">
        <Image
          source={activity.imageUrl ? { uri: activity.imageUrl } : AdminAvatar}
          className="h-12 w-12 rounded-full"
        />
        <View className="flex-1">
          <Text className="text-base font-bold">
            {activity?.changedBy}{" "}
            <Text className="font-normal text-gray-600">
              {activity.changeDescription}
            </Text>
          </Text>
        </View>
      </View>

      <View className="absolute bottom-1 right-0 flex-row rounded-full bg-gray-50 px-2 py-0.5">
        <Text className="text-xs text-gray-500">
          {formatTime(activity?.createdDate)} -{" "}
          {formatDateMonthYear(activity?.createdDate)}
        </Text>
      </View>
    </View>
  );

  const ViewAllButton = () => (
    <TouchableOpacity className="mt-4 flex-row items-center justify-center rounded-full bg-gray-50 py-3">
      <Text className="pr-2 text-center font-bold text-primary">
        {BUTTON.VIEW_ALL}
      </Text>
      <AntDesign name="right" size={16} color={Colors.colors.primary} />
    </TouchableOpacity>
  );

  const CardSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <View className="mx-4 mt-5 rounded-3xl bg-white p-6 shadow-lg">
      <Text className="mb-4 text-lg font-bold">{title}</Text>
      {children}
    </View>
  );

  return (
    <SafeAreaViewCustom>
      <HeaderSection />

      <ScrollView
        className="flex-1 bg-gray-50"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={state.refreshing}
            onRefresh={handler.handleRefetchData}
            colors={[Colors.colors.primary]}
            tintColor={Colors.colors.primary}
          />
        }
      >
        <GroupInfoSection />
        <QuickActionsSection />

        <CardSection title={TEXT.RECENT_ACTIVITIES}>
          {state.groupTransaction?.length === 0 ? (
            <EmptyStateView />
          ) : (
            <>
              {state.groupTransaction
                ?.slice(0, 3)
                ?.map((activity, index) => (
                  <TransactionItem
                    key={activity?.id || index}
                    activity={activity}
                    index={index}
                  />
                ))}

              {(state.groupTransaction?.length ?? 0) >= 3 && <ViewAllButton />}
            </>
          )}
        </CardSection>

        <CardSection title={TEXT.EDIT_LOG}>
          {state.groupLogs?.length === 0 ? (
            <EmptyStateView />
          ) : (
            <>
              {state.groupLogs
                ?.slice(0, 3)
                ?.map((activity, index) => (
                  <LogItem
                    key={activity?.id || index}
                    activity={activity}
                    index={index}
                  />
                ))}

              {(state.groupLogs?.length ?? 0) >= 3 && <ViewAllButton />}
            </>
          )}
        </CardSection>

        <View className="h-16" />
      </ScrollView>
    </SafeAreaViewCustom>
  );
};

export default GroupHomeDefault;
