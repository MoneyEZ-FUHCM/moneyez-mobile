import {
  CategoryItem,
  DatePickerRecurringTransaction,
  InputComponent,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import TagInputComponent from "@/components/TagInputComponent";
import { TextAreaComponent } from "@/components/TextAreaComponent";
import { TRANSACTION_TYPE_TEXT } from "@/helpers/enums/globals";
import { Colors } from "@/helpers/constants/color";
import { formatCurrencyInput, formatIntervalInput } from "@/helpers/libs";
import { CategoryListFilter } from "@/helpers/types/category.types";
import { RecurringTransactionFormValues } from "@/helpers/types/recurringTransaction.types";
import { Subcategory } from "@/helpers/types/subCategory";
import { MaterialIcons } from "@expo/vector-icons";
import { Formik, FormikProps } from "formik";
import React, { useCallback, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RadioButton } from "react-native-paper";
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

  const renderHeader = useCallback(
    () => (
      <SectionComponent rootClassName="h-14 bg-white justify-center items-center relative">
        <View className="flex-row items-center px-4">
          <Pressable
            onPress={handler.handleBack}
            accessibilityLabel="Go back"
            className="absolute left-4"
          >
            <MaterialIcons name="arrow-back" size={24} />
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
    ),
    [handler.handleBack, state.isEditing],
  );

  const renderTransactionTypeButton = useCallback(
    (
      type: TRANSACTION_TYPE_TEXT.EXPENSE | TRANSACTION_TYPE_TEXT.INCOME,
      label: string,
    ) => (
      <Pressable
        onPress={() => handler.handleChangeTransactionType(type)}
        className={`flex h-16 flex-1 flex-row items-center rounded-lg border-[0.5px] bg-white p-4 ${
          state.transactionType === type ? "border-primary" : "border-gray-300"
        }`}
      >
        <RadioButton.Android
          value={type}
          status={state.transactionType === type ? "checked" : "unchecked"}
          onPress={() => handler.handleChangeTransactionType(type)}
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

  const renderFrequencyOptions = useCallback(
    () => (
      <>
        <View className="mb-2 flex-row flex-wrap justify-between gap-2">
          {[
            { value: 0, label: TEXT_TRANSLATE.FREQUENCY.DAILY },
            { value: 1, label: TEXT_TRANSLATE.FREQUENCY.WEEKLY },
            { value: 2, label: TEXT_TRANSLATE.FREQUENCY.MONTHLY },
            { value: 3, label: TEXT_TRANSLATE.FREQUENCY.YEARLY },
          ].map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => {
                formikRef.current?.setFieldValue("frequencyType", option.value);
              }}
              accessibilityLabel={`Frequency ${option.label}`}
              className={`m-1 w-[155px] rounded-lg px-4 py-2 ${
                formikRef.current?.values.frequencyType === option.value
                  ? "bg-primary"
                  : "bg-gray-100"
              }`}
            >
              <Text
                className={
                  formikRef.current?.values.frequencyType === option.value
                    ? "text-center font-bold text-white"
                    : "text-center text-gray-800"
                }
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mb-2 flex-row items-center">
          <Text className="mr-2 text-sm font-semibold">
            <Text className="font-medium text-red">*</Text>{" "}
            {TEXT_TRANSLATE.PLACEHOLDER.EVERY}
          </Text>
          <View className="relative mr-2 w-24">
            <InputComponent
              name="interval"
              inputMode="numeric"
              label=""
              inputClass="pr-6 text-center font-semibold"
              formatter={formatIntervalInput}
            />
            <View className="absolute bottom-0 right-0 top-0 flex flex-col justify-center">
              <TouchableOpacity
                onPress={() => {
                  const currentValue = Number(
                    formikRef.current?.values.interval,
                  );
                  formikRef.current?.setFieldValue(
                    "interval",
                    (currentValue + 1).toString(),
                  );
                }}
                className="h-6 w-6 items-center justify-center"
                accessibilityLabel="Increase interval"
              >
                <MaterialIcons
                  name="keyboard-arrow-up"
                  size={18}
                  color="#609084"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  const currentValue = Number(
                    formikRef.current?.values.interval,
                  );
                  if (currentValue > 1) {
                    formikRef.current?.setFieldValue(
                      "interval",
                      (currentValue - 1).toString(),
                    );
                  }
                }}
                className="h-6 w-6 items-center justify-center"
                accessibilityLabel="Decrease interval"
              >
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={18}
                  color="#609084"
                />
              </TouchableOpacity>
            </View>
          </View>
          <Text className="text-sm font-semibold">
            {
              TEXT_TRANSLATE.FREQUENCY_LABEL[
                formikRef.current?.values
                  .frequencyType as keyof typeof TEXT_TRANSLATE.FREQUENCY_LABEL
              ]
            }
          </Text>
        </View>
      </>
    ),
    [],
  );

  const renderCategoryFilters = useCallback(
    () => (
      <View className="mx-3 my-2 flex-row items-center">
        <FlatList
          ref={state.flatListRef}
          horizontal
          data={state.uniqueCategories ?? []}
          keyExtractor={(item) => item.code}
          showsHorizontalScrollIndicator={false}
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
    ),
    [
      state.uniqueCategories,
      state.selectedCategoryCode,
      handler,
      state.flatListRef,
    ],
  );

  const renderSubcategoryList = useCallback(
    () => (
      <View className="mt-1 flex-row flex-wrap">
        {state.isLoadingSubCategories ? (
          <View className="h-44 w-full items-center justify-center">
            <ActivityIndicator size="small" color={Colors.colors.primary} />
          </View>
        ) : (
          state.subCategories?.data?.map((subCategory: Subcategory) => {
            return (
              <Pressable
                key={subCategory?.id}
                onPress={() => {
                  handler.handleSelectSubcategory(subCategory?.id);
                  formikRef.current?.setFieldValue(
                    "subcategoryId",
                    subCategory?.id,
                  );
                  formikRef.current?.setFieldValue(
                    "description",
                    subCategory?.name,
                  );
                }}
                className="mb-3 w-1/3 px-1.5"
              >
                <CategoryItem
                  label={subCategory?.name}
                  color="#609084"
                  iconName={
                    subCategory?.icon as keyof typeof MaterialIcons.glyphMap
                  }
                  isSelected={state.selectedSubcategory === subCategory?.id}
                  rootClassName="flex-1 justify-center min-h-[110px]"
                />
              </Pressable>
            );
          })
        )}
      </View>
    ),
    [
      state.isLoadingSubCategories,
      state.subCategories,
      state.selectedSubcategory,
      handler,
    ],
  );

  return (
    <SafeAreaViewCustom rootClassName="bg-[#f5f5f5]">
      {renderHeader()}
      <Formik
        innerRef={formikRef}
        initialValues={state.initialValues}
        validationSchema={state.validationSchema}
        onSubmit={handler.handleSubmit}
      >
        {({ errors, touched }) => (
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
          >
            <SectionComponent rootClassName="mx-5 mt-8">
              <View className="flex flex-row items-center space-x-4">
                {renderTransactionTypeButton(
                  TRANSACTION_TYPE_TEXT.EXPENSE,
                  TEXT_TRANSLATE.TRANSACTION_TYPE.EXPENSE,
                )}
                {renderTransactionTypeButton(
                  TRANSACTION_TYPE_TEXT.INCOME,
                  TEXT_TRANSLATE.TRANSACTION_TYPE.INCOME,
                )}
              </View>
            </SectionComponent>
            <SectionComponent rootClassName="bg-white m-4 p-2 rounded-lg">
              <Text className="mb-1 text-lg font-bold tracking-tight text-primary">
                {TEXT_TRANSLATE.LABEL.SUBCATEGORY}
              </Text>
              {renderCategoryFilters()}
              {renderSubcategoryList()}
              {touched.subcategoryId && errors.subcategoryId && (
                <Text className="ml-3 text-[12px] text-red">
                  {errors.subcategoryId}
                </Text>
              )}
            </SectionComponent>
            <SectionComponent rootClassName="bg-white mx-4 mb-4 p-2 rounded-lg">
              <Text className="mb-3 text-lg font-bold text-primary">
                {TEXT_TRANSLATE.LABEL.INFO}
              </Text>
              <View className="px-2">
                <InputComponent
                  name="amount"
                  label="Số tiền"
                  isRequired
                  placeholder={TEXT_TRANSLATE.PLACEHOLDER.ENTER_AMOUNT}
                  inputMode="numeric"
                  labelClass="text-text-gray text-[12px] font-bold"
                  formatter={formatCurrencyInput}
                />
                <View className="flex-row flex-wrap gap-2">
                  {[50000, 100000, 200000, 500000].map((amount) => (
                    <Pressable
                      key={amount}
                      onPress={() =>
                        formikRef.current?.setFieldValue(
                          "amount",
                          formatCurrencyInput(amount.toString()),
                        )
                      }
                      accessibilityLabel={`Select amount ${amount}`}
                      className="rounded-full bg-thirdly px-3 py-0.5 text-primary"
                    >
                      <Text className="text-xs text-gray-700">
                        {formatCurrencyInput(amount.toString())}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                <TextAreaComponent
                  name="description"
                  label={TEXT_TRANSLATE.LABEL.DESCRIPTION}
                  placeholder={TEXT_TRANSLATE.PLACEHOLDER.ENTER_DESCRIPTION}
                  isRequired
                  containerClass="my-5"
                  labelClass="text-text-gray text-[12px] font-bold"
                  inputClass="text-sm text-gray-800"
                />
              </View>
            </SectionComponent>
            <SectionComponent rootClassName="bg-white mx-4 mb-4 p-2 rounded-lg">
              <Text className="mb-3 text-lg font-bold text-primary">
                {TEXT_TRANSLATE.LABEL.FREQUENCY_TYPE}
              </Text>
              <View className="p-2">
                {renderFrequencyOptions()}
                <DatePickerRecurringTransaction
                  name="startDate"
                  label={TEXT_TRANSLATE.LABEL.START_DATE}
                  labelClass="text-text-gray text-[12px] font-bold"
                  containerClass="mt-2"
                  isRequired
                />
              </View>
            </SectionComponent>
            <SectionComponent rootClassName="bg-white mx-4 mb-4 p-2 rounded-lg">
              <Text className="mb-3 text-lg font-bold text-primary">
                {TEXT_TRANSLATE.LABEL.TAGS}
              </Text>
              <View className="p-2">
                <TagInputComponent
                  value={formikRef.current?.values.tags || ""}
                  onChangeText={(text) =>
                    formikRef.current?.setFieldValue("tags", text)
                  }
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
                    "Bảo hiểm",
                  ]}
                />
                <Text className="mt-2 text-xs text-gray-500">
                  Sử dụng phím Enter hoặc dấu phẩy (,) để thêm nhiều tag
                </Text>
              </View>
            </SectionComponent>
          </ScrollView>
        )}
      </Formik>
      <SectionComponent rootClassName="px-4 rounded-lg absolute pb-5 bottom-0 w-full flex-1 bg-[#f5f5f5]">
        <Pressable
          onPress={() => formikRef.current?.handleSubmit()}
          disabled={state.isLoading}
          accessibilityLabel="Save transaction"
          className={`h-12 items-center justify-center rounded-lg ${
            state.isLoading ? "bg-gray-400" : "bg-[#609084]"
          }`}
        >
          {state.isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text className="text-base font-semibold text-white">
              {TEXT_TRANSLATE.BUTTON.SAVE}
            </Text>
          )}
        </Pressable>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
};

export default RecurringTransactionForm;
