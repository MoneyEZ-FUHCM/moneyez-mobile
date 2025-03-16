import {
  CategoryItem,
  DatePickerComponent,
  InputComponent,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { TextAreaComponent } from "@/components/TextAreaComponent";
import { formatCurrencyInput } from "@/helpers/libs";
import { Subcategory } from "@/types/subCategory";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Menu,
  RadioButton,
} from "react-native-paper";
import TEXT_TRANSLATE_ADD_TRANSACTION from "./AddTransaction.translate";
import useAddTransaction, {
  CategoryListFilter,
} from "./hooks/useAddTransaction";

const PRIMARY_COLOR = "#609084";

export default function AddTransaction() {
  const { type } = useLocalSearchParams();
  const { state, handler } = useAddTransaction(type as string);
  const handleSubmitRef = useRef<() => void>(() => {});

  handler.useHideTabbar();

  const formikRef = useRef<any>(null);

  const renderTransactionTypeButton = useCallback(
    (type: "EXPENSE" | "INCOME", label: string) => (
      <Pressable
        onPress={() => handler.setTransactionType(type)}
        className={`flex h-16 flex-1 flex-row items-center rounded-lg border-[0.5px] bg-white p-4 ${
          state.transactionType === type ? "border-primary" : "border-gray-300"
        }`}
      >
        <RadioButton.Android
          value={type}
          status={state.transactionType === type ? "checked" : "unchecked"}
          onPress={() => handler.setTransactionType(type)}
          color={PRIMARY_COLOR}
          uncheckedColor="gray"
        />
        <SpaceComponent width={5} />
        <Text
          className={`text-base font-semibold ${
            state.transactionType === type ? "text-primary" : "text-gray-500"
          }`}
        >
          {label}
        </Text>
      </Pressable>
    ),
    [state.transactionType, handler],
  );

  const renderImageList = useMemo(
    () => (
      <>
        {state?.images.map((image, index) => (
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
          <MaterialIcons name="add-circle-outline" size={40} color="#ccc" />
        </Pressable>
      </>
    ),
    [state.images, handler],
  );

  return (
    <SafeAreaViewCustom rootClassName="bg-[#fafafa] relative">
      <SectionComponent rootClassName="h-14 bg-white justify-center">
        <View className="flex-row items-center justify-between px-5">
          <Pressable onPress={handler.handleBack}>
            <MaterialIcons name="arrow-back" size={24} color={PRIMARY_COLOR} />
          </Pressable>
          <Text className="text-lg font-bold text-primary">
            {TEXT_TRANSLATE_ADD_TRANSACTION.TITLE.ADD_EXPENSE_INCOME}
          </Text>
          <MaterialIcons name="camera-alt" size={24} color={PRIMARY_COLOR} />
        </View>
      </SectionComponent>
      <Formik
        innerRef={(ref) => (formikRef.current = ref)}
        initialValues={state.initialValues}
        validationSchema={handler.validationSchema}
        onSubmit={handler.handleCreateTransaction}
      >
        {({ handleSubmit }) => {
          handleSubmitRef.current = handleSubmit;
          return (
            <ScrollView showsVerticalScrollIndicator={false} className="mb-16">
              <SectionComponent rootClassName="mx-5 mt-8">
                <View className="flex flex-row items-center space-x-4">
                  {renderTransactionTypeButton(
                    "EXPENSE",
                    TEXT_TRANSLATE_ADD_TRANSACTION.BUTTON.EXPENSE,
                  )}
                  {renderTransactionTypeButton(
                    "INCOME",
                    TEXT_TRANSLATE_ADD_TRANSACTION.BUTTON.INCOME,
                  )}
                </View>
              </SectionComponent>

              <SectionComponent rootClassName="bg-white m-4 p-2 rounded-lg">
                <Text className="mb-3 text-base font-semibold text-primary">
                  {TEXT_TRANSLATE_ADD_TRANSACTION.TITLE.INFORMATION}
                </Text>
                <InputComponent
                  name="amount"
                  label={TEXT_TRANSLATE_ADD_TRANSACTION.LABEL.MONEY_NUMBER}
                  placeholder={TEXT_TRANSLATE_ADD_TRANSACTION.TITLE.INPUT_PRICE}
                  inputMode="numeric"
                  isRequired
                  labelClass="text-text-gray text-[12px] font-bold"
                  formatter={formatCurrencyInput}
                />
                <SpaceComponent height={10} />
                <DatePickerComponent
                  isRequired
                  label={TEXT_TRANSLATE_ADD_TRANSACTION.LABEL.DATE}
                  name="dob"
                  labelClass="text-text-gray text-[12px] font-bold"
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
                  labelClass="text-text-gray text-[12px] font-bold"
                />
              </SectionComponent>
              <SectionComponent rootClassName="bg-white m-4 p-2 rounded-lg">
                <Text className="text-lg font-bold tracking-tight text-primary">
                  {TEXT_TRANSLATE_ADD_TRANSACTION.TITLE.SEPERATE}
                </Text>
                <View className="mx-3 my-2 flex-row items-center">
                  <FlatList
                    removeClippedSubviews={false}
                    horizontal
                    data={state.uniqueCategories}
                    keyExtractor={(item) => item.categoryCode}
                    renderItem={({
                      item,
                      index,
                    }: {
                      item: CategoryListFilter;
                      index: number;
                    }) => (
                      <TouchableOpacity
                        className={`my-1 mr-2.5 rounded-lg px-3 py-1 ${
                          item?.categoryCode === state.selectedCategoryCode
                            ? `scale-105 bg-primary ${index === 0 && "ml-1"} text-white shadow-xl shadow-primary/40`
                            : "border border-gray-200 bg-white text-gray-800 shadow-sm"
                        } transition-all duration-300`}
                        onPress={() =>
                          handler.handleSelectCategoryFilter(item?.categoryCode)
                        }
                      >
                        <Text
                          className={`text-xs ${item?.categoryCode === state.selectedCategoryCode ? "font-bold text-white" : "font-normal"} tracking-wide`}
                        >
                          {item?.categoryName}
                        </Text>
                      </TouchableOpacity>
                    )}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
                <View className="flex-row flex-wrap">
                  {state.isLoading ? (
                    <View className="h-44 w-full items-center justify-center">
                      <ActivityIndicator size="small" color={PRIMARY_COLOR} />
                    </View>
                  ) : (
                    state.mapSubCategories?.map((subCategory: Subcategory) => {
                      return (
                        <Pressable
                          key={subCategory?.id}
                          onPress={() =>
                            handler.setSelectedCategory(subCategory?.id)
                          }
                          className="mb-3 w-1/3 px-1.5"
                        >
                          <CategoryItem
                            label={subCategory?.name}
                            color={PRIMARY_COLOR}
                            iconName={
                              subCategory?.icon as keyof typeof MaterialIcons.glyphMap
                            }
                            isSelected={
                              state.selectedCategory === subCategory?.id
                            }
                            rootClassName="flex-1 justify-center min-h-[110px]"
                          />
                        </Pressable>
                      );
                    })
                  )}
                </View>
              </SectionComponent>
              <SectionComponent rootClassName="bg-white m-4 p-4 rounded-lg">
                <Text className="mb-4 text-base font-semibold text-primary">
                  {TEXT_TRANSLATE_ADD_TRANSACTION.TITLE.IMAGE_BILL}
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {renderImageList}
                </View>
              </SectionComponent>
            </ScrollView>
          );
        }}
      </Formik>
      <SectionComponent rootClassName=" px-5 rounded-lg absolute bottom-5 w-full flex-1">
        <Pressable
          onPress={() => handleSubmitRef.current()}
          className="h-12 items-center justify-center rounded-lg bg-primary"
        >
          <Text className="text-base font-semibold text-white">
            {state.transactionType.includes("EXPENSE")
              ? TEXT_TRANSLATE_ADD_TRANSACTION.BUTTON.ADD_EXPENSE
              : TEXT_TRANSLATE_ADD_TRANSACTION.BUTTON.ADD_INCOME}
          </Text>
        </Pressable>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
}
