import { SafeAreaViewCustom, SectionComponent } from '@/components';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import Svg, {  G, Mask, Path, Rect } from 'react-native-svg';
import TEXT_TRANSLATE_CREATE_GROUP from './CreateGroup.translate';

const CreateGroup = () => {
  const {TITLE,STEPS, BUTTON, TEXT, PLACEHOLDER} = TEXT_TRANSLATE_CREATE_GROUP;
  return (
    <SafeAreaViewCustom >
      <SectionComponent rootClassName="flex-row justify-between items-center h-14 px-4 ">
      <TouchableOpacity onPress={router.back}>
        <AntDesign
        name="arrowleft"
        size={24}
        color="#000000"
        />
      </TouchableOpacity>
      <View className="flex-row items-center gap-1">
        <Text className="text-lg font-bold text-black">
        {TITLE.CREATE_NEW_GROUP}
        </Text>
      </View>
      <TouchableOpacity >
        <Entypo name="info-with-circle" size={24} color="#000000" />
      </TouchableOpacity>
      </SectionComponent>
    <View className="flex-1 bg-white">
      <View className="px-4 py-6 bg-white rounded-lg">
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-col items-center">
          <Svg width="45" height="45" viewBox="0 0 45 45" fill="black">
        <Rect width="45" height="45" rx="22.5" fill="#609084" />
        <Path d="M31.1651 15.847L22.5001 10.845L13.8381 15.847L22.5001 20.846L31.1651 15.847ZM23.5001 13.93V17.93H21.5001V13.93H23.5001ZM32.1601 17.582L23.5001 22.578V32.578L32.1601 27.578V17.582ZM26.5261 23.169L29.9901 25.169L28.9901 26.901L25.5261 24.901L26.5261 23.169ZM21.5001 32.577V22.577L12.8401 17.58V27.577L21.5001 32.577ZM19.4751 24.9L16.0111 26.9L15.0111 25.168L18.4751 23.168L19.4751 24.9Z" fill="white" />
          </Svg>
          <Text className="text-xs font-semibold text-black mt-1">{STEPS.STEP_1}</Text>
          <Text className="text-sm font-semibold text-black">{STEPS.INFORMATION}</Text>
        </View>
        <View className="flex-1 h-[3px] my-1 bg-[#E7E7E7] mb-9 mx-2" />
        <View className="flex-col items-center">
          <Svg width="45" height="45" viewBox="0 0 45 45" fill="none">
        <Rect width="45" height="45" rx="22.5" fill="#E7E7E7" />
        <Path d="M30.8318 15.847L22.1668 10.845L13.5048 15.847L22.1668 20.846L30.8318 15.847ZM23.1668 13.93V17.93H21.1668V13.93H23.1668ZM31.8268 17.582L23.1668 22.578V32.578L31.8268 27.578V17.582ZM26.1928 23.169L29.6568 25.169L28.6568 26.901L25.1928 24.901L26.1928 23.169ZM21.1668 32.577V22.577L12.5068 17.58V27.577L21.1668 32.577ZM19.1418 24.9L15.6778 26.9L14.6778 25.168L18.1418 23.168L19.1418 24.9Z" fill="#757575" />
          </Svg>
            <Text className="text-xs font-semibold text-[#757575] mt-1">{STEPS.STEP_2}</Text>
            <Text className="text-sm font-semibold text-[#757575]">{STEPS.MODEL}</Text>
        </View>
        <View className="flex-1 h-[3px] bg-[#E7E7E7] mb-9 mx-2" />
        <View className="flex-col items-center">
          <Svg width="45" height="45" viewBox="0 0 45 45" fill="none">
        <Rect width="45" height="45" rx="22.5" fill="#E7E7E7" />
        <Path d="M22.8333 12C28.3563 12 32.8333 16.477 32.8333 22C32.8333 27.523 28.3563 32 22.8333 32C17.3103 32 12.8333 27.523 12.8333 22C12.8333 16.477 17.3103 12 22.8333 12ZM22.8333 16C22.568 16 22.3137 16.1054 22.1261 16.2929C21.9386 16.4804 21.8333 16.7348 21.8333 17V22C21.8333 22.2652 21.9387 22.5195 22.1263 22.707L25.1263 25.707C25.3149 25.8892 25.5675 25.99 25.8297 25.9877C26.0918 25.9854 26.3427 25.8802 26.5281 25.6948C26.7135 25.5094 26.8186 25.2586 26.8209 24.9964C26.8232 24.7342 26.7224 24.4816 26.5403 24.293L23.8333 21.586V17C23.8333 16.7348 23.7279 16.4804 23.5404 16.2929C23.3528 16.1054 23.0985 16 22.8333 16Z" fill="#757575" />
          </Svg>
          <Text className="text-xs font-semibold text-[#757575] mt-1">{STEPS.STEP_3}</Text>
          <Text className="text-sm font-semibold text-[#757575]">{STEPS.TIME}</Text>
        </View>
        <View className="flex-1 h-[3px] bg-[#E7E7E7] mb-9 mx-2" />
        <View className="flex-col items-center">
          <Svg width="45" height="45" viewBox="0 0 45 45" fill="none">
        <Rect width="45" height="45" rx="22.5" fill="#E7E7E7" />
        <Mask id="mask0_209_665" maskType="luminance" maskUnits="userSpaceOnUse" x="12" y="12" width="21" height="20">
          <Path d="M13.5 22C13.5 17.03 17.53 13 22.5 13C27.47 13 31.5 17.03 31.5 22C31.5 26.97 27.47 31 22.5 31C17.53 31 13.5 26.97 13.5 22Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M18.5 22L21.5 25L26.5 20" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Mask>
        <G mask="url(#mask0_209_665)">
          <Path d="M34.5 10H10.5V34H34.5V10Z" fill="#757575" />
        </G>
          </Svg>
          <Text className="text-xs font-semibold text-[#757575] mt-1">{STEPS.STEP_4}</Text>
          <Text className="text-sm font-semibold text-[#757575]">{STEPS.CONFIRM}</Text>
        </View>
      </View>
     
      <View className="mb-6">
        <Text className="text-lg font-bold text-primary mb-2">{STEPS.INFORMATION}</Text>
        <View className="bg-gray-100 rounded-lg p-4">
        <Text className="text-sm text-gray-600 mb-2">{TEXT.GROUP_NAME}</Text>
        <View className="bg-[#F6F9F4] rounded-lg p-2 border border-[#609084]">
            <TextInput
            className="text-sm text-gray-800"
            placeholder={PLACEHOLDER.ENTER_GROUP_NAME}
            placeholderTextColor="#757575"
            />
        </View>
        </View>
      </View>
      </View>
      <View className="flex-1 justify-end pb-24">
        <TouchableOpacity className="rounded-2xl px-4 w-full">
          <View className="w-full h-[49px] bg-[#5f8f84] rounded-[10px] justify-center items-center overflow-hidden">
        <Text className="text-white text-base font-extrabold font-['Inter']">{BUTTON.NEXT}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaViewCustom>
  );
};

export default CreateGroup;