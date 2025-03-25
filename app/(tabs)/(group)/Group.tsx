import {
  FlatListCustom,
  LoadingSectionWrapper,
  ModalLizeComponent,
  QRScanner,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import VisibilityIcon from "@/components/GroupListCustom/VisibilityIcon";
import { appInfo } from "@/helpers/constants/appInfos";
import { Colors } from "@/helpers/constants/color";
import { formatCurrency } from "@/helpers/libs";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Scan } from "iconsax-react-native";
import React from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TEXT_TRANSLATE_GROUP_LIST from "./GroupList.translate";
import useGroupList from "./hooks/useGroupList";

const Group = () => {
  const { state, handler } = useGroupList();
  const {
    groups,
    isLoadingMore,
    visibleItems,
    isFetchingData,
    isShowScanner,
    modalizeRef,
    memberCode,
  } = state;
  const {
    handleLoadMore,
    handleScanQR,
    setIsShowScanner,
    handleScanSuccess,
    handleJoinGroup,
    setMemberCode,
    handleSubmitJoinGroup,
  } = handler;
  const PRIMARY_COLOR = "#609084";

  return (
    <GestureHandlerRootView>
      <SafeAreaViewCustom rootClassName="bg-gray-50 relative">
        {!isShowScanner && (
          <SectionComponent rootClassName="relative bg-white shadow-md h-14 flex-row items-center justify-center">
            <TouchableOpacity
              onPress={handler.handleBack}
              className="absolute left-3 rounded-full p-2"
            >
              <AntDesign name="close" size={24} />
            </TouchableOpacity>
            <Text className="text-lg font-bold">
              {TEXT_TRANSLATE_GROUP_LIST.TITLE.GROUP_FUND}
            </Text>
            {groups && groups?.length > 0 ? (
              <TouchableOpacity
                onPress={handler.handleRefetchGrouplist}
                className="absolute right-3 rounded-full p-2"
              >
                <AntDesign name="reload1" size={24} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleScanQR}
                className="absolute right-3 rounded-full p-2"
              >
                <Scan size="24" />
              </TouchableOpacity>
            )}
          </SectionComponent>
        )}
        {isShowScanner ? (
          <QRScanner
            onClose={() => setIsShowScanner(false)}
            onScanSuccess={handleScanSuccess}
          />
        ) : (
          <LoadingSectionWrapper isLoading={isFetchingData}>
            {groups && groups?.length > 0 ? (
              <FlatListCustom
                className="mx-5 pt-5"
                showsVerticalScrollIndicator={false}
                data={groups ?? []}
                isBottomTab={true}
                isLoading={isLoadingMore}
                hasMore={state.data?.items?.length === state.pageSize}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="mb-4 flex-row items-center rounded-2xl border border-gray-200 bg-white p-4 shadow-lg"
                    onPress={handler.handleNavigateAndHideTabbar(item)}
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
              <View
                className="mb-20 items-center justify-center"
                style={{ height: appInfo.sizes.HEIGHT - 56 }}
              >
                <View className="mb-28">
                  <View className="items-center justify-center p-6">
                    <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                      <MaterialCommunityIcons
                        name="account-group"
                        size={40}
                        color={Colors.colors.primary}
                      />
                    </View>
                    <Text className="text-center text-lg font-semibold text-gray-500">
                      Bạn chưa có quỹ nhóm nào
                    </Text>
                    <View className="w-[80%]">
                      <Text className="mt-2 text-center text-gray-400">
                        Nhấn nút bên dưới để tạo quỹ nhóm mới hoặc tham gia quỹ
                        nhóm khác
                      </Text>
                    </View>
                  </View>
                  <View className="w-full flex-row justify-between px-8">
                    <TouchableOpacity
                      className="flex-1 rounded-lg bg-primary/10 px-4 py-3"
                      onPress={handleJoinGroup}
                    >
                      <Text className="text-center font-medium text-primary">
                        Tham gia nhóm
                      </Text>
                    </TouchableOpacity>
                    <SpaceComponent width={25} />
                    <TouchableOpacity
                      onPress={handler.handleCreateGroupAndHideTabbar}
                      className="flex-1 rounded-lg bg-primary px-4 py-3 shadow-sm"
                    >
                      <Text className="text-center font-medium text-white">
                        Tạo nhóm
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </LoadingSectionWrapper>
        )}
        {groups && groups?.length > 0 && (
          <View className="absolute bottom-10 right-5">
            <TouchableOpacity
              className="h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-gray-400"
              onPress={handler.handleCreateGroupAndHideTabbar}
            >
              <AntDesign name="addusergroup" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
        <ModalLizeComponent ref={modalizeRef}>
          <View className="rounded-t-2xl bg-white p-5">
            <Text className="mb-6 text-center text-xl font-bold text-gray-800">
              Tham gia nhóm
            </Text>
            <View className="mb-6">
              <Text className="mb-2 text-sm text-gray-600">Mã mời</Text>
              <TextInput
                className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base"
                placeholder="Nhập mã được cung cấp bởi leader"
                placeholderTextColor="#888"
                value={memberCode}
                onChangeText={setMemberCode}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <TouchableOpacity
              className={`items-center rounded-lg px-4 py-3.5 ${
                memberCode.trim() ? "bg-primary" : "bg-gray-300"
              }`}
              onPress={handleSubmitJoinGroup}
              disabled={!memberCode.trim()}
            >
              <Text className="text-base font-semibold text-white">
                Xác nhận
              </Text>
            </TouchableOpacity>
          </View>
        </ModalLizeComponent>
      </SafeAreaViewCustom>
    </GestureHandlerRootView>
  );
};

export default Group;
