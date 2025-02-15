import { router } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

const CreateGroup = () => {
  return (
    <View className="flex-1 bg-white relative">
      <View className="w-full h-24 pt-12 bg-white justify-center items-center flex">
        <View className="flex-1 self-stretch py-3 px-5 flex-row justify-start items-center gap-32">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-black text-lg font-bold" style={{ fontFamily: 'Font Awesome 6 Free' }}>-</Text>
          </TouchableOpacity>
          <Text className="text-black text-xl font-semibold" style={{ fontFamily: 'Inter', fontSize: 18, fontWeight: '800' }}>Tạo nhóm mới</Text>
        </View>
      </View>
    </View>
  );
};

export default CreateGroup;