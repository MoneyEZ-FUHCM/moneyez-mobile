import { TRANSACTION_TYPE, TRANSACTION_TYPE_TEXT } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { convertUTCToVietnamTime, parseCurrency } from "@/helpers/libs";
import useHideTabbar from "@/hooks/useHideTabbar";
import useUploadImage from "@/hooks/useUploadImage";
import { setLoading } from "@/redux/slices/loadingSlice";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { selectCurrentUserSpendingModel } from "@/redux/slices/userSpendingModelSlice";
import { useCreateTransactionMutation } from "@/services/transaction";
import {
  useGetCurrentCategoriesQuery,
  useGetSubCategoriesQuery,
} from "@/services/userSpendingModel";
import { CategoryListFilter } from "@/types/category.types";
import { TransactionType } from "@/types/invidual.types";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, ToastAndroid } from "react-native";
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
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  );
  const [images, setImages] = useState<string[]>([]);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState("");
  const [uniqueCategories, setUniqueCategories] = useState<
    CategoryListFilter[]
  >([]);
  const flatListRef = useRef<FlatList>(null);
  const formikRef = useRef<any>(null);
  const handleSubmitRef = useRef<() => void>(() => {});

  const { imageUrl, pickAndUploadImage, deleteImage } = useUploadImage();
  const [createTransaction] = useCreateTransactionMutation();
  const { data: mapSubCategories, isLoading } = useGetSubCategoriesQuery({
    type: transactionType,
    code: selectedCategoryCode,
  });
  const { data: mapCategories } = useGetCurrentCategoriesQuery({});

  useHideTabbar();

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

  const handleCreateTransaction = useCallback(
    async (payload: any) => {
      if (!selectedCategory) {
        return ToastAndroid.show(
          MESSAGE_VALIDATE.SUBCATEGORY_REQUIRED,
          ToastAndroid.SHORT,
        );
      }

      dispatch(setLoading(true));
      const updatePayload = {
        amount: parseCurrency(payload?.amount),
        description: payload?.description,
        images,
        subcategoryId: selectedCategory,
        transactionDate: convertUTCToVietnamTime(payload?.dob),
        type:
          transactionType === TRANSACTION_TYPE_TEXT.EXPENSE
            ? TRANSACTION_TYPE.EXPENSE
            : TRANSACTION_TYPE.INCOME,
      };

      try {
        const res = await createTransaction(updatePayload).unwrap();
        if (res && res.status === HTTP_STATUS.SUCCESS.CREATED) {
          ToastAndroid.show(
            MESSAGE_SUCCESS.CREATE_TRANSACTION_SUCCESSFUL,
            ToastAndroid.CENTER,
          );
          handleNext();
        }
      } catch (err: any) {
        ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [selectedCategory, images, transactionType],
  );

  const handleDeleteImage = useCallback(
    async (url: string) => {
      await deleteImage(url);
      setImages((prev) => prev.filter((img) => img !== url));
    },
    [deleteImage, setImages],
  );

  const handleNext = () => {
    if (currentUserSpendingModel) {
      const startDate = new Date(
        currentUserSpendingModel?.startDate,
      ).toLocaleDateString("vi-VN");
      const endDate = new Date(
        currentUserSpendingModel?.endDate,
      ).toLocaleDateString("vi-VN");

      router.replace({
        pathname: HOME.PERIOD_HISTORY as any,
        params: {
          userSpendingId: currentUserSpendingModel?.id,
          startDate,
          endDate,
        },
      });
    }
  };

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        amount: Yup.string().required(MESSAGE_VALIDATE.MONEY_REQUIRED),
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

  return {
    state: {
      transactionType,
      images,
      selectedCategory,
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
      setSelectedCategory,
      handleCreateTransaction,
      handleSelectCategoryFilter,
      handleDeleteImage,
      validationSchema,
      handleSubmitRef,
    },
  };
};

export default useAddTransaction;
