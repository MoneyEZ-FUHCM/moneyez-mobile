import { PATH_NAME } from "@/helpers/constants/pathname";
import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import {
  useGetGroupDetailQuery,
  useGetGroupLogsQuery,
  useGetMemberLogsQuery,
} from "@/services/group";
import { useGetGroupTransactionQuery } from "@/services/transaction";
import { router, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

const useGroupHomeDefault = () => {
  const dispatch = useDispatch();
  const { id } = useLocalSearchParams();
  useGetGroupDetailQuery({ id }, { skip: !id });
  const groupDetail = useSelector(selectCurrentGroup);

  const { data: groupLogs } = useGetGroupLogsQuery(
    { groupId: id, PageIndex: 1, PageSize: 100 },
    { skip: !id, refetchOnMountOrArgChange: true },
  );
  const { data: groupTransaction } = useGetGroupTransactionQuery(
    { id: id, PageIndex: 1, PageSize: 100 },
    { skip: !id, refetchOnMountOrArgChange: true },
  );

  // const { data: memberLogs } = useGetMemberLogsQuery(
  //   { groupId: id, PageIndex: 1, PageSize: 100 },
  //   { skip: !id },
  // );

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

  return {
    state: {
      groupDetail,
      groupLogs: groupLogs?.items,
      groupTransaction: groupTransaction?.items,
    },
    handler: {
      handleCreateFundRequest,
      handleCreateWithdrawRequest,
      handleFundRemind,
      handleStatistic,
    },
  };
};

export default useGroupHomeDefault;
