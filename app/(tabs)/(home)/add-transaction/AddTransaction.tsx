import {
  CategoryItem,
  DatePickerTransactionComponent,
  InputComponent,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { TextAreaComponent } from "@/components/TextAreaComponent";
import { TRANSACTION_TYPE_TEXT } from "@/enums/globals";
import { Colors } from "@/helpers/constants/color";
import { formatCurrencyInput } from "@/helpers/libs";
import { CategoryListFilter } from "@/types/category.types";
import { Subcategory } from "@/types/subCategory";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import React, { useCallback, useMemo } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, RadioButton } from "react-native-paper";
import TEXT_TRANSLATE_ADD_TRANSACTION from "./AddTransaction.translate";
import useAddTransaction from "./hooks/useAddTransaction";

export default function AddTransaction() {
  const { type } = useLocalSearchParams();
  const { state, handler } = useAddTransaction(type as string);

  const renderTransactionTypeButton = useCallback(
    (
      type: TRANSACTION_TYPE_TEXT.EXPENSE | TRANSACTION_TYPE_TEXT.INCOME,
      label: string,
    ) => (
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
          color={Colors.colors.primary}
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
        {state.images?.map((image, index) => (
          <View
            key={index}
            className="relative mx-1 mb-2 h-[82px] w-[82px] overflow-hidden rounded-lg border border-[#ccc]"
          >
            <Image
              source={{ uri: image }}
              className="h-full w-full"
              resizeMode="cover"
            />
            <Pressable
              onPress={() => handler.handleDeleteImage(image)}
              className="bg-red-500 absolute right-1 top-1 z-10 h-6 w-6 items-center justify-center rounded-full bg-gray-100"
            >
              <MaterialIcons name="close" size={18} color="black" />
            </Pressable>
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
      <SectionComponent rootClassName="h-14 bg-white justify-center items-center relative">
        <View className="relative h-full flex-row items-center px-5">
          <Pressable onPress={handler.handleBack} className="absolute left-4">
            <MaterialIcons name="arrow-back" size={24} />
          </Pressable>
          <View className="flex-1 items-center">
            <Text className="text-lg font-bold">
              {TEXT_TRANSLATE_ADD_TRANSACTION.TITLE.ADD_EXPENSE_INCOME}
            </Text>
          </View>
        </View>
      </SectionComponent>
      <Formik
        innerRef={(ref) => (state.formikRef.current = ref)}
        initialValues={state.initialValues}
        validationSchema={handler.validationSchema}
        onSubmit={handler.handlePreviewTransaction}
      >
        {({ handleSubmit }) => {
          handler.handleSubmitRef.current = handleSubmit;
          return (
            <ScrollView showsVerticalScrollIndicator={false} className="mb-16">
              <SectionComponent rootClassName="mx-5 mt-8">
                <View className="flex flex-row items-center space-x-4">
                  {renderTransactionTypeButton(
                    TRANSACTION_TYPE_TEXT.EXPENSE,
                    TEXT_TRANSLATE_ADD_TRANSACTION.BUTTON.EXPENSE,
                  )}
                  {renderTransactionTypeButton(
                    TRANSACTION_TYPE_TEXT.INCOME,
                    TEXT_TRANSLATE_ADD_TRANSACTION.BUTTON.INCOME,
                  )}
                </View>
              </SectionComponent>
              <SectionComponent rootClassName="bg-white m-4 p-2 rounded-lg">
                <Text className="text-lg font-bold tracking-tight text-primary">
                  {TEXT_TRANSLATE_ADD_TRANSACTION.TITLE.SEPERATE}
                </Text>
                <View className="mx-3 my-2 flex-row items-center">
                  <FlatList
                    ref={state.flatListRef}
                    horizontal
                    data={state.uniqueCategories ?? []}
                    keyExtractor={(item) => item.code}
                    renderItem={({
                      item,
                      index,
                    }: {
                      item: CategoryListFilter;
                      index: number;
                    }) => (
                      <TouchableOpacity
                        className={`my-1 mr-2.5 rounded-lg px-3 py-1 ${
                          item?.code === state.selectedCategoryCode
                            ? `scale-105 bg-primary ${index === 0 && "ml-1"} text-white shadow-xl shadow-primary/40`
                            : "border border-gray-200 bg-white text-gray-800 shadow-sm"
                        } transition-all duration-300`}
                        onPress={() =>
                          handler.handleSelectCategoryFilter(item?.code)
                        }
                      >
                        <Text
                          className={`text-xs ${item?.code === state.selectedCategoryCode ? "font-bold text-white" : "font-normal"} tracking-wide`}
                        >
                          {item?.name}
                        </Text>
                      </TouchableOpacity>
                    )}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
                <View className="mt-1 flex-row flex-wrap">
                  {state.isLoading ? (
                    <View className="h-44 w-full items-center justify-center">
                      <ActivityIndicator
                        size="small"
                        color={Colors.colors.primary}
                      />
                    </View>
                  ) : (
                    state.mapSubCategories?.map((subCategory: Subcategory) => {
                      return (
                        <Pressable
                          key={subCategory?.id}
                          onPress={() => {
                            handler.setSelectedSubCategory(subCategory?.id);
                            state.formikRef.current?.setFieldValue(
                              "description",
                              subCategory?.name,
                            );
                          }}
                          className="mb-3 w-1/3 px-1.5"
                        >
                          <CategoryItem
                            label={subCategory?.name}
                            color={Colors.colors.primary}
                            iconName={
                              subCategory?.icon as keyof typeof MaterialIcons.glyphMap
                            }
                            isSelected={
                              state.selectedSubCategory === subCategory?.id
                            }
                            rootClassName="flex-1 justify-center min-h-[110px]"
                          />
                        </Pressable>
                      );
                    })
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
                <View className="flex-row flex-wrap gap-2">
                  {[50000, 100000, 200000, 500000].map((amount) => (
                    <Pressable
                      key={amount}
                      onPress={() => {
                        state.formikRef.current?.setFieldValue(
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
                <DatePickerTransactionComponent
                  isRequired
                  label={TEXT_TRANSLATE_ADD_TRANSACTION.LABEL.DATE}
                  name="dob"
                  labelClass="text-text-gray text-[12px] font-bold"
                  createdDate={state.currentUserSpendingModel?.startDate}
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
          onPress={() => handler.handleSubmitRef.current()}
          className="h-12 items-center justify-center rounded-lg bg-primary"
        >
          <Text className="text-base font-semibold text-white">
            {state.transactionType.includes(TRANSACTION_TYPE_TEXT.EXPENSE)
              ? TEXT_TRANSLATE_ADD_TRANSACTION.BUTTON.ADD_EXPENSE
              : TEXT_TRANSLATE_ADD_TRANSACTION.BUTTON.ADD_INCOME}
          </Text>
        </Pressable>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
}
