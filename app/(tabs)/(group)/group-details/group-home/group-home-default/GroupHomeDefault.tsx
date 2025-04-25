import ArrowDown from "@/assets/icons/arrow-down-short-wide.png";
import ArrowUp from "@/assets/icons/arrow-up-wide-short.png";
import { SafeAreaViewCustom } from "@/components";
import { TRANSACTION_STATUS, TRANSACTION_TYPE_TEXT } from "@/enums/globals";
import { Colors } from "@/helpers/constants/color";
import {
  formatCurrency,
  formatDateMonthYear,
  formatTime,
} from "@/helpers/libs";
import { GroupLogs } from "@/types/group.type";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
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

const GroupHomeDefault = () => {
  const { BUTTON, TEXT } = TEXT_TRANSLATE_GROUP_HOME_DEFAULT;
  const { state, handler } = useGroupHomeDefault();

  const highlightAndBreakText = (text: string, highlightStyle: any) => {
    if (!text) return null;
    const parts = text.split(/(\[.*?\])/);
    return parts.flatMap((part: string, index: number) => {
      if (part.startsWith("[") && part.endsWith("]")) {
        return (
          <Text key={`bracket-${index}`} style={highlightStyle}>
            {part.substring(1, part.length - 1)}
          </Text>
        );
      } else {
        const lines = part.split(/\\n|\n/);
        return lines.map((line, lineIndex) => (
          <React.Fragment key={`line-${index}-${lineIndex}`}>
            {lineIndex > 0 && <Text>{"\n"}</Text>}
            <Text>{line}</Text>
          </React.Fragment>
        ));
      }
    });
  };

  const HeaderSection = () => (
    <View className="relative z-10 h-14 items-center justify-center bg-white shadow-sm">
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute left-4 h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm"
      >
        <AntDesign name="arrowleft" size={24} />
      </TouchableOpacity>
      <Text className="text-center text-lg font-bold">
        {state.groupDetail?.name}
      </Text>
    </View>
  );

  const GroupInfoSection = () => (
    <>
      {state.groupDetail?.imageUrl ? (
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
      ) : (
        <View className="h-60 w-full items-center justify-center bg-primary">
          <Text className="text-4xl font-medium uppercase text-white">
            {state.groupDetail?.name?.charAt(0)}
          </Text>
        </View>
      )}

      <View className="mx-4 -mt-24 rounded-3xl bg-white p-4 shadow-sm shadow-gray-600">
        <View className="mb-2 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="mr-2 rounded-full bg-primary/10 p-2">
              <FontAwesome
                name="money"
                size={20}
                color={Colors.colors.primary}
              />
            </View>
            <Text className="flex-1 text-xl font-bold">
              {state.groupDetail?.name}
            </Text>
          </View>
        </View>
        <Text className="mt-1 text-3xl font-bold">
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
        </View>
      </View>
    </>
  );

  const QuickActionsSection = () => {
    return (
      <View className="mx-4 mt-5 rounded-3xl bg-white p-4 shadow-lg">
        <Text className="mb-4 text-lg font-bold">{BUTTON.FUND_FACILITIES}</Text>
        <View className={`justify-around" w-full flex-row`}>
          {state.isLeader ? (
            <>
              <TouchableOpacity
                className="mx-2 flex-1 items-center justify-center"
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
                className="mx-2 flex-1 items-center justify-center"
                onPress={() => handler.handlePress(state.RECENT_ACTIVITIES)}
              >
                <View className="mb-3 rounded-full bg-primary/10 p-4">
                  <MaterialIcons
                    name="wallet"
                    size={28}
                    color={Colors.colors.primary}
                  />
                </View>
                <Text className="text-sm font-bold text-primary">
                  Giao dịch
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="mx-2 flex-1 items-center justify-center"
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
            </>
          ) : (
            <View className="flex w-full flex-row justify-center space-x-20">
              <TouchableOpacity
                className="items-center justify-center"
                onPress={() => handler.handlePress(state.RECENT_ACTIVITIES)}
              >
                <View className="mb-3 rounded-full bg-primary/10 p-4">
                  <MaterialIcons
                    name="wallet"
                    size={28}
                    color={Colors.colors.primary}
                  />
                </View>
                <Text className="text-sm font-bold text-primary">
                  Giao dịch
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="items-center justify-center"
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
          )}
        </View>
      </View>
    );
  };

  const EmptyStateView = ({ message = "Không có lịch sử" }) => (
    <View className="items-center py-8">
      <View className="mb-4 rounded-full bg-gray-100/80 p-5">
        <FontAwesome name="inbox" size={32} color={Colors.colors.primary} />
      </View>
      <Text className="text-base text-gray-500">{message}</Text>
    </View>
  );

  const RecentActivityItem = ({
    activity,
    index,
  }: {
    activity: any;
    index: number;
  }) => (
    <View
      key={activity?.id || index}
      className="relative mb-3 rounded-2xl bg-white p-2 shadow-sm"
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
            className={`${activity?.type === TRANSACTION_TYPE_TEXT.INCOME ? "text-green" : "text-red"} text-xs font-bold`}
          >
            {activity?.type === TRANSACTION_TYPE_TEXT.INCOME
              ? "Góp quỹ"
              : "Rút quỹ"}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="mr-4 flex-1 flex-row items-center space-x-3">
            {activity?.avatarUrl ? (
              <Image
                source={{ uri: activity.avatarUrl }}
                className="h-12 w-12 rounded-full"
              />
            ) : (
              <LinearGradient
                colors={["#609084", "#4A7A70"]}
                className="h-12 w-12 items-center justify-center rounded-full shadow-md"
              >
                <Text className="text-2xl font-semibold uppercase text-white">
                  {activity?.createdBy?.charAt(0)}
                </Text>
              </LinearGradient>
            )}
            <View className="flex-1">
              <Text className="text-base font-bold">{activity?.createdBy}</Text>
              <Text className="text-ellipsis text-gray-600" numberOfLines={2}>
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
      </View>
      <View className="mt-4 flex-row items-center justify-between border-t border-gray-100 pt-3">
        {activity?.status === TRANSACTION_STATUS.APPROVED ? (
          <>
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={14} color="#609084" />
              <Text className="ml-1 text-xs text-gray-500">Đã xác nhận</Text>
            </View>
            <View className="flex-row items-center rounded-full bg-gray-50 px-3 py-1.5">
              <MaterialIcons name="access-time" size={12} color="#666" />
              <Text className="ml-1 text-xs font-medium text-gray-600">
                {formatTime(activity?.createdDate)} ·{" "}
                {formatDateMonthYear(activity?.createdDate)}
              </Text>
            </View>
          </>
        ) : (
          <>
            <View className="flex-row items-center">
              <Ionicons name="close-circle" size={14} color="#F43F5E" />
              <Text className="ml-1 text-xs text-gray-500">Đã từ chối</Text>
            </View>
            <View className="flex-row items-center rounded-full bg-gray-50 px-3 py-1.5">
              <MaterialIcons name="access-time" size={12} color="#666" />
              <Text className="ml-1 text-xs font-medium text-gray-600">
                {formatTime(activity?.createdDate)} ·{" "}
                {formatDateMonthYear(activity?.createdDate)}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );

  const LogItem = ({ activity }: { activity: GroupLogs }) => (
    <View
      key={activity?.id}
      className="relative mb-3 rounded-2xl bg-white p-2 shadow-sm"
    >
      <View className="flex-row items-center space-x-2">
        {activity?.imageUrl ? (
          <View className="h-12 w-12 rounded-full border-2 border-primary/20 p-0.5">
            <Image
              source={{ uri: activity?.imageUrl }}
              className="h-full w-full rounded-full"
            />
          </View>
        ) : (
          <LinearGradient
            colors={["#609084", "#4A7A70"]}
            className="h-12 w-12 items-center justify-center rounded-full shadow-md"
          >
            <Text className="text-3xl font-semibold uppercase text-white">
              {activity?.changedBy?.charAt(0)}
            </Text>
          </LinearGradient>
        )}
        <View className="flex-1 pl-1">
          <View className="flex-row items-center">
            <Text className="text-base font-bold">{activity?.changedBy}</Text>
          </View>
          <Text className="mt-1 text-ellipsis text-gray-600" numberOfLines={2}>
            {highlightAndBreakText(activity?.changeDescription || "No Title", {
              color: Colors.colors.primary,
              fontWeight: "bold",
            })}
          </Text>
        </View>
      </View>
      <View className="mt-4 flex-row items-center justify-between border-t border-gray-100 pt-3">
        <View className="flex-row items-center">
          <Ionicons name="checkmark-circle" size={14} color="#609084" />
          <Text className="ml-1 text-xs text-gray-500">Đã xác nhận</Text>
        </View>
        <View className="flex-row items-center rounded-full bg-gray-50 px-3 py-1.5">
          <MaterialIcons name="access-time" size={12} color="#666" />
          <Text className="ml-1 text-xs font-medium text-gray-600">
            {formatTime(activity?.createdDate)} ·{" "}
            {formatDateMonthYear(activity?.createdDate)}
          </Text>
        </View>
      </View>
    </View>
  );

  const ViewAllButton = ({ type }: { type: string }) => (
    <TouchableOpacity
      className="mt-1 flex-row items-center justify-center rounded-full"
      onPress={() => handler.handlePress(type)}
    >
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
    <View className="mx-4 mt-5 rounded-3xl bg-white p-4 shadow-lg">
      <Text className="mb-4 text-lg font-bold">{title}</Text>
      {children}
    </View>
  );

  const RecentActivitiesSection = () => {
    const totalTransactions = state.groupTransaction?.length ?? 0;
    return (
      <CardSection title={TEXT.RECENT_ACTIVITIES}>
        {state.groupTransaction?.length === 0 ? (
          <EmptyStateView />
        ) : (
          <>
            {state.groupTransaction
              ?.slice(0, 3)
              ?.map((activity, index) => (
                <RecentActivityItem
                  key={activity?.id || index}
                  activity={activity}
                  index={totalTransactions - index}
                />
              ))}

            {totalTransactions >= 1 && (
              <ViewAllButton type={state.RECENT_ACTIVITIES} />
            )}
          </>
        )}
      </CardSection>
    );
  };

  const EditLogSection = () => {
    const totalLogs = state.groupLogs?.length ?? 0;
    return (
      <CardSection title={TEXT.EDIT_LOG}>
        {state.groupLogs?.length === 0 ? (
          <EmptyStateView />
        ) : (
          <>
            {state.groupLogs
              ?.slice(0, 3)
              ?.map((activity, index) => (
                <LogItem key={activity?.id || index} activity={activity} />
              ))}

            {totalLogs >= 3 && <ViewAllButton type={state.EDIT_LOGS} />}
          </>
        )}
      </CardSection>
    );
  };

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
        <RecentActivitiesSection />
        <EditLogSection />
        <View className="h-24" />
      </ScrollView>
    </SafeAreaViewCustom>
  );
};

export default GroupHomeDefault;
