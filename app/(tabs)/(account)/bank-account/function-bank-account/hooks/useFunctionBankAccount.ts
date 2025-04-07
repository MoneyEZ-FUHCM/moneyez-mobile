import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { setLoading } from "@/redux/slices/loadingSlice";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { setOtpCode } from "@/redux/slices/systemSlice";
import {
  useCreateBankAccountMutation,
  useUpdateBankAccountMutation,
} from "@/services/bankAccounts";
import {
  BankAccountType,
  BankType,
  CreateBankAccountPayload,
} from "@/types/bankAccount.types";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, ToastAndroid } from "react-native";
import { Modalize } from "react-native-modalize";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import FUNCTION_BANK_ACCOUNT_CONSTANT from "../FunctionBankAccount.constant";
import TEXT_TRANSLATE_FUNCTION_BANK_ACCOUNT from "../FunctionBankAccount.translate";
import { selectOtpCode } from "@/redux/hooks/systemSelector";

const useFunctionBankAccount = (params: any) => {
  const [selectedBank, setSelectedBank] = useState(null);
  const [searchText, setSearchText] = useState<string>("");
  const [isAtTop, setIsAtTop] = useState(true);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [currentValues, setCurrentValues] = useState<any>(null);

  const bankSelectModalRef = useRef<Modalize>(null);
  const scrollRef = useRef<ScrollView>(null);
  const formikRef = useRef<any>(null);
  const handleSubmitRef = useRef<() => void>(() => {});
  const ruleModalRef = useRef<Modalize>(null);
  const otpModalRef = useRef<Modalize>(null);

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
  const otpCode = useSelector(selectOtpCode);

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
      .length(12, "Số tài khoản phải có đúng 12 số")
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
      try {
        const res = await createBankAccount(payload).unwrap();
        if (res?.status === HTTP_STATUS.SUCCESS.CREATED) {
          ToastAndroid.show(
            MESSAGE_SUCCESS.ADD_BANK_ACCOUNT_SUCCESS,
            ToastAndroid.SHORT,
          );
          router.back();
        }
      } catch (err: any) {
        const error = err?.data;
        if (error?.errorCode === ERROR_CODE.BANK_ACCOUNT_VALIDATION_FAILED) {
          ToastAndroid.show(
            TEXT_TRANSLATE_FUNCTION_BANK_ACCOUNT.MESSAGE_ERROR
              .BANK_ACCOUNT_VALIDATION_FAILED,
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

  const handleSubmit = useCallback(async (values: any) => {
    console.log("chec values", values);
    setCurrentValues(values);
    ruleModalRef.current?.open();
    setShowRuleModal(true);
  }, []);

  const handleAcceptRules = useCallback(async () => {
    ruleModalRef.current?.close();
    setShowRuleModal(false);
    otpModalRef.current?.open();
    setShowOtpModal(true);

    // Send OTP request
    try {
      // await resentOtp(JSON.stringify({ email })).unwrap();
    } catch (err) {
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    }
  }, []);

  const handleVerifyOtp = useCallback(async () => {
    if (otpCode.length !== 5 || !/^[0-9]+$/.test(otpCode)) {
      ToastAndroid.show("OTP phải có đúng 5 số", ToastAndroid.SHORT);
      return;
    }

    // Verify OTP first
    try {
      // const payload = { email, otpCode };
      // const res = await verify(JSON.stringify(payload)).unwrap();
      // if (res?.status === HTTP_STATUS.SUCCESS.OK) {
      //   // OTP valid, proceed with bank account creation
      //   otpModalRef.current?.close();
      //   setShowOtpModal(false);
      //   await handleCreateBankAccount(currentValues);
      // }
    } catch (err) {
      ToastAndroid.show("OTP không hợp lệ", ToastAndroid.SHORT);
    }
  }, [otpCode, currentValues]);

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
      showRuleModal,
      showOtpModal,
      ruleModalRef,
      otpModalRef,
      otpCode,
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
      handleAcceptRules,
      handleVerifyOtp,
      setOtpCode: (value: string) => dispatch(setOtpCode(value)),
    },
  };
};

export default useFunctionBankAccount;
