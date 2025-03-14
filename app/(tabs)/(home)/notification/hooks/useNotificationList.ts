import { useState, useEffect, useCallback } from 'react';
import {
  useGetNotificationQuery,
  useReadAllNotificationMutation,
  useReadNotificationMutation,
} from '@/services/notification';
import { formatDate, formatTime } from '@/helpers/libs';
import { router } from 'expo-router';
import { Dimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { setMainTabHidden } from '@/redux/slices/tabSlice';

type NotificationTabType = 'all' | string;

interface QueryParams {
  PageIndex: number;
  PageSize: number;
  type?: string;
}

const useNotificationList = (
  initialActiveTab: NotificationTabType = 'all',
  initialPageIndex = 1,
  pageSize = 20
) => {
  // UI States
  const [activeTab, setActiveTab] = useState<NotificationTabType>(initialActiveTab);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [selectedNoticeId, setSelectedNoticeId] = useState('');
  const [anchorPosition, setAnchorPosition] = useState({ x: 0, y: 0 });
  const [dialogDimensions, setDialogDimensions] = useState({ width: 0, height: 0 });

  // Data States
  const [pageIndex, setPageIndex] = useState(initialPageIndex);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Build query parameters using activeTab (omit type if "all")
  const queryParams: QueryParams = { PageIndex: pageIndex, PageSize: pageSize };
  if (activeTab !== 'all') {
    queryParams.type = activeTab;
  }

  const { data, isLoading, refetch, isError, error } = useGetNotificationQuery(queryParams);
  const dispatch = useDispatch();
  const [readNotification] = useReadNotificationMutation();
  const [readAllNotification] = useReadAllNotificationMutation();

  // When navigating back, close any open modal first.
  const handleGoBack = () => {
    if (showMoreModal) {
      setShowMoreModal(false);
    }
    router.back();
    dispatch(setMainTabHidden(false));
  };

  // Update notifications when new data arrives
  useEffect(() => {
    if (data?.items) {
      setNotifications(prev => {
        const newNotifications = data.items.map((notice: any) => ({
          id: notice.id,
          title: notice.title,
          type: notice.type,
          message: notice.message.toLowerCase(),
          isRead: notice.isRead,
          formattedDate: formatDate(notice.createdDate),
          formattedTime: formatTime(notice.createdDate),
        }));
        return pageIndex === 1 ? newNotifications : [
          ...prev,
          ...newNotifications.filter(newNoti => !prev.some(oldNoti => oldNoti.id === newNoti.id)),
        ];
      });
    }
    setIsLoadingMore(false);
  }, [data?.items, pageIndex]);

  // Infinite scroll: load more if current page is full
  const loadMoreData = useCallback(() => {
    if (!isLoading && !isLoadingMore && data?.items?.length === pageSize) {
      setIsLoadingMore(true);
      setPageIndex(prev => prev + 1);
    }
  }, [data?.items, isLoading, isLoadingMore, pageSize]);

  const handleMarkAsRead = async (id: string) => {
    await readNotification(id);
    refetch();
  };

  const handleMarkAllAsRead = async () => {
    await readAllNotification({});
    refetch();
  };

  // UI helper to open the modal. Call this with the notification id and the pageX, pageY positions.
  const handleOpenMore = useCallback((id: string, pageX: number, pageY: number) => {
    setSelectedNoticeId(id);
    setAnchorPosition({ x: pageX, y: pageY });
    setShowMoreModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowMoreModal(false);
  }, []);

  // Returns the style for positioning the modal dialog.
  const getDialogStyle = useCallback(() => {
    const offset = 10;
    const { height: windowHeight, width: windowWidth } = Dimensions.get('window');
    let top;
    if (anchorPosition.y + dialogDimensions.height + offset > windowHeight) {
      top = anchorPosition.y - dialogDimensions.height - offset;
    } else {
      top = anchorPosition.y + offset;
    }
    const right = windowWidth - anchorPosition.x;
    return { position: 'absolute' as const, top, right };
  }, [anchorPosition, dialogDimensions]);

  return {
    state: {
      activeTab,
      noticeData: notifications,
      totalCount: data?.totalCount || 0,
      totalPages: data?.totalPages || 0,
      isLoading,
      isLoadingMore,
      isError,
      error,
      showMoreModal,
      selectedNoticeId,
      anchorPosition,
      dialogDimensions,
    },
    handler: {
      setActiveTab,
      handleGoBack,
      handleMarkAsRead,
      handleMarkAllAsRead,
      refetch,
      loadMoreData,
      handleOpenMore,
      closeModal,
      setDialogDimensions,
      getDialogStyle,
    },
  };
};

export default useNotificationList;
