import ArrowDown from "@/assets/icons/arrow-trend-down.png";
import ArrowUp from "@/assets/icons/arrow-trend-up.png";
import Admin from "@/assets/images/logo/avatar_admin.jpg";
import {
  SafeAreaViewCustom,
  ScrollViewCustom,
  SectionComponent,
} from "@/components";
import { appInfo } from "@/helpers/constants/appInfos";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Coin, Eye, EyeSlash } from "iconsax-react-native";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import TEXT_TRANSLATE_HOME from "../HomeScreen.translate";
import useHomeScreen from "../hooks/useHomeScreen";

const HomeScreen = () => {
  const { state, handler } = useHomeScreen();
  const { BUTTON, TITLE } = TEXT_TRANSLATE_HOME;
  const router = useRouter();

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

  return (
    <SafeAreaViewCustom rootClassName="relative">
      <ScrollViewCustom isBottomTab showsVerticalScrollIndicator={false}>
        <SectionComponent
          rootClassName="relative flex-1"
          style={{
            height: appInfo.sizes.HEIGHT * 0.35,
          }}
        >
          <View className="h-40 bg-thirdly/70 px-5">
            <View className="mt-5 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Image
                  source={
                    state?.userInfo?.avatarUrl
                      ? { uri: state.userInfo.avatarUrl }
                      : Admin
                  }
                  className="h-12 w-12 rounded-full"
                  resizeMode="cover"
                />
                <View>
                  <Text className="text-[12px]">{TITLE.HELLO}</Text>
                  <Text className="text-base">{state?.userInfo?.fullName}</Text>
                </View>
              </View>
              <TouchableOpacity className="rounded-full bg-black/20 p-2">
                <Feather name="bell" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          <View className="bottom-16 mx-5 rounded-2xl bg-white p-3 shadow-md shadow-gray-600">
            <View>
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-[19px] font-bold text-primary">
                  {TITLE.PERSONAL_EXPENSES}
                </Text>
                <TouchableOpacity
                  onPress={handler.handleNavigateAddPersonalIncome}
                >
                  <View className="flex-row items-center rounded-full border border-primary px-3 py-1">
                    <Feather name="plus" size={16} color="#609084" />
                    <Text className="font-md ml-1 text-[14px] text-primary">
                      {BUTTON.ADD}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View className="mb-3 flex-row justify-between">
                <Text className="font-medium">
                  {state.startOfMonth} - {state.endOfMonth}
                </Text>
                <TouchableOpacity onPress={handler.toggleVisibility}>
                  <VisibilityIcon
                    visible={state.isShow}
                    onPress={handler.toggleVisibility}
                  />
                </TouchableOpacity>
              </View>
              <View className="flex-row justify-between gap-5">
                <View className="flex-1 gap-1 rounded-[10px] border-[0.5px] border-[#757575] px-2 py-1">
                  <View className="flex-row items-center">
                    <Image
                      source={ArrowDown}
                      className="h-4 w-4"
                      resizeMode="contain"
                    />
                    <Text className="ml-[5px] text-[12px] font-medium text-red">
                      {TITLE.SPENDING}
                    </Text>
                  </View>
                  {state.isShow ? (
                    <Text className="font-medium">4.999.999đ</Text>
                  ) : (
                    <Text className="font-medium">{TITLE.VISIBLE_DATA}</Text>
                  )}
                </View>
                <View className="flex-1 gap-1 rounded-[10px] border-[0.5px] border-[#757575] px-2 py-1">
                  <View className="flex-row items-center">
                    <Image
                      source={ArrowUp}
                      className="h-4 w-4"
                      resizeMode="contain"
                    />
                    <Text className="ml-[5px] text-[12px] font-medium text-green">
                      {TITLE.INCOME}
                    </Text>
                  </View>
                  {state.isShow ? (
                    <Text className="font-medium">4.999.999đ</Text>
                  ) : (
                    <Text className="font-medium">{TITLE.VISIBLE_DATA}</Text>
                  )}
                </View>
              </View>
              <Text className="mb-6 mt-3 text-center text-[13px] font-medium text-[#757575]">
                {TITLE.TOTAL_BALANCE}
                {state.isShow ? (
                  <Text className="font-medium">100.000đ</Text>
                ) : (
                  <Text className="font-medium">{TITLE.VISIBLE_DATA}</Text>
                )}
              </Text>
            </View>
            <Text
              className="absolute bottom-3 right-3 font-semibold text-primary"
              onPress={() =>
                router.navigate(PATH_NAME.HOME.INDIVIDUAL_HOME as any)
              }
            >
              {BUTTON.DETAIL}
            </Text>
          </View>
        </SectionComponent>
        <SectionComponent rootClassName="px-5 my-5">
          <Text className="mb-2 text-[19px] font-bold text-primary">
            {TITLE.MY_GROUP}
          </Text>
          <View className="gap-3">
            <View className="flex-1 rounded-lg border border-secondary bg-white px-2 py-3">
              <View className="flex-row justify-between">
                <View className="flex-row items-center gap-1">
                  <Coin size="17" color="#609084" variant="Bulk" />
                  <Text>Quỹ retake đồ án</Text>
                </View>
                <View className="flex-row gap-3">
                  {state.isShow ? (
                    <Text>12.000.000đ</Text>
                  ) : (
                    <Text>{TITLE.VISIBLE_DATA}</Text>
                  )}
                  <TouchableOpacity onPress={handler.toggleVisibility}>
                    <VisibilityIcon
                      visible={state.isShow}
                      onPress={handler.toggleVisibility}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View className="flex-1 rounded-lg border border-secondary bg-white px-2 py-3">
              <View className="flex-row justify-between">
                <View className="flex-row items-center gap-1">
                  <Coin size="17" color="#609084" variant="Bulk" />
                  <Text>Quỹ cho tương lai</Text>
                </View>
                <View className="flex-row gap-3">
                  {state.isShow ? (
                    <Text>12.000.000đ</Text>
                  ) : (
                    <Text>{TITLE.VISIBLE_DATA}</Text>
                  )}
                  <TouchableOpacity onPress={handler.toggleVisibility}>
                    {state.isShow ? (
                      <Eye size="18" color="#888" variant="Outline" />
                    ) : (
                      <EyeSlash size="18" color="#888" variant="Outline" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <TouchableOpacity className="flex-1 rounded-lg border border-secondary bg-white px-2 py-3">
              <Text className="text-center font-bold text-primary">
                {BUTTON.SEE_MORE}
              </Text>
            </TouchableOpacity>
          </View>
        </SectionComponent>
        <SectionComponent rootClassName="px-5 my-2">
          <View className="flex-row flex-wrap gap-y-5">
            {state.MENU_ITEMS.map((item, index) => {
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={index}
                  className="w-1/4 items-center gap-y-1"
                  onPress={() =>
                    item.url && handler.handleNavigateMenuItem(item.url)
                  }
                >
                  <View className="rounded-lg bg-thirdly/70 p-2">
                    <Icon size="32" color="#609084" variant="Bold" />
                  </View>
                  <Text className="text-[12px]">{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </SectionComponent>
        <SectionComponent rootClassName="px-5 my-5">
          <Text className="mb-2 text-[19px] font-bold text-primary">
            {TITLE.POST}
          </Text>
          <FlatList
            ref={state.flatListRef}
            horizontal
            data={state.POST_DATAS}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            ItemSeparatorComponent={() => <View style={{ width: 30 }} />}
            removeClippedSubviews={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="w-72 rounded-3xl border-[1px] border-[#CCCCCC] bg-white"
                style={{ overflow: "hidden" }}
              >
                <Image
                  source={item.image}
                  className="h-32 w-full"
                  resizeMode="cover"
                />
                <View className="gap-y-1 p-3">
                  <Text className="text-[18px] font-medium">{item.title}</Text>
                  <Text className="text-[#757575]">{item.time}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </SectionComponent>
      </ScrollViewCustom>
    </SafeAreaViewCustom>
  );
};

export default HomeScreen;
