import NoData from "@/assets/images/InviteMemberAssets/not-found-result.png";
import {
  FlatListGestureCustom,
  LoadingSectionWrapper,
  ModalLizeComponent,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { Bookmark, Forbidden2 } from "iconsax-react-native";
import React from "react";
import {
  Animated,
  GestureResponderEvent,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
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
    slideAnim,
  } = state;
  const {
    setActiveTab,
    handleMarkAsRead,
    handleDeleteNotice,
    handleGoBack,
    handleOpenMore,
    loadMoreData,
    handleRefetchNotice,
    onGestureEvent,
    onHandlerStateChange,
  } = handler;
  const PRIMARY_COLOR = "#609084";

  const renderNotificationItem = ({ item }: { item: any }) => (
    <Pressable
      key={item.id}
      className={`rounded-lg border border-gray-200 p-3 ${item?.isRead ? "bg-white" : "bg-thirdly"}`}
    >
      <View className="flex-row items-start gap-3">
        <View className="rounded-full bg-primary p-2">
          <MaterialIcons
            name={getNotificationIcon(item?.type)}
            size={28}
            color="#ffffff"
          />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-semibold text-[#021433]">
              {item.title}
            </Text>
            <Pressable
              onPress={(event: GestureResponderEvent) => handleOpenMore(item)}
            >
              <MaterialIcons name="more-horiz" size={24} color="#757575" />
            </Pressable>
          </View>
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
    </Pressable>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaViewCustom rootClassName="bg-[#fafafa]">
        <SectionComponent rootClassName="h-14 bg-white items-center justify-center relative">
          <Pressable
            onPress={handleGoBack}
            className="absolute left-3 rounded-full p-2"
          >
            <MaterialIcons name="arrow-back" size={24} color={PRIMARY_COLOR} />
          </Pressable>
          <Text className="text-xl font-semibold text-black">Thông báo</Text>
          <TouchableOpacity
            onPress={handleRefetchNotice}
            className="absolute right-3 rounded-full p-2"
          >
            <AntDesign name="reload1" size={24} color={PRIMARY_COLOR} />
          </TouchableOpacity>
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
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View
            style={{ flex: 1, transform: [{ translateX: slideAnim }] }}
          >
            <LoadingSectionWrapper isLoading={isLoading || isFetchingData}>
              {noticeData && noticeData?.length > 0 ? (
                <FlatListGestureCustom
                  isBottomTab={false}
                  isLoading={isLoadingMore}
                  data={noticeData ?? []}
                  renderItem={renderNotificationItem}
                  keyExtractor={(item) => item.id.toString()}
                  onLoadMore={loadMoreData}
                  hasMore={state.data?.items?.length === state.pageSize}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ padding: 16, gap: 12 }}
                  refreshing={isFetchingData}
                  onRefresh={handleRefetchNotice}
                />
              ) : (
                <View className="mt-36 items-center justify-center px-5">
                  <Image
                    source={NoData}
                    className="h-[400px] w-full"
                    resizeMode="contain"
                  />
                </View>
              )}
            </LoadingSectionWrapper>
          </Animated.View>
        </PanGestureHandler>
        <ModalLizeComponent ref={state.modalizeRef}>
          {state.selectedNotice && (
            <View className="rounded-xl bg-white p-4 shadow-lg">
              {/* Icon */}
              <View className="mb-2 items-center">
                <View className="h-14 w-14 items-center justify-center rounded-full border-primary bg-primary p-2">
                  <MaterialIcons
                    name={getNotificationIcon(state.selectedNotice?.type)}
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
                  className="flex-1 flex-row items-center justify-start space-x-2 rounded-lg bg-gray-100/60 px-7 py-2"
                  onPress={() => handleMarkAsRead(state.selectedNotice.id)}
                >
                  <View className="rounded-full bg-primary p-2">
                    <Bookmark size="18" color="white" variant="Bold" />
                  </View>
                  <Text className="text-xs font-medium">
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
