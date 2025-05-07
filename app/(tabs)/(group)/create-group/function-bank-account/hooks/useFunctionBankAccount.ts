import { COMMON_CONSTANT } from "@/helpers/constants/common";
import {
  BankAccountType,
  BankType,
  CreateBankAccountPayload,
} from "@/helpers/types/bankAccount.types";
import { setLoading } from "@/redux/slices/loadingSlice";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import {
  useCreateBankAccountMutation,
  useUpdateBankAccountMutation,
} from "@/services/bankAccounts";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, ToastAndroid } from "react-native";
import { Modalize } from "react-native-modalize";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import FUNCTION_BANK_ACCOUNT_CONSTANT from "../FunctionBankAccount.constant";
import TEXT_TRANSLATE_FUNCTION_BANK_ACCOUNT from "../FunctionBankAccount.translate";

const useFunctionBankAccount = (params: any) => {
  const [selectedBank, setSelectedBank] = useState(null);
  const [searchText, setSearchText] = useState<string>("");
  const [isAtTop, setIsAtTop] = useState(true);

  const bankSelectModalRef = useRef<Modalize>(null);
  const scrollRef = useRef<ScrollView>(null);
  const formikRef = useRef<any>(null);
  const handleSubmitRef = useRef<() => void>(() => {});
  const modalizeRef = useRef<Modalize>(null);

  const openRulesModal = () => {
    modalizeRef.current?.open();
  };
  const { SYSTEM_ERROR, HTTP_STATUS } = COMMON_CONSTANT;
  const { BANK_LIST, ERROR_CODE, FORM_NAME } = FUNCTION_BANK_ACCOUNT_CONSTANT;
  const { MESSAGE_ERROR, MESSAGE_SUCCESS } =
    TEXT_TRANSLATE_FUNCTION_BANK_ACCOUNT;
  const dispatch = useDispatch();
  const editMode = params?.editMode === "true";
  const bankAccountData: BankAccountType = params?.bankAccount
    ? JSON.parse(params.bankAccount)
    : null;

  const [createBankAccount] = useCreateBankAccountMutation();
  const [updateBankAccount] = useUpdateBankAccountMutation();

  useFocusEffect(
    useCallback(() => {
      dispatch(setMainTabHidden(true));
    }, [dispatch]),
  );

  useEffect(() => {
    if (editMode && bankAccountData && formikRef.current) {
      const matchingBank = BANK_LIST.find(
        (bank) => bank.shortName === bankAccountData.bankShortName,
      );

      if (matchingBank) {
        setSelectedBank(matchingBank as any);
        formikRef.current.setValues({
          accountNumber: bankAccountData.accountNumber,
          bankName: bankAccountData.bankName,
          bankShortName: bankAccountData.bankShortName,
          accountHolderName: bankAccountData.accountHolderName,
        });
      }
    }
  }, []);

  const validationSchema = Yup.object().shape({
    accountNumber: Yup.string()
      .min(5, "Số tài khoản phải có ít nhất 5 số")
      .max(50, "Số tài khoản không được quá 50 số")
      .required("Số tài khoản là bắt buộc"),
    bankName: Yup.string().required("Vui lòng chọn ngân hàng"),
    accountHolderName: Yup.string().required("Tên chủ tài khoản là bắt buộc"),
    bankShortName: Yup.string().required("Vui lòng chọn ngân hàng"),
  });

  const handleScroll = (event: any) => {
    setIsAtTop(event.nativeEvent.contentOffset.y <= 0);
  };

  const handleOpenBankSelect = useCallback(() => {
    setSearchText("");
    bankSelectModalRef.current?.open();
  }, []);

  const handleCloseModal = () => {
    if (isAtTop) {
      bankSelectModalRef.current?.close();
    }
  };

  const handleSelectBank = (
    bank: BankType,
    setFieldValue: (field: string, value: any) => void,
  ) => {
    setSelectedBank(bank as any);
    setFieldValue("bankName", bank.name);
    setFieldValue("bankShortName", bank.shortName);
    bankSelectModalRef.current?.close();
  };

  const handleCreateBankAccount = useCallback(
    async (payload: CreateBankAccountPayload) => {
      dispatch(setLoading(true));
      const updatePayload = {
        ...payload,
        accountHolderName: payload.accountHolderName.toUpperCase(),
      };
      try {
        const res = await createBankAccount(updatePayload).unwrap();
        if (res?.status === HTTP_STATUS.SUCCESS.CREATED) {
          ToastAndroid.show(
            MESSAGE_SUCCESS.ADD_BANK_ACCOUNT_SUCCESS,
            ToastAndroid.SHORT,
          );
          router.back();
        }
      } catch (err: any) {
        const error = err?.data;
        if (error?.errorCode === ERROR_CODE.BANK_ACCOUNT_NOT_FOUND) {
          ToastAndroid.show(
            MESSAGE_ERROR.BANK_ACCOUNT_NOT_FOUND,
            ToastAndroid.SHORT,
          );
          return;
        }
        if (error?.errorCode === ERROR_CODE.BANK_ACCOUNT_VALIDATION_FAILED) {
          ToastAndroid.show(
            MESSAGE_ERROR.BANK_ACCOUNT_VALIDATION_FAILED,
            ToastAndroid.SHORT,
          );
          return;
        }
        ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [],
  );

  const handleSubmit = useCallback(
    async (values: any) => {
      const payload = { ...values, id: bankAccountData?.id };
      try {
        if (editMode && bankAccountData) {
          const res = await updateBankAccount(payload).unwrap();
          if (res?.status === HTTP_STATUS.SUCCESS.OK) {
            ToastAndroid.show(
              MESSAGE_SUCCESS.UPDATE_BANK_ACCOUNT_SUCCESS,
              ToastAndroid.SHORT,
            );
            router.back();
          }
        } else {
          await handleCreateBankAccount(values);
        }
      } catch (err: any) {
        const error = err?.data;
        if (error?.errorCode === ERROR_CODE.BANK_ACCOUNT_NOT_FOUND) {
          ToastAndroid.show(
            MESSAGE_ERROR.BANK_ACCOUNT_NOT_FOUND,
            ToastAndroid.SHORT,
          );
          return;
        }
        if (error?.errorCode === ERROR_CODE.BANK_ACCOUNT_VALIDATION_FAILED) {
          ToastAndroid.show(
            MESSAGE_ERROR.BANK_ACCOUNT_VALIDATION_FAILED,
            ToastAndroid.SHORT,
          );
          return;
        }
        ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
      }
    },
    [editMode, bankAccountData],
  );

  const filteredBanks = BANK_LIST.filter(
    (bank) =>
      bank.name.toLowerCase().includes(searchText.toLowerCase()) ||
      bank.shortName.toLowerCase().includes(searchText.toLowerCase()),
  );

  return {
    state: {
      selectedBank,
      searchText,
      isAtTop,
      filteredBanks,
      bankSelectModalRef,
      scrollRef,
      formikRef,
      BANK_LIST,
      editMode,
      FORM_NAME,
      modalizeRef,
    },
    handler: {
      handleScroll,
      handleOpenBankSelect,
      handleCloseModal,
      handleSelectBank,
      handleSubmit,
      handleSubmitRef,
      setSearchText,
      validationSchema,
      openRulesModal,
    },
  };
};

export default useFunctionBankAccount;
