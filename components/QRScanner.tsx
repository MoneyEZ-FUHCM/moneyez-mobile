import { MaterialIcons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface QRScannerProps {
  onClose: () => void;
  onScanSuccess: (token: string) => void;
}

const QRScanner = ({ onClose, onScanSuccess }: QRScannerProps) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: 180,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    animate();
  }, [translateY]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        onClose();
      };
    }, []),
  );

  return (
    <Modal animationType="fade" transparent>
      <View className="flex-1">
        <CameraView
          style={StyleSheet.absoluteFillObject}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={({ data }) => {
            onScanSuccess(data);
          }}
        />

        <View className="flex-1 items-center justify-center">
          <View className="absolute h-48 w-52 justify-center">
            <View className="absolute left-0 top-0 h-[20] w-[20] border-l-2 border-t-2 border-white" />
            <View className="absolute right-0 top-0 h-[20] w-[20] border-r-2 border-t-2 border-white" />
            <View className="absolute bottom-0 left-0 h-[20] w-[20] border-b-2 border-l-2 border-white" />
            <View className="absolute bottom-0 right-0 h-[20] w-[20] border-b-2 border-r-2 border-white" />

            <Animated.View
              style={{
                transform: [{ translateY }],
                top: 0,
              }}
              className="absolute h-0.5 w-full bg-primary/50 shadow-lg shadow-primary"
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={onClose}
          className="absolute left-4 top-12 rounded-full bg-white/20 p-2"
        >
          <MaterialIcons name="close" size={24} color="white" />
        </TouchableOpacity>

        <View className="absolute bottom-0 w-full bg-black/50 p-4">
          <Text className="text-center text-white">
            Đặt mã QR vào trong khung để quét
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export { QRScanner };
