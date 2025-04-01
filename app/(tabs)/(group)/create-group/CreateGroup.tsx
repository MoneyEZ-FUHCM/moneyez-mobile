import {
  InputComponent,
  ModalLizeComponent,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import { TextAreaComponent } from "@/components/TextAreaComponent";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useMemo } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TEXT_TRANSLATE_BANK_ACCOUNT from "../../(account)/bank-account/bank-account-list/BankAccount.translate";
import useCreateGroupScreen from "../hooks/useCreateGroupScreen";
import TEXT_TRANSLATE_CREATE_GROUP from "./CreateGroup.translate";

const CreateGroup = () => {
  const { TITLE, STEPS, BUTTON, TEXT, PLACEHOLDER } =
    TEXT_TRANSLATE_CREATE_GROUP;
  const { state, handler } = useCreateGroupScreen();

  const renderImage = useMemo(
    () => (
      <View className="flex flex-row items-center space-x-3">
        {state?.imageUrl ? (
          <Pressable
            onPress={handler.pickAndUploadImage}
            className="relative h-[90px] w-[90px] overflow-hidden rounded-full border border-gray-300 shadow-sm"
          >
            <Image
              source={{ uri: state.imageUrl }}
              className="h-full w-full"
              resizeMode="cover"
            />
          </Pressable>
        ) : (
          <Pressable
            onPress={handler.pickAndUploadImage}
            className="relative mx-1 mb-2 h-[82px] w-[82px] items-center justify-center overflow-hidden rounded-lg border border-[#ccc]"
          >
            <MaterialIcons name="add-circle-outline" size={40} color="#ccc" />
          </Pressable>
        )}
      </View>
    ),
    [state.imageUrl, handler],
  );

  const BankSelectModal = ({
    setFieldValue,
  }: {
    setFieldValue: (field: string, value: any) => void;
  }) => {
    return (
      <View className="flex-1">
        {(state.mappedAccounts ?? []).length > 0 ? (
          (state.mappedAccounts ?? []).map((item) => (
            <TouchableOpacity
              key={item.id.toString()}
              className="flex-row items-center border-b border-gray-100 px-4 py-3"
              onPress={() => handler.handleSelectBank(item, setFieldValue)}
            >
              <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-gray-50">
                <Image
                  source={{ uri: item?.logo ?? undefined }}
                  className="h-full w-full rounded-full"
                  resizeMode="contain"
                />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-800">
                  {item?.accountHolderName}
                </Text>
                <Text className="text-sm text-gray-600">
                  {item?.accountNumber}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="flex-1 items-center justify-center p-6">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <Feather name="credit-card" size={36} color="#609084" />
            </View>
            <Text className="mb-2 text-center text-lg font-semibold text-gray-700">
              {TEXT_TRANSLATE_BANK_ACCOUNT.TITLE.NO_BANK_ACCOUNT}
            </Text>
            <Text className="text-center text-gray-500">
              Nhấn nút bên dưới để thêm tài khoản mới
            </Text>
            <TouchableOpacity
              className="my-5 rounded-lg bg-primary px-4 py-2"
              onPress={handler.handleNavigateCreateBankAccount}
            >
              <Text className="font-semibold text-white">Tạo tài khoản</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaViewCustom rootClassName="bg-gray-50">
        {/* Header */}
        <SectionComponent rootClassName="relative flex-row bg-white items-center justify-center h-14 px-5 shadow-sm">
          <TouchableOpacity
            onPress={router.back}
            className="absolute left-2 rounded-full p-2 active:opacity-75"
          >
            <AntDesign name="arrowleft" size={24} />
          </TouchableOpacity>
          <Text className="text-lg font-bold">{TITLE.CREATE_NEW_GROUP}</Text>
        </SectionComponent>

        <Formik
          innerRef={(ref) => (state.formikRef.current = ref)}
          initialValues={{
            name: "",
            description: "",
            currentBalance: 0,
            accountBankId: "",
            image: "",
            bankAccountNumber: "",
            bankName: "",
          }}
          validationSchema={handler.validationSchema}
          onSubmit={handler.handleCreateGroup}
        >
          {({ handleSubmit, values }) => (
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              className="flex-1 px-6 py-6"
            >
              <Text className="mb-2 text-lg font-semibold text-primary">
                {STEPS.INFORMATION}
              </Text>

              <View className="rounded-lg bg-white p-5 shadow-md">
                <InputComponent
                  name="name"
                  label={TEXT.GROUP_NAME}
                  placeholder={PLACEHOLDER.ENTER_GROUP_NAME}
                  isRequired
                  containerClass="mb-5"
                  labelClass="text-sm text-gray-600"
                  inputClass="text-sm text-gray-800"
                />
                <TouchableOpacity
                  className="rounded-lg"
                  onPress={handler.handleOpenBankSelect}
                >
                  <InputComponent
                    name="accountBankId"
                    label={TEXT.ACCOUNT_BANKING}
                    placeholder={PLACEHOLDER.ENTER_ACCOUNT_BANKING}
                    isRequired
                    containerClass="mb-5"
                    labelClass="text-sm text-gray-600"
                    inputClass="text-sm text-gray-800"
                    editable={false}
                    rightIcon={
                      <Feather name="chevron-down" size={20} color="#777" />
                    }
                    value={
                      values.bankName && values.bankAccountNumber
                        ? `${values.bankName} - ${values.bankAccountNumber}`
                        : ""
                    }
                    left
                  />
                </TouchableOpacity>
                <TextAreaComponent
                  name="description"
                  label={TEXT.DESCRIPTION}
                  placeholder={PLACEHOLDER.ENTER_DESCRIPTION}
                  isRequired
                  containerClass="mb-5"
                  labelClass="text-sm text-gray-600"
                  inputClass="text-sm text-gray-800"
                />
                <Text className="mb-2 text-sm text-gray-600">Ảnh</Text>
                {renderImage}
              </View>
              <View className="absolute bottom-5 left-6 right-6">
                <TouchableOpacity
                  onPress={() => handleSubmit()}
                  className="w-full items-center rounded-lg bg-primary py-3 shadow-lg"
                >
                  <Text className="text-lg font-semibold text-white">
                    {BUTTON.NEXT}
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          )}
        </Formik>
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
                Chọn tài khoản
              </Text>
              <View className="flex-row items-center rounded-lg bg-gray-100 px-3 py-2">
                <Feather name="search" size={18} color="#777" />
                <TextInput
                  className="ml-2 flex-1 text-gray-700"
                  placeholder="Tìm kiếm tài khoản..."
                  // value={state.searchQuery}
                  onChangeText={handler.setSearchText}
                />
                {state.searchQuery ? (
                  <TouchableOpacity onPress={() => handler.setSearchText("")}>
                    <Feather name="x" size={18} color="#777" />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          }
        >
          <BankSelectModal
            setFieldValue={state.formikRef?.current?.setFieldValue}
          />
        </ModalLizeComponent>
      </SafeAreaViewCustom>
    </GestureHandlerRootView>
  );
};

export default CreateGroup;
