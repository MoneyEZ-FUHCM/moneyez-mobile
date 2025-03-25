import React from "react";
import {
  LogBox,
  Modal,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import RenderHTML from "react-native-render-html";

LogBox.ignoreLogs([
  "Warning: bound renderChildren",
  "Support for defaultProps",
]);

interface CustomModalProps {
  visible: boolean;
  title?: string;
  content: string;
  isFormatted?: boolean;
  onClose: () => void;
}

const CustomModal = ({
  visible,
  title,
  content,
  isFormatted = false,
  onClose,
}: CustomModalProps) => {
  const { width } = useWindowDimensions();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View
          className={`${isFormatted ? "w-[90%]" : "w-4/5"} rounded-2xl bg-white p-6`}
        >
          {title && (
            <Text
              className={`${
                isFormatted
                  ? "-mb-2 text-left text-primary"
                  : "mb-4 text-center"
              } text-xl font-bold`}
            >
              {title}
            </Text>
          )}
          {isFormatted ? (
            <RenderHTML contentWidth={width * 0.9} source={{ html: content }} />
          ) : (
            <Text className="text-base text-gray-600">{content}</Text>
          )}
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
