import useHideTabbar from "@/hooks/useHideTabbar";
import useUploadImage from "@/hooks/useUploadImage";
import { setHiddenTabbar } from "@/redux/slices/tabSlice";
import { TransactionType } from "@/types/invidual.types";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import TEXT_TRANSLATE_ADD_TRANSACTION from "../AddTransaction.translate";

const useAddTransaction = (type: string) => {
  const dispatch = useDispatch();
  const { MESSAGE_VALIDATE } = TEXT_TRANSLATE_ADD_TRANSACTION;

  const validationSchema = Yup.object().shape({
    amount: Yup.string().required(MESSAGE_VALIDATE.MONEY_REQUIRED),
    dob: Yup.string().required(MESSAGE_VALIDATE.DATE_REQUIRED),
    description: Yup.string().required(MESSAGE_VALIDATE.DESCRIPTION_REQUIRED),
  });

  const initialValues = {
    amount: "",
    description: "",
    dob: "",
  };

  const [transactionType, setTransactionType] = useState<TransactionType>(
    type === "income" ? "income" : "expense",
  );
  const [date, setDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState("Tiền ăn");
  const { pickAndUploadImage, imageUrl } = useUploadImage();
  const [images, setImages] = useState<string[]>([]);

  const handleBack = useCallback(() => {
    router.back();
    dispatch(setHiddenTabbar(false));
  }, [dispatch]);

  const handleImageUpload = useCallback(() => {
    if (imageUrl) {
      setImages((prev) => [...prev, imageUrl]);
    }
  }, [imageUrl]);

  useEffect(() => {
    handleImageUpload();
  }, [imageUrl, handleImageUpload]);

  const handleCreateTransaction = useCallback(
    (payload: any) => {
      const updatePayload = { ...payload, selectedCategory, images };
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
    },
  };
};

export default useAddTransaction;
