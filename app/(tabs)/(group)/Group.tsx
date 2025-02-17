import {
  FlatListCustom,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { router } from "expo-router";
import { Eye, EyeSlash } from "iconsax-react-native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import GROUP_LIST from "./GroupList.constant";
import TEXT_TRANSLATE_GROUP_LIST from "./GroupList.translate";

const Group = () => {
  const funds = GROUP_LIST;
  const { TITLE, BUTTON } = TEXT_TRANSLATE_GROUP_LIST;
  const [visible, setVisible] = useState(false);

  const VisibilityIcon = ({
    visible,
    onPress,
  }: {
    visible: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity onPress={onPress} className="p-2">
      {visible ? (
        <Eye size="20" color="#555" variant="Outline" />
      ) : (
        <EyeSlash size="20" color="#555" variant="Outline" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaViewCustom rootClassName="bg-gray-100">
      <SectionComponent rootClassName="h-14 flex-row items-center justify-center border-b border-gray-300 bg-white px-4 shadow-sm">
        
        <Text className="text-lg font-semibold text-gray-900">
          Nhóm Của Bạn
        </Text>
      </SectionComponent>
      <View className="mt-5 px-4">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-primary">
            {TITLE.GROUP_FUND}
          </Text>
          <TouchableOpacity
            className="flex-row items-center rounded-full border border-primary bg-white px-4 py-2 shadow-sm"
            onPress={() => router.navigate(PATH_NAME.GROUP.CREATE_GROUP_STEP_1 as any)}
          >
            <Svg width="18" height="18" viewBox="0 0 16 17" fill="none">
              <Path
                d="M7.33337 9.16659H3.33337V7.83325H7.33337V3.83325H8.66671V7.83325H12.6667V9.16659H8.66671V13.1666H7.33337V9.16659Z"
                fill="#609084"
              />
            </Svg>
            <Text className="ml-2 text-base font-medium text-primary">
              {BUTTON.CREATE_GROUP}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatListCustom
        className="px-4"
        data={funds}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View className="mb-3 flex-row items-center rounded-xl border border-gray-300 bg-white p-4 shadow-md">
            <Svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <Rect width="64" height="64" fill="#E5E7EB" />
            </Svg>

            <View className="ml-4 flex-1">
              <Text className="text-lg font-semibold text-gray-900">
                {item.name}
              </Text>
              <View className="mt-1 flex-row items-center justify-between">
                <Text className="text-base text-gray-700">
                  {visible ? item.amount : "*******"}
                </Text>
                <VisibilityIcon
                  visible={visible}
                  onPress={() => setVisible(!visible)}
                />
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaViewCustom>
  );
};

export default Group;
