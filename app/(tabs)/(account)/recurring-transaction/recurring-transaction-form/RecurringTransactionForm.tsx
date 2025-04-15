import { MaterialIcons } from "@expo/vector-icons";
import { Formik, FormikProps } from "formik";
import React, { useCallback, useEffect, useRef } from "react";
import { ActivityIndicator, FlatList, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { CategoryItem, InputComponent, SafeAreaViewCustom, SectionComponent, SpaceComponent } from "@/components";
import { DatePickerRecurringTransaction } from "@/components/DatePickerRecurringTransaction";
import TagInputComponent from "@/components/TagInputComponent";
import { TextAreaComponent } from "@/components/TextAreaComponent";
import { TRANSACTION_TYPE_TEXT } from "@/enums/globals";
import { formatCurrencyInput } from "@/helpers/libs";
import { CategoryListFilter } from "@/types/category.types";
import { RecurringTransactionFormValues } from "@/types/recurringTransaction.types";
import { Subcategory } from "@/types/subCategory";
import useRecurringTransactionForm from "./hooks/useRecurringTransactionForm";
import TEXT_TRANSLATE from "./RecurringTransactionForm.translate";

const RecurringTransactionForm = () => {
  const { state, handler } = useRecurringTransactionForm();
  const formikRef = useRef<FormikProps<RecurringTransactionFormValues>>(null);


  useEffect(() => {
    if (state.isEditing && state.transactionData?.data) {
      const data = state.transactionData.data;
      formikRef.current?.setValues({
        subcategoryId: data.subcategoryId,
        amount: formatCurrencyInput(data.amount.toString()),
        frequencyType: data.frequencyType,
        interval: data.interval.toString(),
        startDate: new Date(data.startDate),
        description: data.description || "",
        tags: data.tags || "",
      });
      handler.handleSelectSubcategory(data.subcategoryId);
    }
  }, [state.isEditing, state.transactionData, handler]);

  const renderHeader = useCallback(() => (
    <SectionComponent rootClassName="h-14 bg-white justify-center items-center relative">
      <View className="flex-row items-center px-4">
        <Pressable onPress={handler.handleBack} accessibilityLabel="Go back" className="absolute left-4">
          <MaterialIcons name="arrow-back" size={24} color="#609084" />
        </Pressable>
        <View className="flex-1 items-center">
          <Text className="text-lg font-bold">
            {state.isEditing
              ? TEXT_TRANSLATE.TITLE.EDIT_RECURRING_TRANSACTION
              : TEXT_TRANSLATE.TITLE.ADD_RECURRING_TRANSACTION}
          </Text>
        </View>
      </View>
    </SectionComponent>
  ), [handler.handleBack, state.isEditing]);

  const renderTransactionTypeButton = useCallback(
    (type: TRANSACTION_TYPE_TEXT.EXPENSE | TRANSACTION_TYPE_TEXT.INCOME, label: string) => (
      <Pressable
        onPress={() => handler.handleChangeTransactionType(type)}
        accessibilityLabel={`Transaction type ${label}`}
        className={`flex-1 h-16 flex-row items-center justify-center rounded-lg border p-4 ${state.transactionType === type ? "border-[#609084]" : "border-gray-300"
          } bg-white mx-1`}
      >
        <MaterialIcons
          name={state.transactionType === type ? "radio-button-checked" : "radio-button-unchecked"}
          size={24}
          color={state.transactionType === type ? "#609084" : "gray"}
        />
        <SpaceComponent width={2} />
        <Text className={`text-base ${state.transactionType === type ? "font-bold text-[#609084]" : "text-gray-500"}`}>
          {label}
        </Text>
      </Pressable>
    ),
    [state.transactionType, handler],
  );

  const renderFrequencyOptions = useCallback(() => (
    <>
      <View className="flex-row flex-wrap mb-2">
        {[
          { value: 0, label: TEXT_TRANSLATE.FREQUENCY.DAILY },
          { value: 1, label: TEXT_TRANSLATE.FREQUENCY.WEEKLY },
          { value: 2, label: TEXT_TRANSLATE.FREQUENCY.MONTHLY },
          { value: 3, label: TEXT_TRANSLATE.FREQUENCY.YEARLY },
        ].map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => formikRef.current?.setFieldValue("frequencyType", option.value)}
            accessibilityLabel={`Frequency ${option.label}`}
            className={`px-4 py-2 rounded-lg m-1 ${formikRef.current?.values.frequencyType === option.value ? "bg-[#609084]" : "bg-gray-200"
              }`}
          >
            <Text className={formikRef.current?.values.frequencyType === option.value ? "text-white font-bold" : "text-gray-800"}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="flex-row items-center mb-2">
        <Text className="mr-2 text-sm font-semibold">{TEXT_TRANSLATE.PLACEHOLDER.EVERY}</Text>
        <View className="w-20 mr-2 relative">
          <InputComponent
            name="interval"
            placeholder="1"
            inputMode="numeric"
            label=""
            inputClass="pr-9 text-center font-semibold"
          />
          <View className="absolute right-0 top-0 bottom-0 flex flex-col justify-center">
            <TouchableOpacity
              onPress={() => {
                const currentValue = Number(formikRef.current?.values.interval || "1");
                formikRef.current?.setFieldValue("interval", (currentValue + 1).toString());
              }}
              className="h-6 w-6 items-center justify-center"
              accessibilityLabel="Increase interval"
            >
              <MaterialIcons name="keyboard-arrow-up" size={18} color="#609084" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                const currentValue = Number(formikRef.current?.values.interval || "1");
                if (currentValue > 1) {
                  formikRef.current?.setFieldValue("interval", (currentValue - 1).toString());
                }
              }}
              className="h-6 w-6 items-center justify-center"
              accessibilityLabel="Decrease interval"
            >
              <MaterialIcons name="keyboard-arrow-down" size={18} color="#609084" />
            </TouchableOpacity>
          </View>
        </View>
        <Text className="text-sm font-semibold">
          {TEXT_TRANSLATE.FREQUENCY_LABEL[
            (formikRef.current?.values.frequencyType) as keyof typeof TEXT_TRANSLATE.FREQUENCY_LABEL
          ]}
        </Text>
      </View>
    </>
  ), []);

  const renderCategoryFilters = useCallback(() => (
    <View className="mx-3 my-2 flex-row items-center">
      <FlatList
        ref={state.flatListRef}
        horizontal
        data={state.uniqueCategories ?? []}
        keyExtractor={(item) => item.code}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }: { item: CategoryListFilter; index: number }) => (
          <TouchableOpacity
            className={`my-1 mr-2.5 rounded-lg px-3 py-1 ${
              item?.code === state.selectedCategoryCode
                ? `scale-105 bg-primary ${index === 0 && "ml-1"} text-white shadow-xl shadow-primary/40`
                : "border border-gray-200 bg-white text-gray-800 shadow-sm"
            } transition-all duration-300`}
            onPress={() => handler.handleSelectCategoryFilter(item?.code)}
          >
            <Text
              className={`text-xs ${item?.code === state.selectedCategoryCode ? "font-bold text-white" : "font-normal"} tracking-wide`}
            >
              {item?.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  ), [state.uniqueCategories, state.selectedCategoryCode, handler, state.flatListRef]);

  const renderSubcategoryList = useCallback(() => (
    <View className="mt-1 flex-row flex-wrap">
      {state.isLoadingSubCategories ? (
        <View className="h-44 w-full items-center justify-center">
          <ActivityIndicator size="small" color="#609084" />
        </View>
      ) : (
        state.subCategories?.data?.map((subCategory: Subcategory) => {
          return (
            <Pressable
              key={subCategory?.id}
              onPress={() => {
                handler.handleSelectSubcategory(subCategory?.id);
                formikRef.current?.setFieldValue("subcategoryId", subCategory?.id);
                formikRef.current?.setFieldValue("description", subCategory?.name);
              }}
              className="mb-3 w-1/3 px-1.5"
            >
              <CategoryItem
                label={subCategory?.name}
                color="#609084"
                iconName={
                  subCategory?.icon as keyof typeof MaterialIcons.glyphMap
                }
                isSelected={
                  state.selectedSubcategory === subCategory?.id
                }
                rootClassName="flex-1 justify-center min-h-[110px]"
              />
            </Pressable>
          );
        })
      )}
    </View>
  ), [state.isLoadingSubCategories, state.subCategories, state.selectedSubcategory, handler]);

  return (
    <SafeAreaViewCustom rootClassName="bg-[#f5f5f5] flex-1">
      {renderHeader()}
      <Formik
        innerRef={formikRef}
        initialValues={state.initialValues}
        validationSchema={state.validationSchema}
        onSubmit={handler.handleSubmit}
      >
        {({ errors, touched }) => (
          <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
            <SectionComponent rootClassName="mx-5 mt-8">
              <View className="flex-row items-center justify-between">
                {renderTransactionTypeButton(TRANSACTION_TYPE_TEXT.EXPENSE, TEXT_TRANSLATE.TRANSACTION_TYPE.EXPENSE)}
                {renderTransactionTypeButton(TRANSACTION_TYPE_TEXT.INCOME, TEXT_TRANSLATE.TRANSACTION_TYPE.INCOME)}
              </View>
            </SectionComponent>
            <SectionComponent rootClassName="bg-white m-4 p-2 rounded-lg">
              <Text className="text-base font-bold tracking-tight text-[#609084] mb-1">
                {TEXT_TRANSLATE.LABEL.SUBCATEGORY}
              </Text>
              {renderCategoryFilters()}
              {renderSubcategoryList()}
              {touched.subcategoryId && errors.subcategoryId && (
                <Text className="mt-1 text-red-500 text-xs">{errors.subcategoryId}</Text>
              )}
            </SectionComponent>
            <SectionComponent rootClassName="bg-white mx-4 mb-4 p-4 rounded-lg">
              <Text className="text-base font-bold tracking-tight text-[#609084]">
                {TEXT_TRANSLATE.LABEL.AMOUNT}
              </Text>
              <InputComponent
                name="amount"
                label=""
                placeholder={TEXT_TRANSLATE.PLACEHOLDER.ENTER_AMOUNT}
                inputMode="numeric"
                formatter={formatCurrencyInput}
              />
              <View className="flex-row flex-wrap gap-2">
                {[50000, 100000, 200000, 500000].map((amount) => (
                  <Pressable
                    key={amount}
                    onPress={() => formikRef.current?.setFieldValue("amount", formatCurrencyInput(amount.toString()))}
                    accessibilityLabel={`Select amount ${amount}`}
                    className="rounded-full bg-gray-100 px-3 py-1 m-1"
                  >
                    <Text className="text-xs text-gray-700">{formatCurrencyInput(amount.toString())}</Text>
                  </Pressable>
                ))}
              </View>
              <TextAreaComponent
                name="description"
                label={TEXT_TRANSLATE.LABEL.DESCRIPTION}
                placeholder={TEXT_TRANSLATE.PLACEHOLDER.ENTER_DESCRIPTION}
                isRequired
                containerClass="my-5"
                labelClass="text-sm text-gray-600"
                inputClass="text-sm text-gray-800"
              />
            </SectionComponent>
            <SectionComponent rootClassName="bg-white mx-4 p-4 rounded-lg">
              <Text className="text-base font-bold tracking-tight text-[#609084] mb-3">
                {TEXT_TRANSLATE.LABEL.FREQUENCY_TYPE}
              </Text>
              {renderFrequencyOptions()}
              <DatePickerRecurringTransaction
                name="startDate"
                label={TEXT_TRANSLATE.LABEL.START_DATE}
                labelClass="text-sm text-gray-600"
                isRequired
              />
            </SectionComponent>
            <SectionComponent rootClassName="bg-white m-4 p-4 rounded-lg">
              
              <SpaceComponent height={10} />
              <Text className="text-base font-bold tracking-tight text-[#609084] mb-1">
                {TEXT_TRANSLATE.LABEL.TAGS}
              </Text>
              <TagInputComponent 
                value={formikRef.current?.values.tags || ""}
                onChangeText={(text) => formikRef.current?.setFieldValue("tags", text)}
                placeholder={TEXT_TRANSLATE.PLACEHOLDER.ENTER_TAGS}
                containerClass="mb-0"
                suggestedTags={[
                  "Tiền thuê nhà", 
                  "Hóa đơn hàng tháng", 
                  "Lương", 
                  "Học phí",
                  "Tiền điện",
                  "Tiền nước",
                  "Tiết kiệm",
                  "Đầu tư",
                  "Bảo hiểm"
                ]}
              />
              <Text className="text-xs text-gray-500 mt-2">
                Sử dụng phím Enter hoặc dấu phẩy (,) để thêm nhiều tag
              </Text>
            </SectionComponent>
          </ScrollView>
        )}
      </Formik>
      <SectionComponent rootClassName="px-5 rounded-lg absolute bottom-5 w-full">
        <Pressable
          onPress={() => formikRef.current?.handleSubmit()}
          disabled={state.isLoading}
          accessibilityLabel="Save transaction"
          className={`h-12 items-center justify-center rounded-lg ${state.isLoading ? "bg-gray-400" : "bg-[#609084]"
            }`}
        >
          {state.isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text className="text-base font-semibold text-white">{TEXT_TRANSLATE.BUTTON.SAVE}</Text>
          )}
        </Pressable>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
};

export default RecurringTransactionForm;
