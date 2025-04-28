import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import useHideTabbar from "@/helpers/hooks/useHideTabbar";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import {
  useCancelWebHookMutation,
  useDeleteBankAccountMutation,
  useGetBankAccountsQuery,
  useRegisterWebHookMutation,
} from "@/services/bankAccounts";
import { BankAccountType } from "@/helpers/types/bankAccount.types";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { ToastAndroid } from "react-native";
import { Modalize } from "react-native-modalize";
import { useDispatch } from "react-redux";
import BANK_ACCOUNT_CONSTANT from "../BankAccount.constant";
import TEXT_TRANSLATE_BANK_ACCOUNT from "../BankAccount.translate";
import { setLoading } from "@/redux/slices/loadingSlice";

const useBankAccount = () => {
  const dispatch = useDispatch();
  useHideTabbar();

  const [selectedAccount, setSelectedAccount] =
    useState<BankAccountType | null>(null);
  const detailModalRef = useRef<Modalize>(null);
  const deleteModalRef = useRef<Modalize>(null);
  const linkModalRef = useRef<Modalize>(null);
  const unlinkModalRef = useRef<Modalize>(null);
  const [accountToDelete, setAccountToDelete] = useState<string>("");
  const [accountToLink, setAccountToLink] = useState<string>("");
  const [accountToUnlink, setAccountToUnlink] = useState<string>("");
  const { SYSTEM_ERROR } = COMMON_CONSTANT;
  const { BANK_LIST, ERROR_CODE } = BANK_ACCOUNT_CONSTANT;
  const { MESSAGE_ERROR, MESSAGE_SUCCESS } = TEXT_TRANSLATE_BANK_ACCOUNT;
  const [isRefetching, setIsRefetching] = useState(false);
  const modalizeRef = useRef<Modalize>(null);

  const openRulesModal = () => {
    modalizeRef.current?.open();
  };

  const { data, isLoading, refetch } = useGetBankAccountsQuery({
    PageIndex: 1,
    PageSize: 100,
  });

  const [deleteBankAccount] = useDeleteBankAccountMutation();
  const [registerWebHook] = useRegisterWebHookMutation();
  const [cancelWebHook] = useCancelWebHookMutation();

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

  const handleOpenModalDelete = useCallback(async (bankAccountId: string) => {
    setAccountToDelete(bankAccountId);
    deleteModalRef.current?.open();
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    try {
      await deleteBankAccount(accountToDelete).unwrap();
      ToastAndroid.show(
        MESSAGE_SUCCESS.DELETE_BANK_ACCOUNT_SUCCESS,
        ToastAndroid.SHORT,
      );
      deleteModalRef.current?.close();
    } catch (err: any) {
      const error = err?.data;
      if (error?.errorCode === ERROR_CODE.BANK_ACCOUNT_NOT_FOUND) {
        ToastAndroid.show(
          MESSAGE_ERROR.BANK_ACCOUNT_NOT_FOUND,
          ToastAndroid.SHORT,
        );
        return;
      }
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    }
  }, [accountToDelete]);

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

  const handleOpenLinkModal = useCallback((accountBankId: string) => {
    setAccountToLink(accountBankId);
    linkModalRef.current?.open();
  }, []);

  const handleConfirmLink = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      await registerWebHook({ accountBankId: accountToLink }).unwrap();
      ToastAndroid.show(
        MESSAGE_SUCCESS.LINK_BANK_ACCOUNT_SUCCESS,
        ToastAndroid.SHORT,
      );
      linkModalRef.current?.close();
    } catch (err: any) {
      const error = err?.data;
      if (error?.errorCode === ERROR_CODE.BANK_ACCOUNT_NOT_FOUND) {
        ToastAndroid.show(
          TEXT_TRANSLATE_BANK_ACCOUNT.MESSAGE_ERROR.BANK_ACCOUNT_NOT_FOUND,
          ToastAndroid.SHORT,
        );
        return;
      }
      if (error?.errorCode === ERROR_CODE.WEB_HOOK_REGISTRATION_FAILED) {
        ToastAndroid.show(
          TEXT_TRANSLATE_BANK_ACCOUNT.MESSAGE_ERROR.BANK_ACCOUNT_NOT_FOUND,
          ToastAndroid.SHORT,
        );
        return;
      }
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    } finally {
      dispatch(setLoading(false));
    }
  }, [accountToLink]);

  const handleWebhook = useCallback(
    async (accountBankId: string, isLinked: boolean) => {
      if (!isLinked) {
        handleOpenLinkModal(accountBankId);
        return;
      }
      setAccountToUnlink(accountBankId);
      unlinkModalRef.current?.open();
    },
    [],
  );

  const handleConfirmUnlink = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      await cancelWebHook({ accountBankId: accountToUnlink }).unwrap();
      ToastAndroid.show(
        MESSAGE_SUCCESS.UNLINK_BANK_ACCOUNT_SUCCESS,
        ToastAndroid.SHORT,
      );
      unlinkModalRef.current?.close();
    } catch (err: any) {
      const error = err?.data;
      if (error?.errorCode === ERROR_CODE.BANK_ACCOUNT_NOT_FOUND) {
        ToastAndroid.show(
          TEXT_TRANSLATE_BANK_ACCOUNT.MESSAGE_ERROR.BANK_ACCOUNT_NOT_FOUND,
          ToastAndroid.SHORT,
        );
        return;
      }
      if (error?.errorCode === ERROR_CODE.WEB_HOOK_REGISTRATION_FAILED) {
        ToastAndroid.show(
          TEXT_TRANSLATE_BANK_ACCOUNT.MESSAGE_ERROR.BANK_ACCOUNT_NOT_FOUND,
          ToastAndroid.SHORT,
        );
      }
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    } finally {
      dispatch(setLoading(false));
    }
  }, [accountToUnlink]);

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
      deleteModalRef,
      linkModalRef,
      unlinkModalRef,
      selectedAccount,
      isLoading,
      isRefetching,
      modalizeRef,
    },
    handler: {
      handleBack,
      handleViewDetail,
      handleOpenModalDelete,
      handleConfirmDelete,
      handleEditBankAccount,
      handleCopyAccountNumber,
      handleConfirmLink,
      handleWebhook,
      handleConfirmUnlink,
      handleRefetch,
      openRulesModal,
    },
  };
};

export default useBankAccount;
