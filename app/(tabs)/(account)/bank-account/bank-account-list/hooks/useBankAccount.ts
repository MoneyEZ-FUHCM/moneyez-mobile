import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import useHideTabbar from "@/hooks/useHideTabbar";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import {
  useDeleteBankAccountMutation,
  useGetBankAccountsQuery,
  useRegisterWebHookMutation,
} from "@/services/bankAccounts";
import { BankAccountType } from "@/types/bankAccount.types";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { ToastAndroid } from "react-native";
import { Modalize } from "react-native-modalize";
import { useDispatch } from "react-redux";
import BANK_ACCOUNT_CONSTANT from "../BankAccount.constant";
import TEXT_TRANSLATE_BANK_ACCOUNT from "../BankAccount.translate";

const useBankAccount = () => {
  const dispatch = useDispatch();
  useHideTabbar();

  const [selectedAccount, setSelectedAccount] =
    useState<BankAccountType | null>(null);
  const detailModalRef = useRef<Modalize>(null);
  const { SYSTEM_ERROR } = COMMON_CONSTANT;
  const { BANK_LIST, ERROR_CODE } = BANK_ACCOUNT_CONSTANT;
  const { MESSAGE_ERROR, MESSAGE_SUCCESS } = TEXT_TRANSLATE_BANK_ACCOUNT;
  const [isRefetching, setIsRefetching] = useState(false);

  const { data, isLoading, refetch } = useGetBankAccountsQuery({
    PageIndex: 1,
    PageSize: 100,
  });

  const [deleteBankAccount] = useDeleteBankAccountMutation();
  const [registerWebHook] = useRegisterWebHookMutation();

  const bankAccounts =
    data?.items?.map((account) => {
      const matchingBank = BANK_LIST.find(
        (bank) => bank.shortName === account.bankShortName,
      );
      return {
        ...account,
        bankLogo: matchingBank?.logo,
      };
    }) || [];

  const handleBack = () => {
    dispatch(setMainTabHidden(false));
    router.back();
  };

  const handleViewDetail = useCallback((account: BankAccountType) => {
    setSelectedAccount(account);
    detailModalRef.current?.open();
  }, []);

  const handleDeleteAccount = useCallback(async (bankAccountId: string) => {
    try {
      await deleteBankAccount(bankAccountId).unwrap();
      ToastAndroid.show(
        MESSAGE_SUCCESS.DELETE_BANK_ACCOUNT,
        ToastAndroid.SHORT,
      );
    } catch (err: any) {
      const error = err?.data;
      if (error?.errorCode === ERROR_CODE.BANK_ACCOUNT_NOT_FOUND) {
        ToastAndroid.show(
          MESSAGE_ERROR.BANK_ACCOUNT_NOT_FOUND,
          ToastAndroid.SHORT,
        );
      }
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    }
  }, []);

  const handleEditBankAccount = (account: BankAccountType) => {
    router.push({
      pathname: PATH_NAME.ACCOUNT.FUNCTION_BANK_ACCOUNT as any,
      params: {
        editMode: "true",
        bankAccount: JSON.stringify(account),
      },
    });
  };

  const handleCopyAccountNumber = useCallback(async (accountNumber: string) => {
    try {
      await Clipboard.setStringAsync(accountNumber);
      ToastAndroid.show(
        MESSAGE_SUCCESS.COPY_ACCOUNT_NUMBER_SUCCESS,
        ToastAndroid.SHORT,
      );
    } catch (error) {
      ToastAndroid.show(
        MESSAGE_ERROR.BANK_ACCOUNT_NOT_FOUND,
        ToastAndroid.SHORT,
      );
    }
  }, []);

  const handleLinkAccount = useCallback(async (accountBankId: string) => {
    try {
      await registerWebHook(accountBankId).unwrap();
      ToastAndroid.show("Liên kết ngân hàng thành công", ToastAndroid.SHORT);
    } catch (err: any) {
      const error = err?.data;
      if (error?.errorCode === ERROR_CODE.BANK_ACCOUNT_NOT_FOUND) {
        ToastAndroid.show(
          TEXT_TRANSLATE_BANK_ACCOUNT.MESSAGE_ERROR.BANK_ACCOUNT_NOT_FOUND,
          ToastAndroid.SHORT,
        );
      }
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    }
  }, []);

  const handleRefetch = useCallback(async () => {
    if (isRefetching) {
      ToastAndroid.show(
        "Vui lòng đợi trước khi làm mới lại!",
        ToastAndroid.SHORT,
      );
      return;
    }

    setIsRefetching(true);
    await refetch().finally(() => {
      setTimeout(() => setIsRefetching(false), 2000);
      ToastAndroid.show("Danh sách đã được cập nhật", ToastAndroid.SHORT);
    });
  }, [refetch, isRefetching]);

  return {
    state: {
      bankAccounts,
      detailModalRef,
      selectedAccount,
      isLoading,
      isRefetching,
    },
    handler: {
      handleBack,
      handleViewDetail,
      handleDeleteAccount,
      handleEditBankAccount,
      handleCopyAccountNumber,
      handleLinkAccount,
      handleRefetch,
    },
  };
};

export default useBankAccount;
