import {
  FlatListCustom,
  LoadingSectionWrapper,
  ModalLizeComponent,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { formatDate } from "@/helpers/libs";
import { BankCardProps } from "@/types/bankAccount.types";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TEXT_TRANSLATE_ACCOUNT from "../../AccountScreen.translate";
import TEXT_TRANSLATE_BANK_ACCOUNT from "./BankAccount.translate";
import useBankAccount from "./hooks/useBankAccount";

const BankAccount = () => {
  const { state, handler } = useBankAccount();

  const BankCard = ({ item, onPress }: BankCardProps) => {
    return (
      <TouchableOpacity
        className="mb-4 overflow-hidden rounded-xl bg-white shadow"
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View className="px-2 py-4">
          <View className="flex-row items-center gap-x-3">
            <View className="rounded-[100%]">
              <Image
                source={{ uri: item.bankLogo }}
                className="h-[50px] w-[50px]"
                resizeMode="contain"
              />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-gray-900">
                {item.bankName}
              </Text>
              <Text className="mt-1 flex-row items-center text-sm text-gray-600">
                <Text className="mr-1 text-gray-400">
                  {TEXT_TRANSLATE_BANK_ACCOUNT.TITLE.ACCOUNT_HOLDER}
                </Text>{" "}
                {item.accountHolderName}
              </Text>
              <View className="mt-2 flex-row items-center">
                <View className="rounded-md bg-gray-100 px-2 py-1">
                  <Text className="text-sm font-medium text-gray-700">
                    {item.accountNumber}
                  </Text>
                </View>
                <TouchableOpacity
                  className="ml-2 p-1"
                  onPress={(e) => {
                    e.stopPropagation();
                    handler.handleCopyAccountNumber(item.accountNumber);
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
        </View>
        <View className="flex-row border-t border-gray-100">
          <TouchableOpacity
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
          </TouchableOpacity>
          <View className="w-px bg-gray-100" />
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center py-3"
            onPress={(e) => {
              handler.handleDeleteAccount(item?.id as string);
            }}
          >
            <Feather name="trash-2" size={16} color="#FF6B6B" />
            <Text className="ml-2 text-sm font-medium text-gray-700">
              {TEXT_TRANSLATE_BANK_ACCOUNT.BUTTON.DELETE}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const AccountDetail = () => {
    if (!state.selectedAccount) return null;

    return (
      <ScrollView className="p-6">
        <View className="mb-5 items-center">
          <View className="">
            <Image
              source={{ uri: state.selectedAccount?.bankLogo }}
              className="h-[50px] min-w-[100px]"
              resizeMode="cover"
            />
          </View>
          <Text className="text-center text-xl font-bold text-gray-900">
            {state.selectedAccount?.bankName}
          </Text>
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
        <SectionComponent rootClassName="flex-row items-center justify-between h-16 px-4 bg-white border-b border-gray-200 shadow-sm">
          <TouchableOpacity
            onPress={handler.handleBack}
            className="h-11 w-10 items-center justify-center rounded-full"
          >
            <AntDesign name="arrowleft" size={22} color="black" />
          </TouchableOpacity>
          <Text className="text-lg font-bold">
            {TEXT_TRANSLATE_ACCOUNT.TITLE.BANK_ACCOUNT}
          </Text>
          <View className="w-10" />
        </SectionComponent>
        <LoadingSectionWrapper isLoading={state.isLoading}>
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
          />
        </LoadingSectionWrapper>
        <ModalLizeComponent ref={state.detailModalRef}>
          <AccountDetail />
        </ModalLizeComponent>
        <SectionComponent rootClassName="absolute bottom-10 right-5">
          <TouchableOpacity
            className="h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-gray-400"
            onPress={() =>
              router.navigate(PATH_NAME.ACCOUNT.FUNCTION_BANK_ACCOUNT as any)
            }
          >
            <MaterialCommunityIcons name="bank-plus" size={24} color="white" />
          </TouchableOpacity>
        </SectionComponent>
      </SafeAreaViewCustom>
    </GestureHandlerRootView>
  );
};

export default BankAccount;
