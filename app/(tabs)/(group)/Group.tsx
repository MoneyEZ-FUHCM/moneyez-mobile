import { Eye, EyeSlash } from 'iconsax-react-native';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

const Group = () => {
  const funds = [
    { name: 'Nhóm gia đình', amount: '1.000.000 Đ' },
    { name: 'Du lịch Nha Trang', amount: '1.000.000 Đ' },
    { name: 'Year End Party 2025', amount: '1.000.000 Đ' },
    { name: 'Quỹ lớp', amount: '1.000.000 Đ' },
    { name: 'Nợ xấu Azure', amount: '1.000.000 Đ' },
    { name: 'Quỹ áo ấm tình thương', amount: '1.000.000 Đ' },
    { name: 'Quỹ nhà lá', amount: '1.000.000 Đ' },
    { name: 'Quỹ từ thiện', amount: '500.000 Đ' },
    { name: 'Quỹ học bổng', amount: '2.000.000 Đ' },
    { name: 'Quỹ phát triển', amount: '3.000.000 Đ' },
    { name: 'Quỹ khẩn cấp', amount: '1.500.000 Đ' },
    { name: 'Quỹ bảo hiểm', amount: '2.500.000 Đ' },
  ];

  const VisibilityIcon = ({
      visible,
      onPress,
    }: {
      visible: boolean;
      onPress: () => void;
    }) => (
      <TouchableOpacity onPress={onPress}>
        {visible ? (
          <Eye size="18" color="#888" variant="Outline" />
        ) : (
          <EyeSlash size="18" color="#888" variant="Outline" />
        )}
      </TouchableOpacity>
    );
  const [visible, setVisible] = useState(false);

  return (
    <View className="flex-1 pt-10 pb-24 px-4 bg-white">
      <View className="w-full flex-row justify-between items-center mb-4">
      <Text className="text-[#609084] text-lg font-semibold">Quỹ nhóm</Text>
      <TouchableOpacity className="p-2 rounded-lg border border-[#609084] flex-row justify-center items-center">
        <Svg width="16" height="17" viewBox="0 0 16 17" fill="none">
        <Path
          d="M7.33337 9.16659H3.33337V7.83325H7.33337V3.83325H8.66671V7.83325H12.6667V9.16659H8.66671V13.1666H7.33337V9.16659Z"
          fill="#609084"
        />
        </Svg>
        <Text className="text-[#609084] text-lg font-normal ml-2">Tạo quỹ</Text>
      </TouchableOpacity>
      </View>
      <FlatList
      data={funds}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View className="w-full p-2 border border-[#DBDBDB] flex-row justify-start items-center gap-2">
      <Svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <Rect width="64" height="64" fill="#D9D9D9" />
      </Svg>
      <View className="flex-1 flex-col justify-start items-start gap-1">
        <Text className="w-full h-6 text-black text-lg font-medium">{item.name}</Text>
        <View className="w-full pr-4 flex-row justify-between items-center">
        {visible ? (
          <Text className="text-black text-base font-light">{item.amount}</Text>
        ) : (
          <Text className="text-black text-base font-light">*******</Text>
        )}
        <TouchableOpacity onPress={() => setVisible(!visible)}>
          <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
         
          </Svg>
        </TouchableOpacity>
        <VisibilityIcon visible={visible} onPress={() => setVisible(!visible)} />
        </View>
      </View>
        </View>
      )}
      contentContainerStyle={{ paddingVertical: 8 }}
      />
    </View>
  );
};

export default Group;