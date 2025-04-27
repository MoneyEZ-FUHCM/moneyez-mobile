import {
  TRANSACTION_TYPE,
  TRANSACTION_TYPE_TEXT,
} from "@/helpers/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { convertUTCToVietnamTime, parseCurrency } from "@/helpers/libs";
import useUploadImage from "@/helpers/hooks/useUploadImage";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { setTransactionData } from "@/redux/slices/transactionSlice";
import { selectCurrentUserSpendingModel } from "@/redux/slices/userSpendingModelSlice";
import {
  useGetCurrentCategoriesQuery,
  useGetSubCategoriesQuery,
} from "@/services/userSpendingModel";
import { CategoryListFilter } from "@/helpers/types/category.types";
import { TransactionType } from "@/helpers/types/invidual.types";
import { Subcategory } from "@/helpers/types/subCategory";
import { TransactionPreviewPayload } from "@/helpers/types/transaction.types";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BackHandler, FlatList, ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import TEXT_TRANSLATE_ADD_TRANSACTION from "../AddTransaction.translate";

const useAddTransaction = (type: string) => {
  const dispatch = useDispatch();
  const { MESSAGE_VALIDATE, MESSAGE_SUCCESS } = TEXT_TRANSLATE_ADD_TRANSACTION;
  const { HTTP_STATUS, SYSTEM_ERROR, FILTER } = COMMON_CONSTANT;
  const { HOME } = PATH_NAME;

  const currentUserSpendingModel = useSelector(selectCurrentUserSpendingModel);

  const [transactionType, setTransactionType] = useState<TransactionType>(
    type === TRANSACTION_TYPE_TEXT.INCOME
      ? TRANSACTION_TYPE_TEXT.INCOME
      : TRANSACTION_TYPE_TEXT.EXPENSE,
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<
    string | undefined
  >(undefined);
  const [images, setImages] = useState<string[]>([]);
  const [uniqueCategories, setUniqueCategories] = useState<
    CategoryListFilter[]
  >([]);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const formikRef = useRef<any>(null);
  const handleSubmitRef = useRef<() => void>(() => {});

  const { imageUrl, pickAndUploadImage, deleteImage } = useUploadImage();
  const { data: mapSubCategories, isLoading } = useGetSubCategoriesQuery({
    type: transactionType,
    code: selectedCategoryCode,
  });
  const { data: mapCategories } = useGetCurrentCategoriesQuery({});

  const selectedSubCategoryData = mapSubCategories?.data?.find(
    (subCategory: Subcategory) => subCategory.id === selectedSubCategory,
  );

  const subCategoryName = selectedSubCategoryData?.name || "";
  const subCategoryIcon = selectedSubCategoryData?.icon || "";

  useFocusEffect(
    useCallback(() => {
      dispatch(setMainTabHidden(true));
    }, [dispatch]),
  );

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
  }, [mapCategories?.data, transactionType]);

  useEffect(() => {
    if (imageUrl) {
      setImages((prev) => {
        if (!prev.includes(imageUrl)) {
          return [...prev, imageUrl];
        }
        return prev;
      });
    }
  }, [imageUrl]);

  useFocusEffect(
    useCallback(() => {
      dispatch(setMainTabHidden(true));
    }, [dispatch]),
  );

  const handleSelectCategoryFilter = useCallback((categoryCode: string) => {
    setSelectedCategoryCode(categoryCode);
  }, []);

  const handleBack = useCallback(() => {
    router.back();
    dispatch(setMainTabHidden(false));
  }, [dispatch]);

  const handlePreviewTransaction = useCallback(
    async (payload: any) => {
      if (!selectedSubCategory) {
        return ToastAndroid.show(
          MESSAGE_VALIDATE.SUBCATEGORY_REQUIRED,
          ToastAndroid.SHORT,
        );
      }
      const updatePayload: TransactionPreviewPayload = {
        amount: parseCurrency(payload?.amount),
        description: payload?.description || "",
        images: images || [],
        subcategoryId: selectedSubCategory,
        subCategoryName: subCategoryName,
        subCategoryIcon: subCategoryIcon,
        transactionDate: convertUTCToVietnamTime(payload?.dob).toISOString(),
        type:
          transactionType === TRANSACTION_TYPE_TEXT.EXPENSE
            ? TRANSACTION_TYPE.EXPENSE
            : TRANSACTION_TYPE.INCOME,
      };

      dispatch(setTransactionData(updatePayload));

      router.navigate({
        pathname: HOME.TRANSACTION_DETAIL as any,
      });
    },
    [selectedSubCategory, images, transactionType],
  );

  const handleDeleteImage = useCallback(
    async (url: string) => {
      await deleteImage(url);
      setImages((prev) => prev.filter((img) => img !== url));
    },
    [deleteImage, setImages],
  );

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        amount: Yup.string()
          .required(MESSAGE_VALIDATE.MONEY_REQUIRED)
          .test("min-amount", "Giá trị thấp nhất là 10.000đ", function (value) {
            if (!value) return true;
            const numericValue = Number(value.replace(/\./g, ""));
            return numericValue >= 10000;
          }),
        dob: Yup.string().required(MESSAGE_VALIDATE.DATE_REQUIRED),
        description: Yup.string().required(
          MESSAGE_VALIDATE.DESCRIPTION_REQUIRED,
        ),
      }),
    [MESSAGE_VALIDATE],
  );

  const initialValues = useMemo(
    () => ({ amount: "", description: "", dob: "" }),
    [],
  );

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleBack();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [handleBack]),
  );

  return {
    state: {
      transactionType,
      images,
      selectedSubCategory,
      initialValues,
      mapSubCategories: mapSubCategories?.data,
      uniqueCategories,
      isLoading,
      selectedCategoryCode,
      flatListRef,
      formikRef,
      currentUserSpendingModel,
    },
    handler: {
      handleBack,
      setTransactionType,
      pickAndUploadImage,
      deleteImage,
      setSelectedSubCategory,
      handlePreviewTransaction,
      handleSelectCategoryFilter,
      handleDeleteImage,
      validationSchema,
      handleSubmitRef,
    },
  };
};

export default useAddTransaction;
