import { PATH_NAME } from "@/helpers/constants/pathname";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import * as Clipboard from "expo-clipboard";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo } from "react";
import { BackHandler, ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import TEXT_TRANSLATE_FUND_REQUEST_INFO from "../FundRequestInfo.translate";
import { GroupMember } from "@/types/group.type";
import { GROUP_ROLE } from "@/enums/globals";
import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { selectUserInfo } from "@/redux/slices/userSlice";

const useFundRequestInfo = () => {
  const { GROUP_HOME } = PATH_NAME;
  const { MESSAGE } = TEXT_TRANSLATE_FUND_REQUEST_INFO;
  const dispatch = useDispatch();
  const params = useLocalSearchParams();
  const groupDetail = useSelector(selectCurrentGroup);
  const userInfo = useSelector(selectUserInfo);

  const isLeader = useMemo(() => {
    return groupDetail?.groupMembers?.some(
      (member: GroupMember) =>
        member?.userId === userInfo?.id && member?.role === GROUP_ROLE.LEADER,
    );
  }, [groupDetail, userInfo]);

  const {
    id,
    amount,
    createdDate,
    requestCode,
    accountNumber,
    bankName,
    accountHolderName,
    description,
    mode,
  } = params;
  const fundRequest = {
    id: id,
    amount: amount,
    createdDate: createdDate ?? "2025-03-23T23:31:56.1750155",
    transferContent: requestCode,
    recipientAccount: accountNumber,
    bankName: bankName,
    accountHolder: accountHolderName,
    description: description,
  };

  const handleBack = useCallback(() => {
    router.back();
    dispatch(setGroupTabHidden(false));
  }, []);

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

  const copyToClipboard = async (text: string | string[]) => {
    try {
      await Clipboard.setStringAsync(
        Array.isArray(text) ? text.join("\n") : text,
      );
      ToastAndroid.show(MESSAGE.COPY_SUCCESS, ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show(MESSAGE.COPY_ERROR, ToastAndroid.SHORT);
    }
  };

  const handleCreateFundRequest = useCallback(() => {
    router.replace({
      pathname: GROUP_HOME.CREATE_FUND_REQUEST as any,
      params: { id: fundRequest?.id },
    });
  }, []);

  const getSuccessMessage = useCallback(() => {
    if (isLeader) {
      return mode === "WITHDRAW"
        ? "Bạn đã tạo yêu cầu rút quỹ thành công. Vì bạn là trưởng nhóm, yêu cầu này sẽ được tự động phê duyệt"
        : "Bạn đã tạo yêu cầu góp quỹ thành công. Vì bạn là trưởng nhóm, yêu cầu này sẽ được tự động phê duyệt";
    }
    return mode === "WITHDRAW"
      ? "Bạn đã tạo yêu cầu rút quỹ thành công. Vui lòng chờ trưởng nhóm duyệt yêu cầu của bạn"
      : MESSAGE.SUCCESS;
  }, [mode, isLeader]);

  return {
    state: {
      fundRequest,
      isLeader,
      mode,
      getSuccessMessage,
    },
    handler: {
      copyToClipboard,
      handleBack,
      handleCreateFundRequest,
    },
  };
};

export default useFundRequestInfo;
