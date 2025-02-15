import { SafeAreaViewCustom, SectionComponent } from '@/components';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import TEXT_TRANSLATE_BOT from '../../(bot)/BotScreen.translate';
import useChatBotScreen from '../../(bot)/hooks/useChatbotScreen';

const CreateGroup = () => {
    const { state, handler } = useChatBotScreen();

  return (
    <SafeAreaViewCustom>
      <SectionComponent rootClassName="flex-row justify-between items-center h-14 px-4 ">
        <TouchableOpacity onPress={handler.handleBack}>
          <AntDesign
            name="arrowleft"
            size={24}
            color="#000000"
          />
        </TouchableOpacity>
        <View className="flex-row items-center gap-1">
          <Text className="text-lg font-bold text-black">
            Tao Nhom Moi
          </Text>
        
        </View>

        <TouchableOpacity onPress={() => handler.setIsModalVisible(true)}>
          <Entypo name="info-with-circle" size={24} color="#000000" />
        </TouchableOpacity>
      </SectionComponent>
     
    </SafeAreaViewCustom>
  );
};

export default CreateGroup;