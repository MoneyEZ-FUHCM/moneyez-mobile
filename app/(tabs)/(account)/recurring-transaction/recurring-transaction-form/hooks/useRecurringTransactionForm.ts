import { TRANSACTION_TYPE, TRANSACTION_TYPE_TEXT } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { parseCurrency } from "@/helpers/libs";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import {
  useCreateRecurringTransactionMutation,
  useGetRecurringTransactionByIdQuery,
  useUpdateRecurringTransactionMutation,
} from "@/services/recurringTransaction";
import {
  useGetCurrentCategoriesQuery,
  useGetSubCategoriesQuery,
} from "@/services/userSpendingModel";
import { CategoryListFilter } from "@/types/category.types";
import {
  RecurringTransactionFormValues,
  RecurringTransactionPayload,
} from "@/types/recurringTransaction.types";
import { Subcategory } from "@/types/subCategory";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, ToastAndroid } from "react-native";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import TEXT_TRANSLATE from "../RecurringTransactionForm.translate";

const useRecurringTransactionForm = () => {
  const { id } = useLocalSearchParams();
  const { FILTER, HTTP_STATUS } = COMMON_CONSTANT;
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      dispatch(setMainTabHidden(true));
    }, [dispatch]),
  );

  // State for subcategory selection
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [subcategoryName, setSubcategoryName] = useState<string>("");
  const [subcategoryIcon, setSubcategoryIcon] = useState<string>("");

  // State for transaction type and category filtering
  const [transactionType, setTransactionType] = useState<string>(
    TRANSACTION_TYPE_TEXT.EXPENSE,
  );
  const [uniqueCategories, setUniqueCategories] = useState<
    CategoryListFilter[]
  >([]);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const formikRef = useRef<any>(null);

  // API calls
  const [createRecurringTransaction, { isLoading: isCreating }] =
    useCreateRecurringTransactionMutation();
  const [updateRecurringTransaction, { isLoading: isUpdating }] =
    useUpdateRecurringTransactionMutation();

  // Get subcategories based on transaction type and selected category code
  const { data: subCategories, isLoading: isLoadingSubCategories } =
    useGetSubCategoriesQuery({
      type: transactionType,
      code: selectedCategoryCode,
    });

  // Get categories for the filter
  const { data: mapCategories } = useGetCurrentCategoriesQuery({});

  // Get transaction data for editing
  const { data: transactionData, isLoading: isLoadingTransaction } =
    useGetRecurringTransactionByIdQuery({ id: id as string }, { skip: !id });

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
      const subcategoryType =
        transactionData.data.type === TRANSACTION_TYPE.INCOME
          ? TRANSACTION_TYPE_TEXT.INCOME
          : TRANSACTION_TYPE_TEXT.EXPENSE;
      setTransactionType(subcategoryType);
    }
  }, [id, transactionData]);

  useEffect(() => {
    if (selectedSubcategory && subCategories?.data) {
      const subcategory = subCategories.data.find(
        (item: Subcategory) => item.id === selectedSubcategory,
      );

      if (subcategory) {
        setSubcategoryName(subcategory.name);
        setSubcategoryIcon(subcategory.icon);
      }
    }
  }, [selectedSubcategory, subCategories]);

  const isEditing = !!id;
  const isLoading =
    isLoadingSubCategories || isLoadingTransaction || isCreating || isUpdating;

  const initialValues: RecurringTransactionFormValues = {
    subcategoryId: "",
    amount: "",
    frequencyType: 2,
    interval: "",
    startDate: new Date(),
    description: "",
    tags: "",
  };

  const validationSchema = Yup.object().shape({
    subcategoryId: Yup.string().required(
      TEXT_TRANSLATE.VALIDATION.REQUIRED_SUBCATEGORY,
    ),
    amount: Yup.string()
      .required(TEXT_TRANSLATE.VALIDATION.REQUIRED_AMOUNT)
      .test("min-amount", "Giá trị thấp nhất là 10.000đ", function (value) {
        if (!value) return true;
        const numericValue = Number(value.replace(/\./g, ""));
        return numericValue >= 10000;
      }),
    frequencyType: Yup.number().required(
      TEXT_TRANSLATE.VALIDATION.REQUIRED_FREQUENCY_TYPE,
    ),
    interval: Yup.number()
      .required("Bắt buộc")
      .transform((value, originalValue) => {
        return originalValue === "" ? 1 : value;
      })
      .min(1, "Tối thiểu là 1")
      .when("frequencyType", {
        is: 0,
        then: (schema) => schema.max(31, "Tối đa 31 ngày"),
      })
      .when("frequencyType", {
        is: 1,
        then: (schema) => schema.max(8, "Tối đa 8 tuần"),
      })
      .when("frequencyType", {
        is: 2,
        then: (schema) => schema.max(11, "Tối đa 11 tháng"),
      })
      .when("frequencyType", {
        is: 3,
        then: (schema) => schema.max(4, "Tối đa 4 năm"),
      }),
    startDate: Yup.date().required(
      TEXT_TRANSLATE.VALIDATION.REQUIRED_START_DATE,
    ),
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

        console.log("check payload", payload);

        let response;
        if (isEditing) {
          response = await updateRecurringTransaction(payload).unwrap();
        } else {
          response = await createRecurringTransaction(payload).unwrap();
        }

        if (
          response.status === HTTP_STATUS.SUCCESS.OK ||
          response.status === HTTP_STATUS.SUCCESS.CREATED
        ) {
          ToastAndroid.show(
            isEditing
              ? TEXT_TRANSLATE.MESSAGE.SUCCESS_UPDATE
              : TEXT_TRANSLATE.MESSAGE.SUCCESS_CREATE,
            ToastAndroid.SHORT,
          );
          router.back();
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        ToastAndroid.show(TEXT_TRANSLATE.MESSAGE.ERROR, ToastAndroid.SHORT);
      }
    },
    [createRecurringTransaction, updateRecurringTransaction, isEditing, id],
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
      formikRef,
    },
    handler: {
      handleBack,
      handleSubmit,
      handleSelectSubcategory,
      handleSelectCategoryFilter,
      handleChangeTransactionType,
    },
  };
};

export default useRecurringTransactionForm;
