import { GROUP_ROLE } from "@/enums/globals";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import { selectUserInfo } from "@/redux/slices/userSlice";
import { useGetGroupDetailQuery, useGetGroupLogsQuery } from "@/services/group";
import { useGetGroupTransactionQuery } from "@/services/transaction";
import { GroupMember } from "@/types/group.type";
import { UserInfo } from "@/types/user.types";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const useGroupHomeDefault = () => {
  const dispatch = useDispatch();
  const { id } = useLocalSearchParams();
  const { refetch: refetchGroupDetail } = useGetGroupDetailQuery(
    { id },
    { skip: !id },
  );

  const groupDetail = useSelector(selectCurrentGroup);
  const userInfo = useSelector(selectUserInfo);

  const isLeader = Boolean(
    groupDetail?.groupMembers?.some(
      ({ userId, role }) =>
        userId === userInfo?.id && role === GROUP_ROLE.LEADER,
    ),
  );

  const { data: groupLogs, refetch: refetchGroupLogs } = useGetGroupLogsQuery(
    { groupId: id, PageIndex: 1, PageSize: 100 },
    { skip: !id },
  );
  const { data: groupTransaction, refetch: refetchGroupTransactions } =
    useGetGroupTransactionQuery(
      { id: id, PageIndex: 1, PageSize: 100 },
      { skip: !id },
    );

  const handleCreateFundRequest = () => {
    dispatch(setGroupTabHidden(true));
    router.push({
      pathname: PATH_NAME.GROUP_HOME.CREATE_FUND_REQUEST as any,
    });
  };

  const handleCreateWithdrawRequest = () => {
    dispatch(setGroupTabHidden(true));
    router.push({
      pathname: PATH_NAME.GROUP_HOME.WITHDRAW_FUND_REQUEST as any,
    });
  };

  const handleFundRemind = () => {
    dispatch(setGroupTabHidden(true));
    router.push({
      pathname: PATH_NAME.GROUP_HOME.GROUP_FUND_REMIND as any,
    });
  };

  const handleStatistic = () => {};
  const [isRefetching, setIsRefetching] = useState(false);

  const handleRefetchData = useCallback(() => {
    Promise.all([
      refetchGroupDetail(),
      refetchGroupLogs(),
      refetchGroupTransactions(),
    ]).finally(() => {
      setIsRefetching(false);
      ToastAndroid.show("Danh sách đã được cập nhật", ToastAndroid.SHORT);
    });
  }, [refetchGroupDetail, refetchGroupLogs, refetchGroupTransactions]);

  return {
    state: {
      groupDetail,
      groupLogs: groupLogs?.items,
      groupTransaction: groupTransaction?.items,
      refreshing: isRefetching,
      isLeader,
    },
    handler: {
      handleCreateFundRequest,
      handleCreateWithdrawRequest,
      handleFundRemind,
      handleStatistic,
      handleRefetchData,
    },
  };
};

export default useGroupHomeDefault;
