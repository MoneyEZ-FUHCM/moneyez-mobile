import {
  FlatListCustom,
  LoadingSectionWrapper,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import { formatDateMonthYear, formatTime } from "@/helpers/libs";
import { GroupLogs } from "@/helpers/types/group.type";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import TEXT_TRANSLATE_EDIT_LOG_HISTORY from "./EditLogHistory.translate";
import useEditLogs from "./hooks/useEditLogs";
import { Colors } from "@/helpers/constants/color";

const EditLogHistory = () => {
  const { state, handler } = useEditLogs();

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

  const renderLogsItem = ({
    item,
    index,
  }: {
    item: GroupLogs;
    index: number;
  }) => {
    return (
      <View
        key={item?.id || index}
        className="relative mb-3 rounded-2xl bg-white p-4 shadow-sm"
      >
        <View className="flex-row items-center space-x-2">
          {item?.imageUrl ? (
            <View className="h-14 w-14 rounded-full border-2 border-primary/20 p-0.5">
              <Image
                source={{ uri: item?.imageUrl }}
                className="h-full w-full rounded-full"
              />
            </View>
          ) : (
            <View className="h-14 w-14 items-center justify-center rounded-full border-[4px] border-primary/20 bg-primary">
              <Text className="text-2xl font-semibold uppercase text-white">
                {item?.changedBy?.charAt(0)}
              </Text>
            </View>
          )}
          <View className="flex-1 pl-1">
            <View className="flex-row items-center">
              <Text className="text-base font-bold text-gray-800">
                {item?.changedBy}
              </Text>
            </View>
            <Text className="mt-1 text-gray-600">
              {highlightAndBreakText(item?.changeDescription || "No Title", {
                color: Colors.colors.primary,
                fontWeight: "bold",
              })}
            </Text>
          </View>
        </View>
        <View className="mt-4 flex-row items-center justify-between border-t border-gray-100 pt-3">
          <View className="flex-row items-center">
            <Ionicons name="checkmark-circle" size={14} color="#609084" />
            <Text className="ml-1 text-xs text-gray-500">
              {TEXT_TRANSLATE_EDIT_LOG_HISTORY.TITLE.CONFIRMED}
            </Text>
          </View>
          <View className="flex-row items-center rounded-full bg-gray-50 px-3 py-1.5">
            <MaterialIcons name="access-time" size={12} color="#666" />
            <Text className="ml-1 text-xs font-medium text-gray-600">
              {formatTime(item?.createdDate)} ·{" "}
              {formatDateMonthYear(item?.createdDate)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaViewCustom rootClassName="bg-[#fafafa]">
      <SectionComponent rootClassName="h-14 bg-white items-center justify-center relative">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute left-4 rounded-full bg-gray-50 p-2"
        >
          <MaterialIcons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black">
          {TEXT_TRANSLATE_EDIT_LOG_HISTORY.TITLE.EDIT_LOG_HISTORY}
        </Text>
      </SectionComponent>
      <View className="flex-row bg-white">
        {state.TABS.map((tab) => (
          <Pressable
            key={tab.type}
            onPress={() => handler.setActiveTab(tab.type)}
            className={`flex-1 items-center border-b-2 py-3 ${state.activeTab === tab.type ? "border-primary" : "border-transparent"}`}
          >
            <Text
              className={`font-normal ${state.activeTab === tab.type ? "font-extrabold text-primary" : "text-[#757575]"}`}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <LoadingSectionWrapper
        isLoading={
          state.isLoading || state.isFetchingData || state.isRefetching
        }
      >
        {state?.logs && state.logs?.length > 0 ? (
          <FlatListCustom
            isBottomTab={true}
            isLoading={state.isLoadingMore}
            className="mx-3 mt-5 rounded-2xl"
            data={state.logs ?? []}
            renderItem={renderLogsItem}
            keyExtractor={(item) => item?.id.toString()}
            onLoadMore={handler.handleLoadMore}
            hasMore={state.logs?.length === state.pageSize}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 110,
            }}
            refreshing={state.isFetchingData}
            onRefresh={handler.handleRefetchLogsList}
          />
        ) : (
          <View className="mt-20 items-center justify-center p-6">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <Feather name="credit-card" size={32} color="#609084" />
            </View>
            <Text className="text-center text-lg text-gray-500">
              {TEXT_TRANSLATE_EDIT_LOG_HISTORY.TITLE.NO_DATA}
            </Text>
          </View>
        )}
      </LoadingSectionWrapper>
    </SafeAreaViewCustom>
  );
};

export default EditLogHistory;
