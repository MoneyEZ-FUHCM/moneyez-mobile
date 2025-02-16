import { Eye, EyeSlash } from "iconsax-react-native";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import TEXT_TRANSLATE_GROUP_LIST from "./GroupList.translate";
import { router } from "expo-router";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { SafeAreaViewCustom, SectionComponent } from "@/components";
import { AntDesign, Entypo } from "@expo/vector-icons";
import GROUP_LIST from "./GroupList.constant";

const Group = () => {
  const funds = GROUP_LIST;
  const { TITLE, BUTTON } = TEXT_TRANSLATE_GROUP_LIST;
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
    <SafeAreaViewCustom>
      <SectionComponent rootClassName="flex-row justify-between items-center h-14 px-4 ">
        <TouchableOpacity onPress={router.back}>
          <AntDesign name="arrowleft" size={24} color="#000000" />
        </TouchableOpacity>
        <View className="flex-row items-center gap-1">
          <Text className="text-lg font-bold text-black">Nhóm Của Bạn</Text>
        </View>
        <TouchableOpacity>
          <Entypo name="info-with-circle" size={24} color="#000000" />
        </TouchableOpacity>
      </SectionComponent>
      <View className="px-2">
        <View className="mb-4 w-full flex-row items-center justify-between px-5">
          <Text className="text-lg font-semibold text-[#609084]">
            {TITLE.GROUP_FUND}
          </Text>
          <TouchableOpacity
            className="flex-row items-center justify-center rounded-lg border border-[#609084] p-2"
            onPress={() => router.navigate(PATH_NAME.GROUP.CREATE_GROUP as any)}
          >
            <Svg width="16" height="17" viewBox="0 0 16 17" fill="none">
              <Path
                d="M7.33337 9.16659H3.33337V7.83325H7.33337V3.83325H8.66671V7.83325H12.6667V9.16659H8.66671V13.1666H7.33337V9.16659Z"
                fill="#609084"
              />
            </Svg>
            <Text className="ml-2 text-lg font-normal text-[#609084]">
              {BUTTON.CREATE_GROUP}
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={funds}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View className="mb-1 w-full flex-row items-center justify-start border border-[#DBDBDB] p-2">
              <Svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                className="mr-2"
              >
                <Rect width="64" height="64" fill="#D9D9D9" />
              </Svg>
              <View className="flex-1 flex-col items-start justify-start gap-1">
                <Text className="h-6 w-full text-lg font-medium text-black">
                  {item.name}
                </Text>
                <View className="w-full flex-row items-center justify-between pr-4">
                  {visible ? (
                    <Text className="text-base font-light text-black">
                      {item.amount}
                    </Text>
                  ) : (
                    <Text className="text-base font-light text-black">
                      *******
                    </Text>
                  )}
                  <TouchableOpacity onPress={() => setVisible(!visible)}>
                    <Svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    ></Svg>
                  </TouchableOpacity>
                  <VisibilityIcon
                    visible={visible}
                    onPress={() => setVisible(!visible)}
                  />
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaViewCustom>
  );
};

export default Group;
