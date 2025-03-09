import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Modal,
  StyleSheet,
  Dimensions,
  GestureResponderEvent,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaViewCustom, SectionComponent, SpaceComponent } from '@/components';
import useNotificationList from './hooks/useNotificationList';
import MoreNotification from './MoreNotification';

export default function NotificationList() {
  const { state, handler } = useNotificationList();

  const [showMoreModal, setShowMoreModal] = useState(false);
  const [selectedNoticeId, setSelectedNoticeId] = useState('');
  const [anchorPosition, setAnchorPosition] = useState({ x: 0, y: 0 });
  const [dialogDimensions, setDialogDimensions] = useState({ width: 0, height: 0 });

  const windowHeight = Dimensions.get('window').height;
  const handleOpenMore = (id: string, event: GestureResponderEvent) => {
    setSelectedNoticeId(id);
    const { pageX, pageY } = event.nativeEvent;
    setAnchorPosition({ x: pageX, y: pageY });
    setShowMoreModal(true);
  };

  const getDialogStyle = () => {
    const offset = 10;
    const windowWidth = Dimensions.get('window').width;
    
    let top;
    if (anchorPosition.y + dialogDimensions.height + offset > windowHeight) {
      top = anchorPosition.y - dialogDimensions.height - offset;
    } else {
      top = anchorPosition.y + offset;
    }
    
    const right = windowWidth - anchorPosition.x;
    
    return {
      position: 'absolute' as const,
      top,
      right,
    };
  };

  if (state.isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa' }}>
        <ActivityIndicator size="large" color="#609084" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-[#fafafa]">
      {/* Header */}
      <SectionComponent rootClassName="h-14 bg-white justify-center">
        <View className="flex-row items-center justify-between px-4">
          <Pressable onPress={handler.handleGoBack}>
            <MaterialIcons name="arrow-back" size={24} color="#609084" />
          </Pressable>
          <Text className="text-xl font-semibold text-black">
            Thông báo ({state.noticeData.filter(notice => !notice.isRead).length})
          </Text>
          <SpaceComponent width={24} />
        </View>
      </SectionComponent>

      {/* Tabs */}
      <View className="flex-row bg-white">
        <Pressable className="flex-1 items-center border-b-2 border-[#609084] py-3">
          <Text className="font-medium text-[#021433]">Tất cả</Text>
        </Pressable>
        <Pressable className="flex-1 items-center border-b-2 border-transparent py-3">
          <Text className="text-[#757575]">Nhóm</Text>
        </Pressable>
        <Pressable className="flex-1 items-center border-b-2 border-transparent py-3">
          <Text className="text-[#808080]">Cá nhân</Text>
        </Pressable>
      </View>

      {/* Notification List */}
      <ScrollView className="p-4">
        {state.noticeData.map((notice) => (
          <Pressable
            key={notice.id}
            className={`mb-3 rounded-lg border border-gray-200 p-3 ${notice.isRead ? 'bg-white' : 'bg-green-50'}`}
          >
            <View className="flex-row items-start gap-3">
              <View className="rounded-full bg-[#609084] p-2">
                <MaterialIcons name="notifications" size={28} color="#ffffff" />
              </View>
              <View className="flex-1">
                <View className="flex-row justify-between items-center">
                  <Text className="text-base font-semibold text-[#021433]">
                    {notice.title}
                  </Text>
                  <Pressable onPress={(event) => handleOpenMore(notice.id, event)}>
                    <MaterialIcons name="more-horiz" size={24} color="#757575" />
                  </Pressable>
                </View>
                <Text className="mt-1 text-sm text-[#1e1e1e]">
                  {notice.message}
                </Text>
                <View className="mt-2 flex-row justify-end gap-2">
                  <Text className="text-xs text-gray-500">
                    {notice.formattedTime}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {notice.formattedDate}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Modal
        visible={showMoreModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMoreModal(false)}
      >
        <Pressable 
          style={[
            StyleSheet.absoluteFill, 
            { backgroundColor: 'rgba(0, 0, 0, 0.3)' }
          ]} 
          onPress={() => setShowMoreModal(false)}
        >
          <View
            style={getDialogStyle()}
            onLayout={(e) => {
              const { width, height } = e.nativeEvent.layout;
              setDialogDimensions({ width, height });
            }}
          >
            <MoreNotification
              notificationId={selectedNoticeId}
              closeModal={() => setShowMoreModal(false)}
            />
          </View>
        </Pressable>
      </Modal>
    </SafeAreaViewCustom>
  );
}
