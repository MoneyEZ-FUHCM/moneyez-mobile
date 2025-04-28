import {
  InputComponent,
  ModalLizeComponent,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import { Feather, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
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
import TEXT_TRANSLATE_FUNCTION_BANK_ACCOUNT from "./FunctionBankAccount.translate";
import useFunctionBankAccount from "./hooks/useFunctionBankAccount";
import { Colors } from "@/helpers/constants/color";

const FunctionBankAccount = () => {
  const params = useLocalSearchParams();
  const { state, handler } = useFunctionBankAccount(params);

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
        <SectionComponent rootClassName="flex-row relative bg-white justify-between items-center h-14 px-4">
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} />
          </TouchableOpacity>
          <Text className="text-lg font-bold">
            {state.editMode
              ? "Chỉnh sửa tài khoản ngân hàng"
              : "Thêm tài khoản ngân hàng"}
          </Text>
          <Pressable onPress={handler.openRulesModal}>
            <FontAwesome6 name="circle-question" size={24} />
          </Pressable>
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
      </SafeAreaViewCustom>
      <ModalLizeComponent ref={state.modalizeRef}>
        {renderRulesContent()}
      </ModalLizeComponent>
    </GestureHandlerRootView>
  );
};

export default FunctionBankAccount;
