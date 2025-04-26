import useHideGroupTabbar from "@/helpers/hooks/useHideGroupTabbar";
import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { useGetGroupLogsQuery } from "@/services/group";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EDIT_LOG_HISTORY_CONSTANT from "../EditLogHistory.constant";
import { ToastAndroid } from "react-native";
import { GroupLogs } from "@/helpers/types/group.type";

type NotificationTabType = "group" | "members" | string;

const useEditLogs = () => {
  const pageSize = 10;
  const initialActiveTab: NotificationTabType = "group";
  const { TABS } = EDIT_LOG_HISTORY_CONSTANT;
  const [activeTab, setActiveTab] =
    useState<NotificationTabType>(initialActiveTab);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [logs, setLogs] = useState<GroupLogs[]>([]);
  const [isFetchingData, setIsFetchingData] = useState(true);

  const groupDetail = useSelector(selectCurrentGroup);
  const {
    data: groupLogs,
    refetch: refetchGroupLogs,
    isLoading,
  } = useGetGroupLogsQuery(
    {
      groupId: groupDetail?.id,
      PageIndex: pageIndex,
      PageSize: pageSize,
      change_type: activeTab,
    },
    { skip: !groupDetail?.id },
  );
  useHideGroupTabbar();

  useEffect(() => {
    if (logs?.length > 0) {
      setLogs([]);
      setPageIndex(1);
    }
  }, [activeTab]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && !isLoadingMore && groupLogs?.items?.length === pageSize) {
      setIsLoadingMore(true);
      setPageIndex((prev) => prev + 1);
    }
  }, [isLoading, isLoadingMore, groupLogs?.items?.length]);

  useEffect(() => {
    if (groupLogs?.items) {
      if (isRefetching) {
        setLogs(groupLogs?.items);
        setPageIndex(1);
      } else {
        setLogs((prevGroups) => {
          const existingIds = new Set(prevGroups.map((item) => item.id));
          const newItems = groupLogs.items.filter(
            (item: any) => !existingIds.has(item.id),
          );
          return [...prevGroups, ...newItems];
        });
      }

      setIsFetchingData(false);
      setIsLoadingMore(false);
    }
  }, [groupLogs?.items, isRefetching]);

  const handleRefetchLogsList = useCallback(async () => {
    if (isRefetching) {
      ToastAndroid.show(
        "Vui lòng đợi trước khi làm mới lại!",
        ToastAndroid.SHORT,
      );
      return;
    }

    setIsRefetching(true);
    setPageIndex(1);
    await refetchGroupLogs().finally(() => {
      setTimeout(() => setIsRefetching(false), 2000);
      ToastAndroid.show("Danh sách đã được cập nhật", ToastAndroid.SHORT);
    });
  }, [refetchGroupLogs, isRefetching]);

  return {
    state: {
      TABS,
      activeTab,
      logs,
      isLoading,
      isFetchingData,
      isRefetching,
      pageSize,
      isLoadingMore,
    },
    handler: {
      setActiveTab,
      handleRefetchLogsList,
      handleLoadMore,
    },
  };
};
export default useEditLogs;
