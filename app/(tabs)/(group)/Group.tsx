import NoData from "@/assets/images/InviteMemberAssets/not-found-result.png";
import {
  FlatListCustom,
  LoadingSectionWrapper,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import VisibilityIcon from "@/components/GroupListCustom/VisibilityIcon";
import { formatCurrency } from "@/helpers/libs";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import TEXT_TRANSLATE_GROUP_LIST from "./GroupList.translate";
import useGroupList from "./hooks/useGroupList";

const Group = () => {
  const { state, handler } = useGroupList();
  const { groups, isLoading, isLoadingMore, visibleItems, isFetchingData } =
    state;
  const { handleLoadMore } = handler;
  const PRIMARY_COLOR = "#609084";

  return (
    <SafeAreaViewCustom rootClassName="bg-gray-50">
      {/* Header */}
      <SectionComponent rootClassName="relative bg-white shadow-md h-14 flex-row items-center justify-center">
        <TouchableOpacity
          onPress={handler.handleBack}
          className="absolute left-5 rounded-full bg-gray-200 p-2"
        >
          <AntDesign name="close" size={20} color={PRIMARY_COLOR} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900">
          {TEXT_TRANSLATE_GROUP_LIST.TITLE.GROUP_FUND}
        </Text>
      </SectionComponent>

      <LoadingSectionWrapper isLoading={isFetchingData}>
        {groups && groups?.length > 0 ? (
          <FlatListCustom
            className="mx-5 mt-4"
            showsVerticalScrollIndicator={false}
            data={groups}
            isBottomTab={groups?.length >= 6}
            isLoading={isLoadingMore}
            hasMore={state.data?.items?.length === state.pageSize}
            keyExtractor={(item) => item?.id?.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="mb-4 flex-row items-center rounded-2xl border border-gray-200 bg-white p-4 shadow-lg"
                onPress={handler.handleNavigateAndHideTabbar}
              >
                <Image
                  src={item?.imageUrl}
                  alt="star"
                  className="h-14 w-14 rounded-full"
                  resizeMode="cover"
                />
                <View className="ml-4 flex-1 space-y-1">
                  <Text className="text-lg font-semibold text-gray-900">
                    {item?.name}
                  </Text>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-base text-gray-700">
                      {visibleItems[item?.id]
                        ? formatCurrency(item?.currentBalance)
                        : "*******"}
                    </Text>
                    <VisibilityIcon
                      visible={visibleItems[item?.id] || false}
                      onPress={() => handler.toggleVisibility(item?.id)}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            )}
            onLoadMore={handleLoadMore}
          />
        ) : (
          <View className="flex-1 items-center justify-center px-5">
            <Image
              source={NoData}
              className="h-[40%] w-full"
              resizeMode="contain"
            />
          </View>
        )}
        <View className="absolute bottom-5 left-5 right-5">
          <TouchableOpacity
            className="flex-row items-center justify-center rounded-full bg-primary px-6 py-4 shadow-lg"
            onPress={handler.handleCreateGroupAndHideTabbar}
          >
            <AntDesign name="pluscircleo" size={24} color="white" />
            <Text className="ml-3 text-lg font-semibold text-white">
              {TEXT_TRANSLATE_GROUP_LIST.BUTTON.CREATE_GROUP}
            </Text>
          </TouchableOpacity>
        </View>
      </LoadingSectionWrapper>
    </SafeAreaViewCustom>
  );
};

export default Group;
