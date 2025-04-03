import {
  FlatListCustom,
  LoadingSectionWrapper,
  ModalLizeComponent,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { Colors } from "@/helpers/constants/color";
import { Notification } from "@/types/notification.type";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Bookmark, Forbidden2 } from "iconsax-react-native";
import React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import useNotificationList from "./hooks/useNotificationList";
import { getNotificationIcon } from "./NotificationList.const";
import TEXT_TRANSLATE_NOTICE from "./NotificationList.translate";

export default function NotificationList() {
  const { state, handler } = useNotificationList();
  const {
    activeTab,
    noticeData,
    isLoading,
    isLoadingMore,
    isFetchingData,
    tabs,
    data,
  } = state;
  const {
    setActiveTab,
    handleMarkAsRead,
    handleDeleteNotice,
    handleGoBack,
    handleOpenMore,
    loadMoreData,
    handleRefetchNotice,
  } = handler;

  const highlightText = (text: string, highlightStyle: any) => {
    const parts = text.split(/\[|\]/);

    return parts.map((part: string, index: number) => {
      if (index % 2 === 1) {
        return (
          <Text key={index} style={highlightStyle}>
            {part}
          </Text>
        );
      } else {
        return <Text key={index}>{part}</Text>;
      }
    });
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <Pressable
      key={item.id}
      onPress={() => handler.handlePressNotification(item)}
      className="relative border-b border-gray-200 bg-white p-3"
    >
      <View className="flex-row items-start gap-3">
        <View className="relative rounded-full bg-primary p-2">
          <MaterialIcons
            name={getNotificationIcon(item?.type) || "info"}
            size={28}
            color="#ffffff"
          />
          {!item?.isRead && (
            <View className="absolute -right-0.5 -top-1 h-4 w-4 rounded-full border-2 border-white bg-red" />
          )}
        </View>
        <View className="flex-1">
          <Text className="max-w-[90%] text-base font-semibold">
            {highlightText(item?.title || "No Title", {
              color: Colors.colors.primary,
              fontWeight: "bold",
            })}
          </Text>
          <Text className="mt-1 text-sm text-[#1e1e1e]">
            {item?.message?.charAt(0)?.toUpperCase() + item?.message?.slice(1)}
          </Text>
          <SpaceComponent height={3} />
          <View className="mt-2 flex-row justify-end gap-2">
            <Text className="text-xs text-gray-500">{item?.formattedTime}</Text>
            <Text className="text-xs text-gray-500">{item?.formattedDate}</Text>
          </View>
        </View>
      </View>
      <Pressable
        onPress={() => handleOpenMore(item)}
        className="absolute right-2 top-1"
      >
        <MaterialIcons name="more-horiz" size={24} color="#757575" />
      </Pressable>
    </Pressable>
  );

  return (
    <GestureHandlerRootView>
      <SafeAreaViewCustom rootClassName="bg-[#fafafa]">
        <SectionComponent rootClassName="h-14 bg-white items-center justify-center relative">
          <Pressable
            onPress={handleGoBack}
            className="absolute left-3 rounded-full p-2"
          >
            <MaterialIcons name="arrow-back" size={24} />
          </Pressable>
          <Text className="text-xl font-semibold text-black">
            Thông báo ({data?.totalCount})
          </Text>
          <SpaceComponent width={24} />
        </SectionComponent>
        <View className="flex-row bg-white">
          {tabs.map((tab) => (
            <Pressable
              key={tab.type}
              onPress={() => setActiveTab(tab.type)}
              className={`flex-1 items-center border-b-2 py-3 ${activeTab === tab.type ? "border-primary" : "border-transparent"}`}
            >
              <Text
                className={`font-medium ${activeTab === tab.type ? "text-[#021433]" : "text-[#757575]"}`}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <LoadingSectionWrapper isLoading={isLoading || isFetchingData}>
          {noticeData && noticeData?.length > 0 ? (
            <FlatListCustom
              isBottomTab={true}
              isLoading={isLoadingMore}
              className="mx-3 mt-5 rounded-2xl"
              data={noticeData ?? []}
              renderItem={renderNotificationItem}
              keyExtractor={(item) => item?.id.toString()}
              onLoadMore={loadMoreData}
              hasMore={state.data?.items?.length === state.pageSize}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 110,
              }}
              refreshing={isFetchingData}
              onRefresh={handleRefetchNotice}
            />
          ) : (
            <View className="mt-20 items-center justify-center p-6">
              <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                <Feather name="credit-card" size={32} color="#609084" />
              </View>
              <Text className="text-center text-lg text-gray-500">
                {TEXT_TRANSLATE_NOTICE.TITLE.NO_DATA}
              </Text>
            </View>
          )}
        </LoadingSectionWrapper>
        <ModalLizeComponent ref={state.modalizeRef}>
          {state.selectedNotice && (
            <View className="rounded-xl bg-white p-4 shadow-lg">
              {/* Icon */}
              <View className="mb-2 items-center">
                <View className="h-14 w-14 items-center justify-center rounded-full border-primary bg-primary p-2">
                  <MaterialIcons
                    name={
                      getNotificationIcon(state.selectedNotice?.type) || "info"
                    }
                    size={30}
                    color="#ffffff"
                  />
                </View>
              </View>
              <View className="items-center">
                <Text className="text-lg font-bold text-gray-800">
                  {state.selectedNotice.title}
                </Text>
                <Text className="mt-1 text-center text-sm text-gray-600">
                  {state.selectedNotice?.message?.charAt(0)?.toUpperCase() +
                    state.selectedNotice?.message?.slice(1)}
                </Text>
              </View>
              <View className="mt-5 flex-row space-x-3">
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-start space-x-3 rounded-lg bg-gray-100/60 px-7 py-2"
                  onPress={() => handleDeleteNotice(state.selectedNotice.id)}
                >
                  <View className="rounded-full bg-red p-2">
                    <Forbidden2 size="18" color="white" variant="Bold" />
                  </View>
                  <Text className="text-xs font-medium">
                    {TEXT_TRANSLATE_NOTICE.BUTTON.DELETE_NOTICE}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 flex-row items-center justify-start space-x-2 rounded-lg px-7 py-2 transition-opacity ${
                    state.selectedNotice?.isRead
                      ? "bg-gray-200 opacity-50"
                      : "bg-gray-100"
                  }`}
                  onPress={() => handleMarkAsRead(state.selectedNotice?.id)}
                  disabled={state.selectedNotice?.isRead}
                >
                  <View
                    className={`rounded-full p-2 ${
                      state.selectedNotice?.isRead
                        ? "bg-gray-300"
                        : "bg-primary"
                    }`}
                  >
                    <Bookmark size="18" color="white" variant="Bold" />
                  </View>
                  <Text
                    className={`text-xs font-medium ${
                      state.selectedNotice?.isRead
                        ? "text-gray-400"
                        : "text-black"
                    }`}
                  >
                    {TEXT_TRANSLATE_NOTICE.BUTTON.MARK_AS_READ}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ModalLizeComponent>
      </SafeAreaViewCustom>
    </GestureHandlerRootView>
  );
}
