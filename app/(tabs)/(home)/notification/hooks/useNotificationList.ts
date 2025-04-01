import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { formatDate, formatTime } from "@/helpers/libs";
import useHideTabbar from "@/hooks/useHideTabbar";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import {
  useDeleteNotificationMutation,
  useGetNotificationQuery,
  useReadAllNotificationMutation,
  useReadNotificationMutation,
} from "@/services/notification";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ToastAndroid } from "react-native";
import { Modalize } from "react-native-modalize";
import { useDispatch } from "react-redux";
import NOTIFICATION_CONSTANTS from "../NotificationList.const";
import TEXT_TRANSLATE_NOTICE from "../NotificationList.translate";

type NotificationTabType = "all" | string;
interface QueryParams {
  PageIndex: number;
  PageSize: number;
  type?: string;
}

const initialActiveTab: NotificationTabType = "all";
const initialPageIndex = 1;
const pageSize = 10;
const tabs = NOTIFICATION_CONSTANTS.TABS;

const useNotificationList = () => {
  const [activeTab, setActiveTab] =
    useState<NotificationTabType>(initialActiveTab);
  const [pageIndex, setPageIndex] = useState(initialPageIndex);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<any>(null);
  const [isFetchingData, setIsFetchingData] = useState(true);

  const modalizeRef = useRef<Modalize>(null);
  const dispatch = useDispatch();
  const { SYSTEM_ERROR } = COMMON_CONSTANT;
  const { ERROR_CODE } = NOTIFICATION_CONSTANTS;

  const queryParams: QueryParams = {
    PageIndex: pageIndex,
    PageSize: pageSize,
    type: activeTab,
  };

  const [readNotification] = useReadNotificationMutation();
  const [readAllNotification] = useReadAllNotificationMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const {
    data,
    isLoading,
    refetch,
    isError,
    error,
    isFetching: isRefetching,
  } = useGetNotificationQuery(queryParams);

  useHideTabbar();

  useEffect(() => {
    setIsFetchingData(true);
    const fetchData = async () => {
      setPageIndex(initialPageIndex);
      setNotifications([]);
      await refetch();
      setIsFetchingData(false);
    };
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    if (data?.items) {
      if (isFetchingData) {
        setNotifications(data?.items);
        setPageIndex(1);
      } else {
        setNotifications((prev) => {
          const newNotifications = data.items?.map((notice: any) => ({
            id: notice.id,
            title: notice.title,
            type: notice.type,
            message: notice.message.toLowerCase(),
            isRead: notice.isRead,
            formattedDate: formatDate(notice.createdDate),
            formattedTime: formatTime(notice.createdDate),
          }));
          return [
            ...prev,
            ...newNotifications.filter(
              (newTrans) =>
                !prev.some((oldTrans) => oldTrans.id === newTrans.id),
            ),
          ];
        });
      }

      setIsFetchingData(false);
      setIsLoadingMore(false);
    }
  }, [data?.items, isFetchingData]);

  const handleGoBack = () => {
    router.back();
    dispatch(setMainTabHidden(false));
  };

  const loadMoreData = useCallback(() => {
    if (!isLoading && !isLoadingMore && data?.items?.length === pageSize) {
      setIsLoadingMore(true);
      setPageIndex((prev) => prev + 1);
    }
  }, [data?.items.length, isLoading, isLoadingMore, pageSize]);

  const handleMarkAsRead = async (id: string) => {
    await readNotification(id).unwrap();
  };

  const handleMarkAllAsRead = async () => {
    await readAllNotification({});
  };

  const handleDeleteNotice = useCallback(async (id: string) => {
    try {
      await deleteNotification(id).unwrap();
      ToastAndroid.show(
        TEXT_TRANSLATE_NOTICE.MESSAGE_SUCCESS.DELETE_NOTICE_SUCCESSFUL,
        ToastAndroid.SHORT,
      );
      setNotifications((prev) => prev.filter((notice) => notice.id !== id));
      modalizeRef.current?.close();
    } catch (err: any) {
      const error = err?.data;
      if (error?.errorCode === ERROR_CODE.NOTICE_NOT_EXIST) {
        ToastAndroid.show(
          TEXT_TRANSLATE_NOTICE.MESSAGE_ERROR.NOTICE_NOT_EXIST,
          ToastAndroid.SHORT,
        );
        return;
      }
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    }
  }, []);

  const handleOpenMore = useCallback((notice: any) => {
    setSelectedNotice(notice);
    modalizeRef.current?.open();
  }, []);

  const handleRefetchNotice = useCallback(async () => {
    setIsFetchingData(true);
    await refetch();
    setIsFetchingData(false);
  }, []);

  return {
    state: {
      activeTab,
      noticeData: notifications,
      totalCount: data?.totalCount ?? 0,
      totalPages: data?.totalPages ?? 0,
      isLoading,
      isLoadingMore,
      isError,
      error,
      selectedNotice,
      pageSize,
      data,
      modalizeRef,
      isFetchingData,
      isRefetching,
      tabs,
    },
    handler: {
      setActiveTab,
      handleGoBack,
      handleMarkAsRead,
      handleMarkAllAsRead,
      refetch,
      loadMoreData,
      handleOpenMore,
      handleDeleteNotice,
      handleRefetchNotice,
    },
  };
};

export default useNotificationList;
