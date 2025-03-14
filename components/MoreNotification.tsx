import useNotificationList from '@/app/(tabs)/(home)/notification/hooks/useNotificationList';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface MoreNotificationProps {
  activeTabType: string;
  notificationId: string;
  closeModal: () => void;
}

const MoreNotification = ({ activeTabType, notificationId, closeModal }: MoreNotificationProps) => {

  const { handler } = useNotificationList(activeTabType);

  const handleMarkRead = () => {
    handler.handleMarkAsRead(notificationId);
    closeModal();
  };

  const handleDeleteNotification = () => {
    // Implement delete notification logic here
    console.log('Delete:', notificationId);
    closeModal();
  };

  return (
    <View className="rounded-xl bg-white px-4 py-2 shadow-md">
      <TouchableOpacity
        className="flex-row items-center py-1 border-b border-gray-200"
        onPress={handleMarkRead}
      >
        <MaterialIcons name="check" size={24} color="#374151" />
        <Text className="ml-3 text-base text-gray-800">Đánh dấu đã đọc</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center py-1 border-b border-gray-200"
        onPress={handleDeleteNotification}
      >
        <MaterialIcons name="delete-outline" size={24} color="#374151" />
        <Text className="ml-3 text-base text-gray-800">Xóa thông báo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center py-1"
        onPress={closeModal}
      >
        <MaterialIcons name="close" size={24} color="#374151" />
        <Text className="ml-3 text-base text-gray-800">Hủy</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MoreNotification;
