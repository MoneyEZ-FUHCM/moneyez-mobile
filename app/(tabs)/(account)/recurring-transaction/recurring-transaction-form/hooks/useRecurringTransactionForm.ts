import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, ToastAndroid } from "react-native";
import * as Yup from "yup";

import { TRANSACTION_TYPE, TRANSACTION_TYPE_TEXT } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { parseCurrency } from "@/helpers/libs";
import useHideTabbar from "@/hooks/useHideTabbar";
import {
  useCreateRecurringTransactionMutation,
  useGetRecurringTransactionByIdQuery,
  useUpdateRecurringTransactionMutation
} from "@/services/recurringTransaction";
import { useGetCurrentCategoriesQuery, useGetSubCategoriesQuery } from "@/services/userSpendingModel";
import { CategoryListFilter } from "@/types/category.types";
import { RecurringTransactionFormValues, RecurringTransactionPayload } from "@/types/recurringTransaction.types";
import { Subcategory } from "@/types/subCategory";
import TEXT_TRANSLATE from "../RecurringTransactionForm.translate";

const useRecurringTransactionForm = () => {
  const { id } = useLocalSearchParams();
  const { FILTER } = COMMON_CONSTANT;
  useHideTabbar()
  // State for subcategory selection
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [subcategoryName, setSubcategoryName] = useState<string>("");
  const [subcategoryIcon, setSubcategoryIcon] = useState<string>("");

  // State for transaction type and category filtering
  const [transactionType, setTransactionType] = useState<string>(TRANSACTION_TYPE_TEXT.EXPENSE);
  const [uniqueCategories, setUniqueCategories] = useState<CategoryListFilter[]>([]);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const formikRef = useRef<any>(null);

  // API calls
  const [createRecurringTransaction, { isLoading: isCreating }] = useCreateRecurringTransactionMutation();
  const [updateRecurringTransaction, { isLoading: isUpdating }] = useUpdateRecurringTransactionMutation();

  // Get subcategories based on transaction type and selected category code
  const { data: subCategories, isLoading: isLoadingSubCategories } = useGetSubCategoriesQuery({
    type: transactionType,
    code: selectedCategoryCode,
  });

  // Get categories for the filter
  const { data: mapCategories } = useGetCurrentCategoriesQuery({});

  // Get transaction data for editing
  const { data: transactionData, isLoading: isLoadingTransaction } = useGetRecurringTransactionByIdQuery(
    { id: id as string },
    { skip: !id }
  );

  // Set up unique categories for filtering
  useEffect(() => {
    if (mapCategories?.data) {
      const newCategories = Array.from(
        new Set(
          mapCategories.data?.map((item: CategoryListFilter) =>
            JSON.stringify({
              name: item?.name,
              code: item?.code,
              type: item?.type,
            }),
          ),
        ),
      )
        .map((str) => JSON.parse(str as string))
        .filter((item) => item.type === transactionType);

      setUniqueCategories([
        { name: FILTER.FILTER_ALL_LABEL, code: "" },
        ...newCategories,
      ]);
      setSelectedCategoryCode("");
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [mapCategories?.data, transactionType, FILTER.FILTER_ALL_LABEL]);

  // Set transaction type when editing
  useEffect(() => {
    if (id && transactionData?.data) {
      const subcategoryType = transactionData.data.type === TRANSACTION_TYPE.INCOME
        ? TRANSACTION_TYPE_TEXT.INCOME
        : TRANSACTION_TYPE_TEXT.EXPENSE;
      setTransactionType(subcategoryType);
    }
  }, [id, transactionData]);

  useEffect(() => {
    if (selectedSubcategory && subCategories?.data) {
      const subcategory = subCategories.data.find(
        (item: Subcategory) => item.id === selectedSubcategory
      );

      if (subcategory) {
        setSubcategoryName(subcategory.name);
        setSubcategoryIcon(subcategory.icon);
      }
    }
  }, [selectedSubcategory, subCategories]);

  const isEditing = !!id;
  const isLoading = isLoadingSubCategories || isLoadingTransaction || isCreating || isUpdating;

  const initialValues: RecurringTransactionFormValues = {
    subcategoryId: "",
    amount: "",
    frequencyType: 2,
    interval: "1",
    startDate: new Date(),
    description: "",
    tags: "",
  };

  const validationSchema = Yup.object().shape({
    subcategoryId: Yup.string().required(TEXT_TRANSLATE.VALIDATION.REQUIRED_SUBCATEGORY),
    amount: Yup.string()
      .required(TEXT_TRANSLATE.VALIDATION.REQUIRED_AMOUNT)
      .test("valid-amount", TEXT_TRANSLATE.VALIDATION.INVALID_AMOUNT, (value) => {
        if (!value) return false;
        const numericValue = parseCurrency(value);
        return numericValue > 0;
      }),
    frequencyType: Yup.number().required(TEXT_TRANSLATE.VALIDATION.REQUIRED_FREQUENCY_TYPE),
    interval: Yup.string()
      .required(TEXT_TRANSLATE.VALIDATION.REQUIRED_INTERVAL)
      .test("valid-interval", TEXT_TRANSLATE.VALIDATION.INVALID_INTERVAL, (value) => {
        if (!value) return false;
        const numericValue = parseInt(value, 10);
        return numericValue > 0;
      }),
    startDate: Yup.date().required(TEXT_TRANSLATE.VALIDATION.REQUIRED_START_DATE),
  });

  // Callbacks
  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleSelectSubcategory = useCallback((subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
  }, []);

  const handleSelectCategoryFilter = useCallback((categoryCode: string) => {
    setSelectedCategoryCode(categoryCode);
  }, []);

  const handleChangeTransactionType = useCallback((type: string) => {
    setTransactionType(type);
    setSelectedSubcategory("");
  }, []);

  const handleSubmit = useCallback(
    async (values: RecurringTransactionFormValues) => {
      try {
        const payload: RecurringTransactionPayload = {
          id: isEditing ? (id as string) : undefined,
          subcategoryId: values.subcategoryId,
          amount: parseCurrency(values.amount),
          frequencyType: values.frequencyType,
          interval: parseInt(values.interval, 10),
          startDate: values.startDate.toISOString(),
          description: values.description,
          tags: values.tags,
        };

        let response;
        if (isEditing) {
          response = await updateRecurringTransaction(payload).unwrap();
        } else {
          response = await createRecurringTransaction(payload).unwrap();
        }

        if (response.status === 200) {
          ToastAndroid.show(
            isEditing
              ? TEXT_TRANSLATE.MESSAGE.SUCCESS_UPDATE
              : TEXT_TRANSLATE.MESSAGE.SUCCESS_CREATE,
            ToastAndroid.SHORT
          );
          router.back();
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        ToastAndroid.show(TEXT_TRANSLATE.MESSAGE.ERROR, ToastAndroid.SHORT);
      }
    },
    [createRecurringTransaction, updateRecurringTransaction, isEditing, id]
  );

  return {
    state: {
      id,
      isEditing,
      initialValues,
      validationSchema,
      transactionData,
      subCategories,
      selectedSubcategory,
      isLoading,
      isLoadingSubCategories,
      transactionType,
      uniqueCategories,
      selectedCategoryCode,
      flatListRef,
      formikRef
    },
    handler: {
      handleBack,
      handleSubmit,
      handleSelectSubcategory,
      handleSelectCategoryFilter,
      handleChangeTransactionType,
    }
  };
};

export default useRecurringTransactionForm;