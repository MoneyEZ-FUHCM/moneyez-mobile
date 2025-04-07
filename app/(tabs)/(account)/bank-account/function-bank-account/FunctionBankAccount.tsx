import {
  InputComponent,
  ModalLizeComponent,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import React from "react";
import {
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { OtpInput } from "react-native-otp-entry";
import TEXT_TRANSLATE_FUNCTION_BANK_ACCOUNT from "./FunctionBankAccount.translate";
import useFunctionBankAccount from "./hooks/useFunctionBankAccount";
import { Colors } from "@/helpers/constants/color";

const FunctionBankAccount = () => {
  const params = useLocalSearchParams();
  const { state, handler } = useFunctionBankAccount(params);

  const BankSelectModal = ({
    setFieldValue,
  }: {
    setFieldValue: (field: string, value: any) => void;
  }) => {
    return (
      <View>
        {state.filteredBanks.length > 0 ? (
          state.filteredBanks.map((item) => (
            <TouchableOpacity
              key={item.id.toString()}
              className={`border-b border-gray-100 px-6 py-4 ${
                item.code !== "EZB" ? "opacity-20" : ""
              }`}
              onPress={() =>
                handler.handleSelectBank(item as any, setFieldValue)
              }
              disabled={item.code !== "EZB"}
            >
              <View className="flex-row items-center">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                  <Image
                    source={{ uri: item.logo }}
                    className="h-full w-full rounded-full"
                    resizeMode="contain"
                  />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="font-medium text-gray-800">{item.name}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="items-center justify-center p-8">
            <Text className="text-center text-gray-500">
              {
                TEXT_TRANSLATE_FUNCTION_BANK_ACCOUNT.TITLE
                  .VALID_BANK_ACCOUNT_NOT_FOUND
              }
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaViewCustom rootClassName="flex-1 bg-gray-50">
        <SectionComponent rootClassName="flex-row relative justify-center items-center h-14 px-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute bottom-[17px] left-4"
          >
            <MaterialIcons name="arrow-back" size={24} />
          </TouchableOpacity>
          <Text className="text-lg font-bold">
            {state.editMode
              ? "Chỉnh sửa thông tin ngân hàng"
              : "Liên kết ngân hàng"}
          </Text>
        </SectionComponent>
        <SectionComponent rootClassName="flex-1 p-6">
          <Formik
            innerRef={(ref) => (state.formikRef.current = ref)}
            initialValues={{
              accountNumber: "",
              bankName: "",
              bankShortName: "",
              accountHolderName: "",
            }}
            validationSchema={handler.validationSchema}
            onSubmit={handler.handleSubmit}
          >
            {({ handleSubmit, values }) => {
              handler.handleSubmitRef.current = handleSubmit;

              return (
                <View className="gap-y-3">
                  <View>
                    <InputComponent
                      isRequired
                      inputMode="numeric"
                      name={state.FORM_NAME.ACCOUNT_NUMBER}
                      label="Số tài khoản"
                      placeholder="Nhập số tài khoản"
                      labelClass="text-text-gray text-xs font-semibold"
                      inputClass="h-11 bg-gray-50 px-3 py-2  rounded-lg"
                      formatter={(value) => value.replace(/\D/g, "")}
                      maxLength={12}
                    />
                  </View>
                  <View className="">
                    <TouchableOpacity
                      className="rounded-lg"
                      onPress={handler.handleOpenBankSelect}
                    >
                      <View className="relative">
                        <TouchableOpacity
                          className="rounded-lg"
                          onPress={handler.handleOpenBankSelect}
                          activeOpacity={0.8}
                        >
                          <InputComponent
                            isRequired
                            name={state.FORM_NAME.BANK_NAME}
                            label="Tên ngân hàng"
                            placeholder="Chọn ngân hàng"
                            labelClass="text-text-gray text-xs font-semibold"
                            inputClass="h-11 bg-gray-50 px-3 py-2 rounded-lg pr-10"
                            editable={false}
                            value={values.bankName}
                            rightIcon={
                              <Feather
                                name="chevron-down"
                                size={20}
                                color="#777"
                              />
                            }
                          />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <InputComponent
                      isRequired
                      name={state.FORM_NAME.BANK_SHORT_NAME}
                      label="Tên viết tắt ngân hàng"
                      labelClass="text-text-gray text-xs font-semibold"
                      inputClass="h-11 bg-gray-50 px-3 py-2 rounded-lg"
                      editable={false}
                      value={values.bankShortName}
                    />
                  </View>
                  <View>
                    <InputComponent
                      isRequired
                      name={state.FORM_NAME.ACCOUNT_HOLDER_NAME}
                      label="Tên chủ tài khoản"
                      placeholder="Nhập tên chủ tài khoản"
                      labelClass="text-text-gray text-xs font-semibold"
                      inputClass="h-11 bg-gray-50 px-3 py-2 rounded-lg uppercase"
                    />
                  </View>
                </View>
              );
            }}
          </Formik>
        </SectionComponent>
        <ModalLizeComponent
          panGestureEnabled={state.isAtTop}
          scrollViewProps={{
            keyboardShouldPersistTaps: "handled",
            onScroll: handler.handleScroll,
            scrollEventThrottle: 16,
          }}
          modalStyle={{ minHeight: 500 }}
          ref={state.bankSelectModalRef}
          onOverlayPress={handler.handleCloseModal}
          HeaderComponent={
            <View className="rounded-t-[30px] bg-white px-6 py-4">
              <Text className="mb-2 text-lg font-bold text-gray-800">
                {TEXT_TRANSLATE_FUNCTION_BANK_ACCOUNT.BUTTON.CHOOSE_BANK}
              </Text>
              <View className="flex-row items-center rounded-lg bg-gray-100 px-3 py-2">
                <Feather name="search" size={18} color="#777" />
                <TextInput
                  className="ml-2 flex-1 text-gray-700"
                  placeholder="Tìm kiếm ngân hàng..."
                  value={state.searchText}
                  onChangeText={handler.setSearchText}
                />
                {state.searchText ? (
                  <TouchableOpacity onPress={() => handler.setSearchText("")}>
                    <Feather name="x" size={18} color="#777" />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          }
        >
          <BankSelectModal
            setFieldValue={state.formikRef.current?.setFieldValue}
          />
        </ModalLizeComponent>
        <SectionComponent rootClassName=" px-5 rounded-lg absolute bottom-5 w-full flex-1">
          <Pressable
            onPress={() => handler.handleSubmitRef.current()}
            className="h-12 items-center justify-center rounded-lg bg-primary"
          >
            <Text className="text-base font-semibold text-white">
              {state.editMode
                ? TEXT_TRANSLATE_FUNCTION_BANK_ACCOUNT.BUTTON.UPDATE
                : TEXT_TRANSLATE_FUNCTION_BANK_ACCOUNT.BUTTON.CONFIRM}
            </Text>
          </Pressable>
        </SectionComponent>

        {/* Rule Modal */}
        <ModalLizeComponent
          ref={state.ruleModalRef}
          adjustToContentHeight
          HeaderComponent={
            <View className="border-b border-gray-200 p-4">
              <Text className="text-lg font-bold">Điều khoản & Điều kiện</Text>
            </View>
          }
        >
          <View className="p-4">
            <Text className="mb-4 text-base">
              Bằng việc xác nhận, bạn đồng ý với các điều khoản sau:
            </Text>
            <Text className="mb-2">
              • Thông tin tài khoản ngân hàng là chính xác
            </Text>
            <Text className="mb-2">
              • Chịu trách nhiệm về các giao dịch phát sinh
            </Text>
            <Text className="mb-4">
              • Tuân thủ quy định của ngân hàng và ứng dụng
            </Text>

            <TouchableOpacity
              onPress={handler.handleAcceptRules}
              className="rounded-lg bg-primary p-3"
            >
              <Text className="text-center font-semibold text-white">
                Tôi đồng ý
              </Text>
            </TouchableOpacity>
          </View>
        </ModalLizeComponent>

        {/* OTP Modal */}
        <ModalLizeComponent
          ref={state.otpModalRef}
          adjustToContentHeight
          HeaderComponent={
            <View className="border-b border-gray-200 p-4">
              <Text className="text-lg font-bold">Xác thực OTP</Text>
            </View>
          }
        >
          <View className="p-4">
            <Text className="mb-4 text-base">
              Vui lòng nhập mã OTP được gửi đến email của bạn
            </Text>

            <OtpInput
              numberOfDigits={5}
              focusColor="green"
              focusStickBlinkingDuration={400}
              onTextChange={(text) => handler.setOtpCode(text)}
              theme={{
                containerStyle: {
                  width: "100%",
                  padding: 0,
                },
                pinCodeContainerStyle: {
                  width: 50,
                  borderColor: "#E1E1E1",
                  borderWidth: 2,
                },
                pinCodeTextStyle: {
                  color: Colors.colors.primary,
                },
                filledPinCodeContainerStyle: {
                  borderColor: Colors.colors.primary,
                  borderWidth: 2,
                },
              }}
            />

            <TouchableOpacity
              onPress={handler.handleVerifyOtp}
              className="mt-4 rounded-lg bg-primary p-3"
            >
              <Text className="text-center font-semibold text-white">
                Xác nhận
              </Text>
            </TouchableOpacity>
          </View>
        </ModalLizeComponent>
      </SafeAreaViewCustom>
    </GestureHandlerRootView>
  );
};

export default FunctionBankAccount;
