import { TRANSACTION_TYPE } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { convertUTCToVietnamTime } from "@/helpers/libs";
import useHideTabbar from "@/hooks/useHideTabbar";
import useUploadImage from "@/hooks/useUploadImage";
import { setLoading } from "@/redux/slices/loadingSlice";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetSubCateQuery } from "@/services/subCategory";
import { useCreateTransactionMutation } from "@/services/transaction";
import { useGetCurrentUserSpendingModelQuery } from "@/services/userSpendingModel";
import { TransactionType } from "@/types/invidual.types";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ToastAndroid } from "react-native";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import TEXT_TRANSLATE_ADD_TRANSACTION from "../AddTransaction.translate";

const useAddTransaction = (type: string) => {
  const INCOME = "income";
  const EXPENSE = "expense";
  const pageSize = 6;
  const dispatch = useDispatch();
  const { MESSAGE_VALIDATE, MESSAGE_SUCCESS } = TEXT_TRANSLATE_ADD_TRANSACTION;
  const { HTTP_STATUS, SYSTEM_ERROR } = COMMON_CONSTANT;
  const { HOME } = PATH_NAME;
  const { data: currentUserSpendingModel } =
    useGetCurrentUserSpendingModelQuery();

  // state
  const [pageIndex, setPageIndex] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [transactionType, setTransactionType] = useState<TransactionType>(
    type === INCOME ? INCOME : EXPENSE,
  );
  const [date, setDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  );
  const [images, setImages] = useState<string[]>([]);

  // hooks
  const { imageUrl, pickAndUploadImage } = useUploadImage();
  const { data, isLoading } = useGetSubCateQuery({
    PageIndex: pageIndex,
    PageSize: pageSize,
  });
  const [createTransaction] = useCreateTransactionMutation();

  // derived state
  const totalCount = data?.totalCount || 0;

  // handlers
  const handleLoadMore = useCallback(() => {
    if (categories.length < totalCount && !isLoadingMore) {
      setIsLoadingMore(true);
      setPageIndex((prev) => prev + 1);
    }
  }, [categories.length, totalCount, isLoadingMore]);

  useEffect(() => {
    if (data?.items?.length) {
      setCategories((prev) => {
        const newItems = data.items.filter(
          (item: any) => !prev.some((existing) => existing.id === item.id),
        );
        return [...prev, ...newItems];
      });
      setIsLoadingMore(false);
    }
  }, [data?.items]);

  useEffect(() => {
    if (imageUrl && !images.includes(imageUrl)) {
      setImages((prev) => [...prev, imageUrl]);
    }
  }, [imageUrl, images]);

  const handleBack = useCallback(() => {
    router.back();
    dispatch(setMainTabHidden(false));
  }, [dispatch]);

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
        amount: payload.amount,
        description: payload.description,
        images: images,
        subcategoryId: selectedCategory,
        transactionDate: convertUTCToVietnamTime(payload.dob),
        type:
          transactionType === EXPENSE
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

  const handleNext = () => {
    if (currentUserSpendingModel) {
      const startDate = new Date(
        currentUserSpendingModel.data.startDate,
      ).toLocaleDateString("vi-VN");
      const endDate = new Date(
        currentUserSpendingModel.data.endDate,
      ).toLocaleDateString("vi-VN");

      router.push({
        pathname: HOME.PERIOD_HISTORY as any,
        params: {
          userSpendingId: currentUserSpendingModel.data.id,
          startDate: startDate,
          endDate: endDate,
        },
      });
    }
  };

  return {
    state: {
      transactionType,
      images,
      selectedCategory,
      date,
      initialValues,
      categories,
      totalCount,
      isLoading,
      isLoadingMore,
    },
    handler: {
      useHideTabbar,
      handleBack,
      setTransactionType,
      pickAndUploadImage,
      setSelectedCategory,
      setDate,
      handleCreateTransaction,
      validationSchema,
      handleLoadMore,
    },
  };
};

export default useAddTransaction;
