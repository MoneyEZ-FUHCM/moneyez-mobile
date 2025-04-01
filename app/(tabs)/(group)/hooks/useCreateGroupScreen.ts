import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Keyboard, ToastAndroid } from "react-native";
import { router, useFocusEffect } from "expo-router";
import * as Yup from "yup";
import { PATH_NAME } from "@/helpers/constants/pathname";
import TEXT_TRANSLATE_CREATE_GROUP from "../create-group/CreateGroup.translate";
import { useDispatch } from "react-redux";
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
  const { data: bankAccounts } = useGetBankAccountsQuery({
    PageIndex: 1,
    PageSize: 100,
  });
  const dispatch = useDispatch();
  const [createGroup] = useCreateGroupMutation();
  const { HTTP_STATUS, SYSTEM_ERROR } = COMMON_CONSTANT;
  const { imageUrl, pickAndUploadImage } = useUploadImage();

  const mappedAccounts = bankAccounts?.items?.map((account) => {
    const bank = BANK_LIST.find((b) => b.shortName === account.bankShortName);
    return {
      ...account,
      logo: bank ? bank.logo : null,
    };
  });

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
    accountBankId: Yup.string()
      .trim()
      .required(MESSAGE_VALIDATE.ACCOUNT_BANKING_REQUIRED),
  });

  const handleCreateGroup = useCallback(
    async (payload: CreateGroupPayload) => {
      dispatch(setLoading(true));
      const updatePayload = {
        ...payload,
        image: imageUrl,
        currentBalance: 0,
        accountBankId: payload.accountBankId,
      };
      try {
        const res = await createGroup(updatePayload).unwrap();
        if (res && res.status === HTTP_STATUS.SUCCESS.CREATED) {
          ToastAndroid.show(
            SUCCESS_MESSAGES.GROUP_CREATED_SUCCESSFULLY,
            ToastAndroid.SHORT,
          );
          router.replace({
            pathname: PATH_NAME.GROUP_HOME.GROUP_HOME_DEFAULT as any,
            params: { id: res?.data?.id },
          });
          dispatch(setMainTabHidden(true));
          dispatch(setGroupTabHidden(false));
        }
      } catch (err: any) {
        ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [createGroup, dispatch, imageUrl],
  );

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
        console.log("Vui lòng chọn số tài khoản");
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
    router.navigate(PATH_NAME.GROUP.CREATE_FUNCTION_BANK_ACCOUNT as any);
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
    },
  };
};

export default useCreateGroupScreen;
