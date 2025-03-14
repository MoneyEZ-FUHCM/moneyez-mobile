import React from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Modal,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
  FlatListCustom,
  LoadingSectionWrapper,
} from '@/components';
import useNotificationList from './hooks/useNotificationList';
import MoreNotification from './MoreNotification';
import NOTIFICATION_CONSTANTS, { getNotificationIcon } from './NotificationList.const';
import GestureRecognizer from 'react-native-swipe-gestures';

export default function NotificationList() {
  const { state, handler } = useNotificationList('all', 1, 20);
  const { activeTab, noticeData, isLoading, isLoadingMore, showMoreModal, selectedNoticeId } = state;
  const { setActiveTab, handleGoBack, handleOpenMore, closeModal, setDialogDimensions, getDialogStyle, loadMoreData } = handler;

  const tabs = NOTIFICATION_CONSTANTS.TABS;
  const currentIndex = tabs.findIndex(tab => tab.type === activeTab);

  const handleSwipeLeft = () => {
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].type);
    }
  };

  const handleSwipeRight = () => {
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].type);
    }
  };

  const gestureConfig = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  if (isLoading) {
    return (
      <SafeAreaViewCustom rootClassName="flex-1 bg-[#fafafa]">
        <SectionComponent rootClassName="h-14 bg-white justify-center">
          <View className="flex-row items-center justify-between px-4">
            <Pressable onPress={handleGoBack}>
              <MaterialIcons name="arrow-back" size={24} color="#609084" />
            </Pressable>
            <Text className="text-xl font-semibold text-black">Thông báo</Text>
            <SpaceComponent width={24} />
          </View>
        </SectionComponent>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#609084" />
          <Text className="mt-2 text-[#609084]">Đang tải dữ liệu...</Text>
        </View>
      </SafeAreaViewCustom>
    );
  }

  const renderNotificationItem = ({ item }: { item: any }) => (
    <Pressable key={item.id} className={`rounded-lg border border-gray-200 p-3 ${item.isRead ? 'bg-white' : 'bg-green-50'}`}>
      <View className="flex-row items-start gap-3">
        <View className="rounded-full bg-[#609084] p-2">
          <MaterialIcons name={getNotificationIcon(item.type)} size={28} color="#ffffff" />
        </View>
        <View className="flex-1">
          <View className="flex-row justify-between items-center">
            <Text className="text-base font-semibold text-[#021433]">{item.title}</Text>
            <Pressable
              onPress={(event: GestureResponderEvent) =>
                handleOpenMore(item.id, event.nativeEvent.pageX, event.nativeEvent.pageY)
              }
            >
              <MaterialIcons name="more-horiz" size={24} color="#757575" />
            </Pressable>
          </View>
          <Text className="mt-1 text-sm text-[#1e1e1e]">{item.message}</Text>
          <View className="mt-2 flex-row justify-end gap-2">
            <Text className="text-xs text-gray-500">{item.formattedTime}</Text>
            <Text className="text-xs text-gray-500">{item.formattedDate}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View className="flex items-center justify-center py-4">
        <ActivityIndicator size="small" color="#609084" />
      </View>
    );
  };

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-[#fafafa]">
      {/* Header */}
      <SectionComponent rootClassName="h-14 bg-white justify-center">
        <View className="flex-row items-center justify-between px-4">
          <Pressable onPress={handleGoBack}>
            <MaterialIcons name="arrow-back" size={24} color="#609084" />
          </Pressable>
          <Text className="text-xl font-semibold text-black">
            Thông báo ({noticeData.filter((n: any) => !n.isRead).length})
          </Text>
          <SpaceComponent width={24} />
        </View>
      </SectionComponent>

      <GestureRecognizer onSwipeLeft={handleSwipeLeft} onSwipeRight={handleSwipeRight} config={gestureConfig} style={{ flex: 1 }}>
        {/* Tabs */}
        <View className="flex-row bg-white">
          {tabs.map((tab) => (
            <Pressable
              key={tab.type}
              onPress={() => setActiveTab(tab.type)}
              className={`flex-1 items-center border-b-2 py-3 ${activeTab === tab.type ? 'border-[#609084]' : 'border-transparent'}`}
            >
              <Text className={`font-medium ${activeTab === tab.type ? 'text-[#021433]' : 'text-[#757575]'}`}>{tab.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Notification List with infinite scroll */}
        <LoadingSectionWrapper isLoading={isLoadingMore}>
          <FlatListCustom
            data={noticeData}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id.toString()}
            onLoadMore={loadMoreData}
            hasMore={noticeData.length > 0 && noticeData.length === 20}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16, gap: 12 }}
          />
        </LoadingSectionWrapper>
      </GestureRecognizer>

      <Modal visible={showMoreModal} transparent animationType="fade" onRequestClose={closeModal}>
        <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]} onPress={closeModal}>
          <View
            style={getDialogStyle()}
            onLayout={(e) => {
              const { width, height } = e.nativeEvent.layout;
              setDialogDimensions({ width, height });
            }}
          >
            <MoreNotification activeTabType={activeTab} notificationId={selectedNoticeId} closeModal={closeModal} />
          </View>
        </Pressable>
      </Modal>
    </SafeAreaViewCustom>
  );
}
