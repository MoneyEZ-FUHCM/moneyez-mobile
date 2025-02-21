import {
  DatePickerComponent,
  InputComponent,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import CategoryItem from "@/components/InvidualScreenCustom/CategoryItem";
import { TextAreaComponent } from "@/components/TextAreaComponent";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { RadioButton } from "react-native-paper";
import ADD_TRANSACTION_CONSTANTS from "./AddTransaction.const";
import TEXT_TRANSLATE_ADD_TRANSACTION from "./AddTransaction.translate";
import useAddTransaction from "./hooks/useAddTransaction";

export default function AddTransaction() {
  const { type } = useLocalSearchParams();
  const { state, handler } = useAddTransaction(type as string);
  const PRIMARY_COLOR = "#609084";

  handler.useHideTabbar();

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-[#fafafa]">
      {/* HEADER */}
      <SectionComponent rootClassName="h-14 bg-white justify-center">
        <View className="flex-row items-center justify-between px-5">
          <Pressable onPress={handler.handleBack}>
            <MaterialIcons name="arrow-back" size={24} color={PRIMARY_COLOR} />
          </Pressable>
          <Text className="text-lg font-bold text-primary">
            {TEXT_TRANSLATE_ADD_TRANSACTION.TITLE.ADD_EXPENSE_INCOME}
          </Text>
          <MaterialIcons name="camera-alt" size={24} color="#609084" />
        </View>
      </SectionComponent>
      <Formik
        initialValues={state.initialValues}
        validationSchema={handler.validationSchema}
        onSubmit={handler.handleCreateTransaction}
      >
        {({ handleSubmit }) => (
          <ScrollView>
            {/* Transaction Type Selection */}
            <SectionComponent rootClassName="mx-5 mt-8 ">
              <View className="flex flex-row items-center space-x-4">
                {/* Chi tiêu */}
                <Pressable
                  onPress={() => handler.setTransactionType("expense")}
                  className={`flex h-16 flex-1 flex-row items-center rounded-lg border-[0.5px] bg-white p-4 ${
                    state.transactionType === "expense"
                      ? "border border-primary"
                      : "border-gray-300"
                  }`}
                >
                  <RadioButton.Android
                    value="expense"
                    status={
                      state.transactionType === "expense"
                        ? "checked"
                        : "unchecked"
                    }
                    onPress={() => handler.setTransactionType("expense")}
                    color="#609084"
                    uncheckedColor="gray"
                  />
                  <SpaceComponent width={5} />
                  <Text
                    className={`text-base font-semibold ${
                      state.transactionType === "expense"
                        ? "text-[#609084]"
                        : "text-gray-500"
                    }`}
                  >
                    {TEXT_TRANSLATE_ADD_TRANSACTION.BUTTON.EXPENSE}
                  </Text>
                </Pressable>

                {/* Thu nhập */}
                <Pressable
                  onPress={() => handler.setTransactionType("income")}
                  className={`flex h-16 flex-1 flex-row items-center rounded-lg border-[0.5px] bg-white p-4 ${
                    state.transactionType === "income"
                      ? "border border-primary"
                      : "border-gray-300"
                  }`}
                >
                  <RadioButton.Android
                    value="income"
                    status={
                      state.transactionType === "income"
                        ? "checked"
                        : "unchecked"
                    }
                    onPress={() => handler.setTransactionType("income")}
                    color="#609084"
                    uncheckedColor="gray"
                  />
                  <SpaceComponent width={5} />
                  <Text
                    className={`text-base font-semibold ${
                      state.transactionType === "income"
                        ? "text-[#609084]"
                        : "text-gray-500"
                    }`}
                  >
                    {TEXT_TRANSLATE_ADD_TRANSACTION.BUTTON.INCOME}
                  </Text>
                </Pressable>
              </View>
            </SectionComponent>

            {/* THÔNG TIN SECTION */}
            <SectionComponent rootClassName="bg-white m-4 p-2 rounded-lg">
              <Text className="mb-3 text-base font-semibold text-[#609084]">
                {TEXT_TRANSLATE_ADD_TRANSACTION.TITLE.INFORMATION}
              </Text>
              <InputComponent
                name="amount"
                label={TEXT_TRANSLATE_ADD_TRANSACTION.LABEL.MONEY_NUMBER}
                placeholder={TEXT_TRANSLATE_ADD_TRANSACTION.TITLE.INPUT_PRICE}
                inputMode="numeric"
                isRequired
                labelClass="text-black text-sm font-semibold"
              />
              <SpaceComponent height={10} />
              <DatePickerComponent
                isRequired
                label={TEXT_TRANSLATE_ADD_TRANSACTION.LABEL.DATE}
                name="dob"
                labelClass="text-black text-sm font-semibold"
              />
              <SpaceComponent height={10} />
              <TextAreaComponent
                name="description"
                label={TEXT_TRANSLATE_ADD_TRANSACTION.LABEL.DESCRIPTION}
                placeholder={
                  TEXT_TRANSLATE_ADD_TRANSACTION.TITLE.INPUT_DESCRIPTION
                }
                numberOfLines={6}
                isRequired
                labelClass="text-black text-sm font-semibold"
              />
            </SectionComponent>

            {/* PHÂN LOẠI SECTION */}
            <SectionComponent rootClassName="bg-white m-4 p-2 rounded-lg">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-base font-semibold text-[#609084]">
                  {TEXT_TRANSLATE_ADD_TRANSACTION.TITLE.SEPERATE}
                </Text>
                <Text className="text-sm text-[#757575]">
                  {TEXT_TRANSLATE_ADD_TRANSACTION.BUTTON.SEE_MORE} &gt;
                </Text>
              </View>
              <View className="flex-row flex-wrap">
                {ADD_TRANSACTION_CONSTANTS.CATEGORIES.map((category) => (
                  <Pressable
                    key={category.id}
                    onPress={() => handler.setSelectedCategory(category.label)}
                    className="mb-3 w-1/3 px-1.5"
                  >
                    <CategoryItem
                      label={category.label}
                      color={category.color}
                      iconName={
                        category.icon as keyof typeof MaterialIcons.glyphMap
                      }
                      isSelected={state.selectedCategory === category.label}
                    />
                  </Pressable>
                ))}
              </View>
            </SectionComponent>

            {/* ẢNH HÓA ĐƠN SECTION */}
            <SectionComponent rootClassName="bg-white m-4 p-4 rounded-lg">
              <Text className="mb-4 text-base font-semibold text-primary">
                {TEXT_TRANSLATE_ADD_TRANSACTION.TITLE.IMAGE_BILL}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {state.images.map((image, index) => (
                  <View
                    key={index}
                    className="relative mx-1 mb-2 h-[82px] w-[82px] overflow-hidden rounded-lg border border-[#ccc]"
                  >
                    <Image
                      source={{ uri: image }}
                      className="h-full w-full"
                      resizeMode="cover"
                    />
                  </View>
                ))}
                <Pressable
                  onPress={handler.pickAndUploadImage}
                  className="relative mx-1 mb-2 h-[82px] w-[82px] items-center justify-center overflow-hidden rounded-lg border border-[#ccc]"
                >
                  <MaterialIcons
                    name="add-circle-outline"
                    size={40}
                    color="#ccc"
                  />
                </Pressable>
              </View>
            </SectionComponent>

            {/* SUBMIT BUTTON */}
            <SectionComponent rootClassName="mx-5 mb-7 rounded-lg">
              <Pressable
                onPress={() => handleSubmit()}
                className="h-12 w-full items-center justify-center rounded-lg bg-[#609084]"
              >
                <Text className="text-base font-semibold text-white">
                  {state.transactionType === "expense"
                    ? TEXT_TRANSLATE_ADD_TRANSACTION.BUTTON.ADD_EXPENSE
                    : TEXT_TRANSLATE_ADD_TRANSACTION.BUTTON.ADD_INCOME}
                </Text>
              </Pressable>
            </SectionComponent>
          </ScrollView>
        )}
      </Formik>
    </SafeAreaViewCustom>
  );
}
