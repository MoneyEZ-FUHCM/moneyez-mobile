import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Keyboard, ToastAndroid } from "react-native";
import { router, useFocusEffect } from "expo-router";
import * as Yup from "yup";
import { PATH_NAME } from "@/helpers/constants/pathname";
import TEXT_TRANSLATE_CREATE_GROUP from "../create-group/CreateGroup.translate";
import { useDispatch, useSelector } from "react-redux";
import { useCreateGroupMutation } from "@/services/group";
import { setLoading } from "@/redux/slices/loadingSlice";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import useUploadImage from "@/hooks/useUploadImage";
import { setGroupTabHidden, setMainTabHidden } from "@/redux/slices/tabSlice";
import { Modalize } from "react-native-modalize";
import FUNCTION_BANK_ACCOUNT_CONSTANT from "../../(account)/bank-account/function-bank-account/FunctionBankAccount.constant";
import { useGetBankAccountsQuery } from "@/services/bankAccounts";
import useDebounce from "@/hooks/useDebounce";
import { CreateGroupPayload } from "@/types/group.type";
import { setOtpCode } from "@/redux/slices/systemSlice";
import { selectOtpCode } from "@/redux/hooks/systemSelector";

const useCreateGroupScreen = () => {
  const { MESSAGE_VALIDATE, SUCCESS_MESSAGES } = TEXT_TRANSLATE_CREATE_GROUP;
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const searchQuery = useDebounce(searchText, 500);
  const [isAtTop, setIsAtTop] = useState(true);
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const bankSelectModalRef = useRef<Modalize>(null);
  const { BANK_LIST } = FUNCTION_BANK_ACCOUNT_CONSTANT;
  const formikRef = useRef<any>(null);
  const { data: bankAccounts, refetch } = useGetBankAccountsQuery({
    PageIndex: 1,
    PageSize: 100,
  });
  const dispatch = useDispatch();
  const [createGroup] = useCreateGroupMutation();
  const { HTTP_STATUS, SYSTEM_ERROR } = COMMON_CONSTANT;
  const { imageUrl, pickAndUploadImage } = useUploadImage();
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [currentValues, setCurrentValues] = useState<any>(null);
  const ruleModalRef = useRef<Modalize>(null);
  const otpModalRef = useRef<Modalize>(null);
  const otpCode = useSelector(selectOtpCode);

  const mappedAccounts = useMemo(() => {
    return bankAccounts?.items
      ?.filter(
        (account) => account.isHasGroup === false && account.isLinked === true,
      )
      .map((account) => {
        const bank = BANK_LIST.find(
          (b) => b.shortName === account.bankShortName,
        );
        return {
          ...account,
          logo: bank ? bank.logo : null,
        };
      });
  }, [bankAccounts?.items]);

  useFocusEffect(
    useCallback(() => {
      dispatch(setMainTabHidden(true));
    }, [dispatch]),
  );

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required(MESSAGE_VALIDATE.GROUP_NAME_REQUIRED),
    description: Yup.string()
      .trim()
      .required(MESSAGE_VALIDATE.DESCRIPTION_REQUIRED),
    currentBalance: Yup.string()
      .trim()
      .required(MESSAGE_VALIDATE.CURRENT_BALANCE_REQUIRED),
  });

  const handleCreateGroup = useCallback(async (values: CreateGroupPayload) => {
    setCurrentValues(values);
    ruleModalRef.current?.open();
    setShowRuleModal(true);
  }, []);

  const handleAcceptRules = useCallback(async () => {
    ruleModalRef.current?.close();
    setShowRuleModal(false);
    otpModalRef.current?.open();
    setShowOtpModal(true);
  }, []);

  const handleProcessCreateGroup = useCallback(
    async (values: CreateGroupPayload) => {
      dispatch(setLoading(true));
      try {
        const updatePayload = {
          ...values,
          image: imageUrl,
          currentBalance: 0,
          accountBankId: values.accountBankId,
        };
        const res = await createGroup(updatePayload).unwrap();
        if (res?.status === HTTP_STATUS.SUCCESS.CREATED) {
          ToastAndroid.show(
            SUCCESS_MESSAGES.GROUP_CREATED_SUCCESSFULLY,
            ToastAndroid.SHORT,
          );
          await refetch();
          router.replace({
            pathname: PATH_NAME.GROUP_HOME.GROUP_HOME_DEFAULT as any,
            params: { id: res?.data?.id },
          });
          dispatch(setMainTabHidden(true));
          dispatch(setGroupTabHidden(false));
        }
      } catch (err) {
        ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
      } finally {
        dispatch(setLoading(false));
        ruleModalRef.current?.close();
      }
    },
    [createGroup, dispatch, imageUrl, refetch],
  );

  const handleVerifyOtp = useCallback(async () => {
    if (otpCode.length !== 5 || !/^[0-9]+$/.test(otpCode)) {
      ToastAndroid.show("OTP phải có đúng 5 số", ToastAndroid.SHORT);
      return;
    }

    try {
      // const payload = { email, otpCode };
      // const res = await verify(JSON.stringify(payload)).unwrap();
      // if (res?.status === HTTP_STATUS.SUCCESS.OK) {
      //   otpModalRef.current?.close();
      //   setShowOtpModal(false);
      //   await handleProcessCreateGroup(currentValues);
      // }
    } catch (err) {
      ToastAndroid.show("OTP không hợp lệ", ToastAndroid.SHORT);
    }
  }, [otpCode, currentValues]);

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

  const handleSelectBank = useCallback(
    (bank: any, setFieldValue: (field: string, value: any) => void) => {
      if (!setFieldValue) {
        return;
      }

      try {
        setFieldValue("accountBankId", bank.id);
        setFieldValue("bankName", bank.bankName);
        setFieldValue("bankAccountNumber", bank.accountNumber);
        setSelectedBank(bank);
        bankSelectModalRef.current?.close();
      } catch (error) {
        ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
      }
    },
    [],
  );

  const filteredAccounts = mappedAccounts?.filter(
    (bank) =>
      bank.bankName?.toLowerCase().includes(searchText.toLowerCase()) ||
      bank.bankShortName?.toLowerCase().includes(searchText.toLowerCase()) ||
      bank.accountHolderName
        ?.toLowerCase()
        .includes(searchText.toLowerCase()) ||
      bank.accountNumber?.toLowerCase().includes(searchText.toLowerCase()),
  );

  const handleNavigateCreateBankAccount = useCallback(() => {
    bankSelectModalRef.current?.close();
    router.navigate(PATH_NAME.GROUP.BANK_ACCOUNT_LIST as any);
  }, []);

  return {
    state: {
      isKeyboardVisible,
      imageUrl,
      searchQuery,
      isAtTop,
      bankSelectModalRef,
      formikRef,
      bankAccounts: bankAccounts?.items,
      mappedAccounts: filteredAccounts,
      selectedBank,
      showRuleModal,
      showOtpModal,
      ruleModalRef,
      otpModalRef,
      otpCode,
      currentValues,
    },
    handler: {
      validationSchema,
      handleCreateGroup,
      pickAndUploadImage,
      handleScroll,
      handleOpenBankSelect,
      handleCloseModal,
      handleSelectBank,
      setSearchText,
      handleNavigateCreateBankAccount,
      handleAcceptRules,
      handleVerifyOtp,
      setOtpCode: (value: string) => dispatch(setOtpCode(value)),
      handleProcessCreateGroup,
    },
  };
};

export default useCreateGroupScreen;
