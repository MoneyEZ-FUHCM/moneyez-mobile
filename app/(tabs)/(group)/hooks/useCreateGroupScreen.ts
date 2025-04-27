import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import useDebounce from "@/helpers/hooks/useDebounce";
import useUploadImage from "@/helpers/hooks/useUploadImage";
import { CreateGroupPayload } from "@/helpers/types/group.type";
import { selectOtpCode } from "@/redux/hooks/systemSelector";
import { setLoading } from "@/redux/slices/loadingSlice";
import { setOtpCode } from "@/redux/slices/systemSlice";
import { setGroupTabHidden, setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetBankAccountsQuery } from "@/services/bankAccounts";
import {
  useCreateGroupMutation,
  useGetGroupDetailQuery,
  useUpdateGroupMutation,
} from "@/services/group";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BackHandler, Keyboard, ToastAndroid } from "react-native";
import { Modalize } from "react-native-modalize";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import FUNCTION_BANK_ACCOUNT_CONSTANT from "../../(account)/bank-account/function-bank-account/FunctionBankAccount.constant";
import TEXT_TRANSLATE_CREATE_GROUP from "../create-group/CreateGroup.translate";

const useCreateGroupScreen = () => {
  const { MESSAGE_VALIDATE, SUCCESS_MESSAGES } = TEXT_TRANSLATE_CREATE_GROUP;
  const params = useLocalSearchParams();
  const isEditMode = params?.isEditMode === "true";
  const groupId = params?.groupId as string;
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

  const {
    data: groupData,
    isLoading: isLoadingGroupData,
    refetch: refetchGroupDetail,
  } = useGetGroupDetailQuery(
    { id: groupId },
    { skip: !isEditMode || !groupId },
  );

  const dispatch = useDispatch();
  const [createGroup] = useCreateGroupMutation();
  const [updateGroup] = useUpdateGroupMutation();
  const { HTTP_STATUS, SYSTEM_ERROR } = COMMON_CONSTANT;
  const { imageUrl, pickAndUploadImage, setImageUrl } = useUploadImage();
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [currentValues, setCurrentValues] = useState<any>(null);
  const ruleModalRef = useRef<Modalize>(null);
  const otpModalRef = useRef<Modalize>(null);
  const otpCode = useSelector(selectOtpCode);

  useEffect(() => {
    if (isEditMode && groupData?.data) {
      const group = groupData.data;

      if (formikRef.current) {
        formikRef.current.setValues({
          name: group.name || "",
          description: group.description || "",
          accountBankId: group.bankAccount?.id || "",
          bankName: group.bankAccount?.bankName || "",
          bankAccountNumber: group.bankAccount?.accountNumber || "",
          image: group.imageUrl || "",
        });
      }

      if (group.imageUrl) {
        setImageUrl(group.imageUrl);
      }
    }
  }, [isEditMode, groupData, formikRef]);

  const handleBack = () => {
    dispatch(setGroupTabHidden(false));
    router.back();
  };

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

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleBack();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [handleBack]),
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
  });

  const handleProcessCreateGroup = useCallback(
    async (values: CreateGroupPayload) => {
      dispatch(setLoading(true));
      try {
        let res;
        if (isEditMode) {
          const updatePayload = {
            ...values,
            image: imageUrl || values.image,
            accountBankId: values.accountBankId,
            id: groupId,
          };
          const res = await updateGroup(updatePayload).unwrap();
          if (res?.status === HTTP_STATUS.SUCCESS.OK) {
            ToastAndroid.show(
              SUCCESS_MESSAGES.GROUP_UPDATED_SUCCESSFULLY,
              ToastAndroid.SHORT,
            );
          }
        } else {
          const createPayload = {
            ...values,
            image: imageUrl || values.image,
            currentBalance: 0,
            accountBankId: values.accountBankId,
          };
          res = await createGroup(createPayload).unwrap();
          if (res?.status === HTTP_STATUS.SUCCESS.CREATED) {
            ToastAndroid.show(
              SUCCESS_MESSAGES.GROUP_CREATED_SUCCESSFULLY,
              ToastAndroid.SHORT,
            );
          }
        }
        await refetchGroupDetail();
        router.replace({
          pathname: PATH_NAME.GROUP_HOME.GROUP_HOME_DEFAULT as any,
          params: { id: isEditMode ? groupId : res?.data?.id },
        });

        dispatch(setMainTabHidden(true));
        dispatch(setGroupTabHidden(false));
      } catch (err) {
        ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
        console.log(err);
      } finally {
        dispatch(setLoading(false));
        ruleModalRef.current?.close();
      }
    },
    [createGroup, updateGroup, dispatch, imageUrl, isEditMode, groupId],
  );

  const handleCreateGroup = useCallback(
    (values: CreateGroupPayload) => {
      if (isEditMode) {
        setCurrentValues(values);
        setTimeout(() => {
          handleProcessCreateGroup(values);
        }, 0);
      } else {
        setCurrentValues(values);
        ruleModalRef.current?.open();
        setShowRuleModal(true);
      }
    },
    [isEditMode, handleProcessCreateGroup],
  );

  const handleAcceptRules = useCallback(async () => {
    ruleModalRef.current?.close();
    setShowRuleModal(false);
    otpModalRef.current?.open();
    setShowOtpModal(true);
  }, []);

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
    if (isEditMode) {
      ToastAndroid.show(
        MESSAGE_VALIDATE.ACCOUNT_NUMBER_CANNOT_CHANGED,
        ToastAndroid.SHORT,
      );
      return;
    }

    setSearchText("");
    bankSelectModalRef.current?.open();
  }, [isEditMode]);

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
      isEditMode,
      isLoadingGroupData,
      groupData: groupData?.data,
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
      handleBack,
    },
  };
};

export default useCreateGroupScreen;
