import {
  FlatListCustom,
  LoadingSectionWrapper,
  ModalLizeComponent,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { formatDate } from "@/helpers/libs";
import { BankCardProps } from "@/helpers/types/bankAccount.types";
import {
  AntDesign,
  Feather,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TEXT_TRANSLATE_BANK_ACCOUNT from "./BankAccount.translate";
import useBankAccount from "./hooks/useBankAccount";
import { Colors } from "@/helpers/constants/color";

const BankAccount = () => {
  const { state, handler } = useBankAccount();

  const renderRulesContent = () => {
    return (
      <View className="p-5">
        <Text className="mb-4 text-center text-xl font-bold text-black">
          Tài khoản ngân hàng
        </Text>

        <View className="mb-4">
          <View className="mb-2 flex-row items-center">
            <MaterialIcons
              name="check-circle"
              size={20}
              color={Colors.colors.primary}
            />
            <Text className="ml-2 mr-2 text-base">
              Hệ thống chỉ hỗ trợ tạo và xác thực với ngân hàng Sandbox của nhóm
              (EzMoney Bank Sandbox).
            </Text>
          </View>

          <View className="mb-2 flex-row items-center">
            <MaterialIcons
              name="check-circle"
              size={20}
              color={Colors.colors.primary}
            />
            <Text className="ml-2 mr-2 text-base">
              Để liên kết được ngân hàng thì hệ thống cần xác thực đúng số tài
              khoản và chủ tài khoản của phía ngân hàng Sandbox.
            </Text>
          </View>

          <View className="mb-2 flex-row items-center">
            <MaterialIcons
              name="check-circle"
              size={20}
              color={Colors.colors.primary}
            />
            <Text className="ml-2 mr-2 text-base">
              Mỗi người dùng chỉ được thêm 3 tài khoản ngân hàng.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className="mt-5 rounded-lg bg-primary py-3"
          onPress={() => state.modalizeRef.current?.close()}
        >
          <Text className="text-center font-medium text-white">Đóng</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const BankCard = ({ item, onPress }: BankCardProps) => {
    return (
      <View className="mb-4 overflow-hidden rounded-xl bg-white shadow">
        <TouchableOpacity className="px-2 py-4" onPress={onPress}>
          <View className="flex-row items-center gap-x-3">
            <View className="rounded-[100%]">
              <Image
                source={{ uri: item.bankLogo }}
                className="h-[50px] w-[50px]"
                resizeMode="contain"
              />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-x-2">
                <Text className="text-base font-bold text-gray-900">
                  {item?.bankName}
                </Text>
                {(() => {
                  if (item?.isHasGroup) {
                    return (
                      <View className="flex-row items-center rounded-full bg-orange-100 px-2 py-1">
                        <View className="mr-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
                        <Text className="text-xs font-medium text-orange-500">
                          Đã tạo nhóm
                        </Text>
                      </View>
                    );
                  } else if (item?.isLinked) {
                    return (
                      <View className="flex-row items-center rounded-full bg-primary/10 px-2 py-1">
                        <View className="mr-1 h-1.5 w-1.5 rounded-full bg-primary" />
                        <Text className="text-xs font-medium text-primary">
                          Đã liên kết
                        </Text>
                      </View>
                    );
                  }
                  return null;
                })()}
              </View>
              <Text className="mt-1 flex-row items-center text-sm text-gray-600">
                <Text className="mr-1 text-gray-400">
                  {TEXT_TRANSLATE_BANK_ACCOUNT.TITLE.ACCOUNT_HOLDER}
                </Text>{" "}
                {item?.accountHolderName}
              </Text>
              <View className="mt-2 flex-row items-center">
                <View className="rounded-md bg-gray-100 px-2 py-1">
                  <Text className="text-sm font-medium text-gray-700">
                    {item?.accountNumber}
                  </Text>
                </View>
                <TouchableOpacity
                  className="ml-2 p-1"
                  onPress={(e) => {
                    e.stopPropagation();
                    handler.handleCopyAccountNumber(item?.accountNumber);
                  }}
                >
                  <Feather name="copy" size={16} color="#609084" />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              className="p-2"
              onPress={(e) => {
                e.stopPropagation();
                handler.handleViewDetail(item);
              }}
            >
              <Feather name="more-vertical" size={20} color="#777" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        <View className="flex-row border-t border-gray-100">
          {/* <TouchableOpacity
            className="flex-1 flex-row items-center justify-center py-3"
            onPress={(e) => {
              e.stopPropagation();
              handler.handleEditBankAccount(item);
            }}
          >
            <Feather name="edit-2" size={16} color="#609084" />
            <Text className="ml-2 text-sm font-medium text-gray-700">
              {TEXT_TRANSLATE_BANK_ACCOUNT.BUTTON.EDIT}
            </Text>
          </TouchableOpacity> */}
          <View className="w-px bg-gray-100" />
          {!item?.isLinked ? (
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center py-3"
              onPress={(e) => {
                e.stopPropagation();
                handler.handleWebhook(item?.id as string, false);
              }}
            >
              <Feather name="link" size={16} color="#FF9900" />
              <Text className="ml-2 text-sm font-medium text-gray-700">
                Liên kết
              </Text>
            </TouchableOpacity>
          ) : item?.isHasGroup ? null : (
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center py-3"
              onPress={(e) => {
                e.stopPropagation();
                handler.handleWebhook(item?.id as string, true);
              }}
            >
              <AntDesign name="disconnect" size={16} color="#FF9900" />
              <Text className="ml-2 text-sm font-medium text-gray-700">
                Hủy Liên kết
              </Text>
            </TouchableOpacity>
          )}

          {!item?.isLinked && (
            <>
              <View className="w-px bg-gray-100" />
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center py-3"
                onPress={(e) => {
                  handler.handleOpenModalDelete(item?.id as string);
                }}
              >
                <Feather name="trash-2" size={16} color="#FF6B6B" />
                <Text className="ml-2 text-sm font-medium text-gray-700">
                  {TEXT_TRANSLATE_BANK_ACCOUNT.BUTTON.DELETE}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };

  const AccountDetail = () => {
    if (!state.selectedAccount) return null;

    return (
      <ScrollView className="p-6">
        <View className="mb-5 items-center">
          <View className="mb-3">
            <Image
              source={{ uri: state.selectedAccount?.bankLogo }}
              className="h-[50px] min-w-[100px]"
              resizeMode="cover"
            />
          </View>
          <Text className="text-center text-xl font-bold text-gray-900">
            {state.selectedAccount?.bankName}
          </Text>
          <View className="flex-row space-x-2">
            {state.selectedAccount?.isHasGroup ? (
              <View className="mt-2 flex-row items-center rounded-full bg-orange-100 px-3 py-1.5">
                <View className="mr-1.5 h-2 w-2 rounded-full bg-orange-500" />
                <Text className="text-sm font-medium text-orange-500">
                  Đã tạo nhóm
                </Text>
              </View>
            ) : (
              state.selectedAccount?.isLinked && (
                <View className="mt-2 flex-row items-center rounded-full bg-primary/10 px-3 py-1.5">
                  <View className="mr-1.5 h-2 w-2 rounded-full bg-primary" />
                  <Text className="text-sm font-medium text-primary">
                    Đã liên kết
                  </Text>
                </View>
              )
            )}
          </View>
        </View>

        <View className="mb-6 rounded-xl bg-gray-50 p-5">
          <View className="mb-4 flex-row justify-between">
            <View>
              <Text className="mb-1 text-sm text-gray-500">
                {TEXT_TRANSLATE_BANK_ACCOUNT.TITLE.ACCOUNT_NUMBER}
              </Text>
              <View className="flex-row items-center">
                <Text className="text-lg font-semibold text-gray-800">
                  {state.selectedAccount?.accountNumber}
                </Text>
                <TouchableOpacity
                  className="ml-2 rounded-full bg-white p-1"
                  onPress={() =>
                    handler.handleCopyAccountNumber(
                      state.selectedAccount?.accountNumber as string,
                    )
                  }
                >
                  <Feather name="copy" size={16} color="#609084" />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Text className="mb-1 text-sm text-gray-500">
                {TEXT_TRANSLATE_BANK_ACCOUNT.TITLE.CREATE_DATE}
              </Text>
              <Text className="text-lg font-semibold text-gray-800">
                {formatDate(state.selectedAccount?.createdDate)}
              </Text>
            </View>
          </View>
          <View className="mb-4">
            <Text className="mb-1 text-sm text-gray-500">
              {TEXT_TRANSLATE_BANK_ACCOUNT.TITLE.ACCOUNT_HOLDER_FULL}
            </Text>
            <Text className="text-lg font-semibold text-gray-800">
              {state.selectedAccount.accountHolderName}
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaViewCustom rootClassName="bg-gray-50 relative">
        <SectionComponent rootClassName="flex-row relative justify-between bg-white items-center h-14 px-4">
          <TouchableOpacity onPress={handler.handleBack}>
            <MaterialIcons name="arrow-back" size={24} />
          </TouchableOpacity>
          <Text className="text-lg font-bold">
            {TEXT_TRANSLATE_BANK_ACCOUNT.TITLE.BANK_ACCOUNT}
          </Text>
          <Pressable onPress={handler.openRulesModal}>
            <FontAwesome6 name="circle-question" size={24} />
          </Pressable>
        </SectionComponent>
        <LoadingSectionWrapper
          isLoading={state.isLoading || state.isRefetching}
        >
          <FlatListCustom
            showsVerticalScrollIndicator={false}
            data={state.bankAccounts}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <BankCard
                item={item}
                onPress={() => handler.handleViewDetail(item)}
              />
            )}
            ListEmptyComponent={
              <View className="mt-10 items-center justify-center p-6">
                <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                  <Feather name="credit-card" size={32} color="#609084" />
                </View>
                <Text className="text-center text-lg text-gray-500">
                  {TEXT_TRANSLATE_BANK_ACCOUNT.TITLE.NO_BANK_ACCOUNT}
                </Text>
                <Text className="mt-2 text-center text-gray-400">
                  {TEXT_TRANSLATE_BANK_ACCOUNT.TITLE.CLICK_ADD_NEW_ACCOUNT}
                </Text>
              </View>
            }
            refreshing={state.isRefetching}
            onRefresh={handler.handleRefetch}
          />
        </LoadingSectionWrapper>
        <ModalLizeComponent ref={state.detailModalRef}>
          <AccountDetail />
        </ModalLizeComponent>
        <ModalLizeComponent ref={state.deleteModalRef}>
          <View className="p-6">
            <Text className="mb-4 text-center text-lg font-bold text-gray-900">
              Xác nhận xóa tài khoản
            </Text>
            <Text className="mb-6 text-center text-gray-600">
              Bạn có chắc chắn muốn xóa tài khoản ngân hàng này?
            </Text>
            <View className="flex-row gap-4">
              <TouchableOpacity
                className="flex-1 rounded-lg border border-gray-200 py-3"
                onPress={() => state.deleteModalRef.current?.close()}
              >
                <Text className="text-center font-medium text-gray-700">
                  Hủy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 rounded-lg bg-red py-3"
                onPress={handler.handleConfirmDelete}
              >
                <Text className="text-center font-medium text-white">Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ModalLizeComponent>
        <ModalLizeComponent
          ref={state.linkModalRef}
          HeaderComponent={
            <View className="border-b border-gray-200 p-4">
              <Text className="text-lg font-bold">
                Quy tắc liên kết tài khoản ngân hàng qua API Open Banking
              </Text>
            </View>
          }
        >
          <View className="p-6">
            <View className="mb-6 space-y-4">
              <View>
                <Text className="mb-2 font-medium text-primary">
                  Mục Đích Liên Kết
                </Text>
                <View className="space-y-2">
                  <Text className="text-gray-600">
                    • Liên kết tài khoản ngân hàng nhằm ghi nhận giao dịch một
                    cách tự động và chính xác trên ứng dụng MoneyEZ
                  </Text>
                </View>
              </View>

              <View>
                <Text className="mb-2 font-medium text-primary">
                  Cấp Quyền Truy Cập
                </Text>
                <View className="space-y-2">
                  <Text className="text-gray-600">
                    • Người dùng cần cho phép MoneyEZ truy cập thông tin giao
                    dịch từ ngân hàng để hệ thống tự động cập nhật.
                  </Text>
                </View>
              </View>

              <View>
                <Text className="mb-2 font-medium text-primary">
                  Xác Nhận Giao Dịch
                </Text>
                <View className="space-y-2">
                  <Text className="text-gray-600">
                    • Giao dịch sẽ được xác nhận qua webhook từ ngân hàng, đảm
                    bảo dữ liệu được đồng bộ và minh bạch.
                  </Text>
                </View>
              </View>
              <View>
                <Text className="mb-2 font-medium text-primary">
                  Bảo Mật Thông Tin
                </Text>
                <View className="space-y-2">
                  <Text className="text-gray-600">
                    • Người dùng có trách nhiệm bảo vệ thông tin đăng nhập và
                    mật khẩu. MoneyEZ cam kết sử dụng thông tin chỉ cho mục đích
                    liên kết ngân hàng.
                  </Text>
                </View>
              </View>
              <View>
                <Text className="mb-2 font-medium text-primary">
                  Tự Động Hóa Giao Dịch
                </Text>
                <View className="space-y-2">
                  <Text className="text-gray-600">
                    • Mọi giao dịch nạp, rút sẽ được cập nhật tự động vào ví
                    người dùng sau khi được xác thực qua API.
                  </Text>
                </View>
              </View>
              <Text className="italic">
                <Text className="text-primary">* </Text>
                Các quy tắc này giúp đảm bảo quá trình liên kết diễn ra nhanh
                chóng, an toàn và minh bạch đối với người dùng.
              </Text>
            </View>

            <View className="flex-row gap-4">
              <TouchableOpacity
                className="flex-1 rounded-lg border border-gray-200 py-3"
                onPress={() => state.linkModalRef.current?.close()}
              >
                <Text className="text-center font-medium text-gray-700">
                  Hủy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 rounded-lg bg-primary py-3"
                onPress={handler.handleConfirmLink}
              >
                <Text className="text-center font-medium text-white">
                  Tôi dồng ý
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ModalLizeComponent>
        <ModalLizeComponent ref={state.unlinkModalRef}>
          <View className="p-6">
            <Text className="mb-4 text-center text-lg font-bold text-gray-900">
              Xác nhận hủy liên kết
            </Text>
            <Text className="mb-6 text-center text-gray-600">
              Bạn có chắc chắn muốn hủy liên kết tài khoản ngân hàng này?
            </Text>
            <View className="flex-row gap-4">
              <TouchableOpacity
                className="flex-1 rounded-lg border border-gray-200 py-3"
                onPress={() => state.unlinkModalRef.current?.close()}
              >
                <Text className="text-center font-medium text-gray-700">
                  Hủy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 rounded-lg bg-red py-3"
                onPress={handler.handleConfirmUnlink}
              >
                <Text className="text-center font-medium text-white">
                  Xác nhận
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ModalLizeComponent>
        {state.bankAccounts && state.bankAccounts?.length < 3 && (
          <SectionComponent rootClassName="absolute bottom-10 right-5">
            <TouchableOpacity
              className="h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-gray-400"
              onPress={() =>
                router.navigate(
                  PATH_NAME.GROUP.CREATE_FUNCTION_BANK_ACCOUNT as any,
                )
              }
            >
              <MaterialCommunityIcons
                name="bank-plus"
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </SectionComponent>
        )}
      </SafeAreaViewCustom>
      <ModalLizeComponent ref={state.modalizeRef}>
        {renderRulesContent()}
      </ModalLizeComponent>
    </GestureHandlerRootView>
  );
};

export default BankAccount;
