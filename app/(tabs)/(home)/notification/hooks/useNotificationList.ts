import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { formatDate, formatTime } from "@/helpers/libs";
import { setHasUnreadNotification } from "@/redux/slices/systemSlice";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import {
  useDeleteNotificationMutation,
  useGetNotificationQuery,
  useLazyReadNotificationQuery,
  useReadAllNotificationMutation,
} from "@/services/notification";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, Linking, ToastAndroid } from "react-native";
import { Modalize } from "react-native-modalize";
import { useDispatch } from "react-redux";
import NOTIFICATION_CONSTANTS from "../NotificationList.const";
import TEXT_TRANSLATE_NOTICE from "../NotificationList.translate";
import useHideTabbar from "@/helpers/hooks/useHideTabbar";

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

const useNotificationList = (isHidden: boolean = false) => {
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

  const [triggerReadNotification] = useLazyReadNotificationQuery();
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

  // useFocusEffect(
  //   useCallback(() => {
  //     if (!isHidden) {
  //       dispatch(setMainTabHidden(true));
  //     }
  //   }, [dispatch]),
  // );

  const formatNotifications = (items: any[]) => {
    return items?.map((notice: any) => ({
      id: notice?.id,
      title: notice?.title,
      type: notice?.type,
      message: notice?.message?.toLowerCase(),
      isRead: notice?.isRead,
      formattedDate: formatDate(notice?.createdDate),
      formattedTime: formatTime(notice?.createdDate),
      href: notice?.href,
    }));
  };

  useEffect(() => {
    if (notifications?.length > 0) {
      setNotifications([]);
      setPageIndex(1);
    }
  }, [activeTab]);

  useEffect(() => {
    if (data?.items) {
      if (isFetchingData) {
        setNotifications(formatNotifications(data.items));
        setPageIndex(1);
      } else {
        setNotifications((prev) => {
          const newNotifications = formatNotifications(data.items);
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

  useEffect(() => {
    if (data?.items) {
      const hasUnread = data.items?.some((notice: any) => !notice?.isRead);
      dispatch(setHasUnreadNotification(hasUnread));
    }
  }, [data?.items, dispatch]);

  const handleGoBack = () => {
    router.back();
    dispatch(setMainTabHidden(false));
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleGoBack();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [handleGoBack]),
  );

  const loadMoreData = useCallback(() => {
    if (!isLoading && !isLoadingMore && data?.items?.length === pageSize) {
      setIsLoadingMore(true);
      setPageIndex((prev) => prev + 1);
    }
  }, [data?.items.length, isLoading, isLoadingMore, pageSize]);

  const handleMarkAsRead = useCallback(
    async (id: string) => {
      try {
        await triggerReadNotification(id).unwrap();
        await refetch();
        setNotifications((prev) =>
          prev.map((notice) =>
            notice.id === id ? { ...notice, isRead: true } : notice,
          ),
        );

        const remainingUnread = notifications.some(
          (notice) => notice.id !== id && !notice.isRead,
        );
        dispatch(setHasUnreadNotification(remainingUnread));

        ToastAndroid.show(
          "Đánh dấu thông báo đã đọc thành công",
          ToastAndroid.SHORT,
        );
        modalizeRef.current?.close();
      } catch (err) {
        ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
      }
    },
    [notifications, dispatch, refetch],
  );

  const handleMarkAllAsRead = async () => {
    try {
      await readAllNotification({}).unwrap();
      setNotifications((prev) =>
        prev.map((notice) => ({ ...notice, isRead: true })),
      );
      dispatch(setHasUnreadNotification(false));
    } catch (err) {
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    }
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

  const handlePressNotification = useCallback((item: any) => {
    if (item?.href) {
      Linking.openURL(item.href);
      router.replace(PATH_NAME.HOME.HOME_DEFAULT as any);
    }
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
      handlePressNotification,
    },
  };
};

export default useNotificationList;
