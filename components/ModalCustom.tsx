import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface CustomModalProps {
  visible: boolean;
  title?: string;
  content: string;
  onClose: () => void;
}

const CustomModal = ({
  visible,
  title,
  content,
  onClose,
}: CustomModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="w-4/5 rounded-2xl bg-white p-6">
          {title && (
            <Text className="mb-4 text-center text-xl font-bold">{title}</Text>
          )}
          <Text className="text-base text-gray-600">{content}</Text>
          <TouchableOpacity
            className="mt-4 rounded-xl bg-[#609084] p-3"
            onPress={onClose}
          >
            <Text className="text-center font-semibold text-white">Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export { CustomModal };
