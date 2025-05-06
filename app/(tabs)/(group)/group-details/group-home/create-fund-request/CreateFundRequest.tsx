import {
  FlatListCustom,
  InputComponent,
  LoadingSectionWrapper,
  ModalLizeComponent,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import {
  formatCurrency,
  formatCurrencyInput,
  formatDateMonthYear,
  formatTime,
} from "@/helpers/libs";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Formik } from "formik";
import React, { useState } from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import * as Yup from "yup";
import useCreateFundRequest from "./hooks/useCreateFundRequest";
import usePendingRequests from "./hooks/usePendingRequests";
import TEXT_TRANSLATE_CREATE_FUND_REQUEST from "./CreateFundRequest.translate";
import TEXT_TRANSLATE_PENDING_REQUESTS from "./PendingRequests.translate";
import { TextAreaComponent } from "@/components/TextAreaComponent";
import { Colors } from "@/helpers/constants/color";
import { LinearGradient } from "expo-linear-gradient";
import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPE_TEXT,
} from "@/helpers/enums/globals";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const { TITLE, LABELS, BUTTON, MESSAGE_VALIDATE } =
  TEXT_TRANSLATE_CREATE_FUND_REQUEST;

export default function CreateFundRequest() {
  const { state, handler } = useCreateFundRequest();
  const { state: pendingState, handler: pendingHandler } = usePendingRequests();
  const { isSubmitting, fundBalance, formikRef } = state;
  const { handleBack, handleCreateFundRequest } = handler;

  // Tab state
  const [activeTab, setActiveTab] = useState<
    "createRequest" | "pendingRequests"
  >("createRequest");

  const FundRequestSchema = Yup.object().shape({
    amount: Yup.string()
      .required(MESSAGE_VALIDATE.AMOUNT_REQUIRED)
      .test("min-amount", "Giá trị thấp nhất là 10.000đ", function (value) {
        if (!value) return true;
        const numericValue = Number(value.replace(/\./g, ""));
        return numericValue >= 10000;
      })
      .test("max-amount", "Giá trị cao nhất là 5.000.000đ", function (value) {
        if (!value) return true;
        const numericValue = Number(value.replace(/\./g, ""));
        return numericValue <= 5000000;
      }),
    description: Yup.string()
      .required(MESSAGE_VALIDATE.DESCRIPTION_REQUIRED)
      .min(5, MESSAGE_VALIDATE.DESCRIPTION_MIN_LENGTH),
  });

  const openDetailModal = (item: any) => {
    pendingState.detailModalizeRef.current?.open();
    pendingHandler.handleOpenDetailModal(item);
  };

  const renderPendingRequestItem = ({ item }: any) => (
    <Pressable
      key={item.id}
      onPress={() => openDetailModal(item)} // Use the new function here
      className="relative mb-3 rounded-2xl bg-white p-4 shadow-sm shadow-gray-400"
    >
      <View className="flex-1">
        <View className="mb-2 flex-row items-center gap-x-2">
          <View
            className={`rounded-full p-1 ${item.type === TRANSACTION_TYPE_TEXT.INCOME ? "bg-green/10" : "bg-red/10"}`}
          >
            <Ionicons
              name={
                item.type === TRANSACTION_TYPE_TEXT.INCOME
                  ? "arrow-down"
                  : "arrow-up"
              }
              size={16}
              color={
                item.type === TRANSACTION_TYPE_TEXT.INCOME
                  ? "#16a34a"
                  : "#dc2626"
              }
            />
          </View>
          <Text
            className={`${item.type === TRANSACTION_TYPE_TEXT.INCOME ? "text-green" : "text-red"} text-xs font-bold`}
          >
            {item.type === TRANSACTION_TYPE_TEXT.INCOME
              ? TEXT_TRANSLATE_PENDING_REQUESTS.TYPE.INCOME
              : TEXT_TRANSLATE_PENDING_REQUESTS.TYPE.EXPENSE}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="mr-4 flex-1 flex-row items-center space-x-3">
            {item.avatarUrl ? (
              <Image
                source={{ uri: item.avatarUrl }}
                className="h-12 w-12 rounded-full"
              />
            ) : (
              <LinearGradient
                colors={["#609084", "#4A7A70"]}
                className="h-12 w-12 items-center justify-center rounded-full shadow-md"
              >
                <Text className="text-2xl font-semibold uppercase text-white">
                  {item.createdBy?.charAt(0)}
                </Text>
              </LinearGradient>
            )}
            <View className="flex-1">
              <Text className="text-base font-bold">{item.createdBy}</Text>
              <Text className="text-gray-600" numberOfLines={2}>
                "{item.description}"
              </Text>
            </View>
          </View>
          <Text
            className={`text-right text-base font-bold ${
              item.type === TRANSACTION_TYPE_TEXT.INCOME
                ? "text-green"
                : "text-red"
            }`}
          >
            {item.type === TRANSACTION_TYPE_TEXT.INCOME
              ? `+ ${formatCurrency(item.amount)}`
              : `- ${formatCurrency(item.amount)}`}
          </Text>
        </View>

        <View className="mt-4 flex-row items-center justify-between border-t border-gray-100 pt-3">
          <View className="flex-row items-center">
            <MaterialIcons name="pending" size={14} color="#60a5fa" />
            <Text className="ml-1 text-xs text-blue-400">
              {TEXT_TRANSLATE_PENDING_REQUESTS.STATUS.PENDING}
            </Text>
          </View>

          <View className="flex-row items-center rounded-full bg-gray-50 px-3 py-1.5">
            <MaterialIcons name="access-time" size={12} color="#666" />
            <Text className="ml-1 text-xs font-medium text-gray-600">
              {formatTime(item.createdDate)} ·{" "}
              {formatDateMonthYear(item.createdDate)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <GestureHandlerRootView>
      <SafeAreaViewCustom rootClassName="bg-[#f9f9f9] relative">
        <SectionComponent rootClassName="flex-row relative justify-center items-center bg-white h-14 px-4">
          <TouchableOpacity
            onPress={handleBack}
            className="absolute left-4 rounded-full bg-gray-50 p-2"
          >
            <MaterialIcons name="arrow-back" size={24} />
          </TouchableOpacity>
          <Text className="text-lg font-bold">{TITLE.MAIN_TITLE}</Text>
        </SectionComponent>

        <View className="flex-row bg-white">
          <Pressable
            onPress={() => setActiveTab("createRequest")}
            className={`flex-1 items-center border-b-2 py-3 ${activeTab === "createRequest" ? "border-primary" : "border-transparent"}`}
          >
            <Text
              className={`font-normal ${activeTab === "createRequest" ? "font-extrabold text-primary" : "text-[#757575]"}`}
            >
              {TITLE.MAIN_TITLE}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("pendingRequests")}
            className={`flex-1 items-center border-b-2 py-3 ${activeTab === "pendingRequests" ? "border-primary" : "border-transparent"}`}
          >
            <Text
              className={`font-normal ${activeTab === "pendingRequests" ? "font-extrabold text-primary" : "text-[#757575]"}`}
            >
              {TEXT_TRANSLATE_PENDING_REQUESTS.TITLE.MAIN_TITLE}
            </Text>
          </Pressable>
        </View>

        {activeTab === "createRequest" ? (
          <>
            <SectionComponent rootClassName="mx-5 my-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-xl">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="mb-1 text-sm text-gray-500">
                    {TITLE.FUND_BALANCE}
                  </Text>
                  <Text className="text-2xl font-bold text-primary">
                    {formatCurrency(fundBalance)}
                  </Text>
                </View>
                <View className="rounded-full bg-light/50 p-3">
                  <Ionicons
                    name="wallet-outline"
                    size={30}
                    color={Colors.colors.primary}
                  />
                </View>
              </View>
            </SectionComponent>

            <Formik
              initialValues={{
                amount: "",
                description: "Góp vào quỹ chung",
              }}
              innerRef={(ref) => (formikRef.current = ref)}
              validationSchema={FundRequestSchema}
              onSubmit={handleCreateFundRequest}
            >
              {({ handleSubmit }) => (
                <>
                  <SectionComponent rootClassName="mt-5 rounded-2xl bg-white p-5 mx-5">
                    <InputComponent
                      name="amount"
                      label={LABELS.AMOUNT}
                      placeholder={LABELS.AMOUNT_PLACEHOLDER}
                      inputMode="numeric"
                      isRequired
                      labelClass="text-text-gray text-[12px] font-bold"
                      formatter={formatCurrencyInput}
                    />
                    <View className="flex-row flex-wrap gap-2">
                      {[50000, 100000, 200000, 500000].map((amount) => (
                        <Pressable
                          key={amount}
                          onPress={() => {
                            formikRef.current?.setFieldValue(
                              "amount",
                              formatCurrencyInput(amount.toString()),
                            );
                          }}
                          className="rounded-full bg-thirdly px-3 py-0.5 text-primary"
                        >
                          <Text className="text-xs text-gray-700">
                            {formatCurrencyInput(amount.toString())}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                    <SpaceComponent height={10} />
                    <TextAreaComponent
                      name="description"
                      label={LABELS.DESCRIPTION}
                      placeholder={LABELS.DESCRIPTION_PLACEHOLDER}
                      labelClass="text-text-gray text-[12px]"
                      isRequired
                      maxLength={250}
                    />
                  </SectionComponent>

                  <SectionComponent rootClassName="absolute bottom-5 w-full">
                    <TouchableOpacity
                      onPress={() => handleSubmit()}
                      className="mx-5 rounded-xl bg-primary py-3"
                      disabled={isSubmitting}
                    >
                      <Text className="text-center text-lg font-medium text-white">
                        {isSubmitting ? BUTTON.SUBMITTING : BUTTON.SUBMIT}
                      </Text>
                    </TouchableOpacity>
                  </SectionComponent>
                </>
              )}
            </Formik>
          </>
        ) : (
          <LoadingSectionWrapper
            isLoading={
              pendingState.isLoadingRequests || pendingState.isFetchingRequests
            }
          >
            {pendingState.pendingRequests &&
            pendingState.pendingRequests.length > 0 ? (
              <FlatListCustom
                isBottomTab={true}
                isLoading={pendingState.isLoadingMore}
                className="mx-3 mt-5 rounded-2xl"
                data={pendingState.pendingRequests}
                renderItem={renderPendingRequestItem}
                keyExtractor={(item: any) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: 110,
                }}
                refreshing={pendingState.isFetchingRequests}
                onRefresh={pendingHandler.refreshRequests}
                onLoadMore={pendingHandler.handleLoadMore}
                hasMore={
                  pendingState.pendingRequests?.length === pendingState.pageSize
                }
              />
            ) : (
              <View className="mt-20 items-center justify-center p-6">
                <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                  <Feather name="inbox" size={32} color="#609084" />
                </View>
                <Text className="text-center text-lg text-gray-500">
                  {TEXT_TRANSLATE_PENDING_REQUESTS.TITLE.NO_DATA}
                </Text>
              </View>
            )}
          </LoadingSectionWrapper>
        )}
        <ModalLizeComponent
          ref={pendingState.detailModalizeRef}
          adjustToContentHeight
          modalStyle={{
            padding: 20,
          }}
        >
          <View className="pb-6">
            <Text className="mb-4 text-lg font-bold">Chi tiết giao dịch</Text>

            {pendingState.selectedRequest && (
              <View className="space-y-4">
                <View className="flex-row items-center">
                  {pendingState.selectedRequest?.avatarUrl ? (
                    <Image
                      source={{ uri: pendingState.selectedRequest.avatarUrl }}
                      className="h-16 w-16 rounded-full"
                    />
                  ) : (
                    <LinearGradient
                      colors={["#609084", "#4A7A70"]}
                      className="h-16 w-16 items-center justify-center rounded-full"
                    >
                      <Text className="text-3xl font-semibold uppercase text-white">
                        {pendingState.selectedRequest?.createdBy?.charAt(0)}
                      </Text>
                    </LinearGradient>
                  )}
                  <View className="ml-4">
                    <Text className="text-lg font-bold">
                      {pendingState.selectedRequest?.createdBy}
                    </Text>
                    <View className="flex-row items-center">
                      <MaterialIcons
                        name="access-time"
                        size={14}
                        color="#666"
                      />
                      <Text className="ml-1 text-sm text-gray-600">
                        {formatTime(pendingState.selectedRequest?.createdDate)}{" "}
                        ·{" "}
                        {formatDateMonthYear(
                          pendingState.selectedRequest?.createdDate,
                        )}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <MaterialIcons name="update" size={14} color="#666" />
                      <Text className="ml-1 text-sm text-gray-600">
                        {formatTime(pendingState.selectedRequest?.updatedDate)}{" "}
                        ·{" "}
                        {formatDateMonthYear(
                          pendingState.selectedRequest?.updatedDate,
                        )}
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="space-y-5 rounded-lg bg-gray-50 p-4">
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Loại giao dịch:</Text>
                    <Text
                      className={`font-medium ${
                        pendingState.selectedRequest?.type ===
                        TRANSACTION_TYPE_TEXT.INCOME
                          ? "text-green"
                          : "text-red"
                      }`}
                    >
                      {pendingState.selectedRequest?.type ===
                      TRANSACTION_TYPE_TEXT.INCOME
                        ? "Góp quỹ"
                        : "Rút quỹ"}
                    </Text>
                  </View>

                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Số tiền:</Text>
                    <Text
                      className={`font-medium ${
                        pendingState.selectedRequest?.type ===
                        TRANSACTION_TYPE_TEXT.INCOME
                          ? "text-green"
                          : "text-red"
                      }`}
                    >
                      {pendingState.selectedRequest?.type ===
                      TRANSACTION_TYPE_TEXT.INCOME
                        ? `+ ${formatCurrency(pendingState.selectedRequest?.amount)}`
                        : `- ${formatCurrency(pendingState.selectedRequest?.amount)}`}
                    </Text>
                  </View>
                  {pendingState.selectedRequest?.accountBankName && (
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Ngân hàng:</Text>
                      <Text className="font-medium">
                        {pendingState.selectedRequest.accountBankName}
                      </Text>
                    </View>
                  )}
                  {pendingState.selectedRequest?.accountBankNumber && (
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Số tài khoản:</Text>
                      <Text className="font-medium">
                        {pendingState.selectedRequest.accountBankNumber}
                      </Text>
                    </View>
                  )}
                  {pendingState.selectedRequest?.bankTransactionDate && (
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Ngày giao dịch:</Text>
                      <Text className="font-medium">
                        {pendingState.selectedRequest.bankTransactionDate}
                      </Text>
                    </View>
                  )}
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Nội dung:</Text>
                    <Text className="font-medium">
                      {pendingState.selectedRequest?.requestCode}
                    </Text>
                  </View>

                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Trạng thái:</Text>
                    <View className="flex-row items-center">
                      {pendingState.selectedRequest?.status ===
                      TRANSACTION_STATUS.APPROVED ? (
                        <>
                          <Ionicons
                            name="checkmark-circle"
                            size={14}
                            color="#609084"
                          />
                          <Text className="ml-1 text-primary">
                            {TEXT_TRANSLATE_PENDING_REQUESTS.STATUS.APPROVED}
                          </Text>
                        </>
                      ) : pendingState.selectedRequest?.status ===
                        TRANSACTION_STATUS.REJECTED ? (
                        <>
                          <Ionicons
                            name="close-circle"
                            size={14}
                            color="#F43F5E"
                          />
                          <Text className="ml-1 text-red">
                            {TEXT_TRANSLATE_PENDING_REQUESTS.STATUS.REJECTED}
                          </Text>
                        </>
                      ) : (
                        <>
                          <MaterialIcons
                            name="pending"
                            size={14}
                            color="#60a5fa"
                          />
                          <Text className="ml-1 text-blue-400">Đang chờ</Text>
                        </>
                      )}
                    </View>
                  </View>
                </View>

                <View>
                  <Text className="mb-2 font-medium">Mô tả:</Text>
                  <Text className="text-gray-600">
                    {pendingState.selectedRequest?.description}
                  </Text>
                </View>

                {pendingState.selectedRequest?.note && (
                  <View>
                    <Text className="mb-2 font-medium text-red">
                      Lý do từ chối:
                    </Text>
                    <Text className="text-gray-600">
                      {pendingState.selectedRequest?.note}
                    </Text>
                  </View>
                )}
              </View>
            )}

            <Pressable
              onPress={() => pendingState.detailModalizeRef.current?.close()}
              className="mt-8 rounded-lg bg-primary px-4 py-3"
            >
              <Text className="text-center text-white">Đóng</Text>
            </Pressable>
          </View>
        </ModalLizeComponent>
      </SafeAreaViewCustom>
    </GestureHandlerRootView>
  );
}
