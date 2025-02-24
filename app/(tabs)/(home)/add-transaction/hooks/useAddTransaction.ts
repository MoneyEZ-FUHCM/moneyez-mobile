import useHideTabbar from "@/hooks/useHideTabbar";
import useUploadImage from "@/hooks/useUploadImage";
import { setHiddenTabbar } from "@/redux/slices/tabSlice";
import { useGetSubCateQuery } from "@/services/subCategory";
import { TransactionType } from "@/types/invidual.types";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ToastAndroid } from "react-native";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import TEXT_TRANSLATE_ADD_TRANSACTION from "../AddTransaction.translate";

const useAddTransaction = (type: string) => {
  const dispatch = useDispatch();
  const { MESSAGE_VALIDATE } = TEXT_TRANSLATE_ADD_TRANSACTION;

  const pageSize = 6;
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const [transactionType, setTransactionType] = useState<TransactionType>(
    type === "income" ? "income" : "expense",
  );
  const [date, setDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id);

  const { pickAndUploadImage, imageUrl } = useUploadImage();
  const [images, setImages] = useState<string[]>([]);

  const { data, isLoading } = useGetSubCateQuery({
    PageIndex: pageIndex,
    PageSize: pageSize,
  });

  const totalCount = data?.totalCount || 0;

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
    () => ({
      amount: "",
      description: "",
      dob: "",
    }),
    [],
  );

  const handleBack = useCallback(() => {
    router.back();
    dispatch(setHiddenTabbar(false));
  }, [dispatch]);

  useEffect(() => {
    if (imageUrl && !images.includes(imageUrl)) {
      setImages((prev) => [...prev, imageUrl]);
    }
  }, [imageUrl, images]);

  const handleCreateTransaction = useCallback(
    (payload: any) => {
      if (!selectedCategory) {
        ToastAndroid.show(
          MESSAGE_VALIDATE.SUBCATEGORY_REQUIRED,
          ToastAndroid.SHORT,
        );
      }

      const updatePayload = {
        ...payload,
        subcategoryId: selectedCategory,
        images,
        transactionDate: payload.dob,
        approvalRequired: true,
      };
      console.log("check updatePayload", updatePayload);
    },
    [selectedCategory, images],
  );

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
