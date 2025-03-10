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
import useGroupList from "./hooks/useGroupList";
import TEXT_TRANSLATE_GROUP_LIST from "./GroupList.translate";

const Group = () => {
  const { state, handler } = useGroupList();
  const { groups, isLoadingMore, visibleItems, isFetchingData } = state;
  const { handleLoadMore } = handler;
  const PRIMARY_COLOR = "#609084";

  return (
    <SafeAreaViewCustom rootClassName="bg-gray-50 relative">
      {/* Header */}
      <SectionComponent rootClassName="relative bg-white shadow-md h-14 flex-row items-center justify-center">
        <TouchableOpacity
          onPress={handler.handleBack}
          className="absolute left-3 rounded-full p-2"
        >
          <AntDesign name="close" size={24} color={PRIMARY_COLOR} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-primary">
          {TEXT_TRANSLATE_GROUP_LIST.TITLE.GROUP_FUND}
        </Text>
        <TouchableOpacity
          onPress={handler.handleRefetchGrouplist}
          className="absolute right-3 rounded-full p-2"
        >
          <AntDesign name="reload1" size={24} color={PRIMARY_COLOR} />
        </TouchableOpacity>
      </SectionComponent>
      <LoadingSectionWrapper isLoading={isFetchingData}>
        {groups && groups?.length > 0 ? (
          <FlatListCustom
            className="mx-5 pt-5"
            showsVerticalScrollIndicator={false}
            data={groups}
            isBottomTab={true}
            isLoading={isLoadingMore}
            hasMore={state.data?.items?.length === state.pageSize}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="mb-4 flex-row items-center rounded-2xl border border-gray-200 bg-white p-4 shadow-lg"
                onPress={handler.handleNavigateAndHideTabbar}
              >
                <Image
                  src={item?.imageUrl}
                  alt="star"
                  className="h-14 w-14 rounded-full"
                  resizeMode="contain"
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
      </LoadingSectionWrapper>
      <View className="absolute bottom-10 right-5">
        <TouchableOpacity
          className="h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-gray-400"
          onPress={handler.handleCreateGroupAndHideTabbar}
        >
          <AntDesign name="addusergroup" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaViewCustom>
  );
};

export default Group;
