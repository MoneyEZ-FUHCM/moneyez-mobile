import {
  CategoryItem,
  DatePickerComponent,
  InputComponent,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { TextAreaComponent } from "@/components/TextAreaComponent";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import React, { useCallback, useMemo } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { ActivityIndicator, RadioButton } from "react-native-paper";
import TEXT_TRANSLATE_ADD_TRANSACTION from "./AddTransaction.translate";
import useAddTransaction from "./hooks/useAddTransaction";

const PRIMARY_COLOR = "#609084";

export default function AddTransaction() {
  const { type } = useLocalSearchParams();
  const { state, handler } = useAddTransaction(type as string);

  handler.useHideTabbar();

  const ICONS_CATE = useMemo(
    () => [
      { icon: "home", color: "#FF5733" },
      { icon: "business", color: "#33FF57" },
      { icon: "work", color: "#3357FF" },
      { icon: "shopping-cart", color: "#FF33A1" },
      { icon: "settings", color: "#FFC300" },
      { icon: "school", color: "#DAF7A6" },
      { icon: "favorite", color: "#C70039" },
      { icon: "star", color: "#900C3F" },
      { icon: "attach-money", color: "#581845" },
    ],
    [],
  );

  const renderTransactionTypeButton = useCallback(
    (type: "expense" | "income", label: string) => (
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
    <SafeAreaViewCustom rootClassName="flex-1 bg-[#fafafa]">
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
        initialValues={state.initialValues}
        validationSchema={handler.validationSchema}
        onSubmit={handler.handleCreateTransaction}
      >
        {({ handleSubmit }) => (
          <ScrollView>
            <SectionComponent rootClassName="mx-5 mt-8">
              <View className="flex flex-row items-center space-x-4">
                {renderTransactionTypeButton(
                  "expense",
                  TEXT_TRANSLATE_ADD_TRANSACTION.BUTTON.EXPENSE,
                )}
                {renderTransactionTypeButton(
                  "income",
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
              <Text className="mb-4 text-base font-semibold text-primary">
                {TEXT_TRANSLATE_ADD_TRANSACTION.TITLE.SEPERATE}
              </Text>
              <View className="flex-row flex-wrap">
                {state.isLoading ? (
                  <View className="h-44 w-full items-center justify-center">
                    <ActivityIndicator size="small" color={PRIMARY_COLOR} />
                  </View>
                ) : (
                  state?.categories?.map((category, index) => {
                    const { icon, color } =
                      ICONS_CATE[index % ICONS_CATE.length];
                    return (
                      <Pressable
                        key={category.id}
                        onPress={() => handler.setSelectedCategory(category.id)}
                        className="mb-3 w-1/3 px-1.5"
                      >
                        <CategoryItem
                          label={category.name}
                          color={color}
                          iconName={icon as keyof typeof MaterialIcons.glyphMap}
                          isSelected={state.selectedCategory === category.id}
                          rootClassName="flex-1 justify-center min-h-[110px]"
                        />
                      </Pressable>
                    );
                  })
                )}
              </View>
              {state?.categories.length < state?.totalCount &&
                !state.isLoadingMore && (
                  <Pressable onPress={handler.handleLoadMore} className="my-2">
                    <Text className="text-center text-sm text-[#757575]">
                      {TEXT_TRANSLATE_ADD_TRANSACTION.BUTTON.SEE_MORE} &gt;
                    </Text>
                  </Pressable>
                )}
              {state.isLoadingMore && (
                <ActivityIndicator
                  size="small"
                  color={PRIMARY_COLOR}
                  className="my-2"
                />
              )}
            </SectionComponent>
            <SectionComponent rootClassName="bg-white m-4 p-4 rounded-lg">
              <Text className="mb-4 text-base font-semibold text-primary">
                {TEXT_TRANSLATE_ADD_TRANSACTION.TITLE.IMAGE_BILL}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {renderImageList}
              </View>
            </SectionComponent>
            <SectionComponent rootClassName="mx-5 mb-7 rounded-lg">
              <Pressable
                onPress={() => handleSubmit()}
                className="h-12 w-full items-center justify-center rounded-lg bg-primary"
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
