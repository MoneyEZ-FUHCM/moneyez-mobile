import { useMemo } from 'react';
import { useGetNotificationQuery, useReadAllNotificationMutation, useReadNotificationMutation } from '@/services/notification';
import { formatDate, formatTime } from '@/helpers/libs';
import { router } from 'expo-router';
import { useDispatch } from "react-redux";
import { setMainTabHidden } from '@/redux/slices/tabSlice';

const useNotificationList = (pageIndex = 1, pageSize = 20) => {
  const { data, isLoading, refetch, isError, error } = useGetNotificationQuery({
    PageIndex: pageIndex,
    PageSize: pageSize,
  });
  const dispatch = useDispatch();

  const [readNotification] = useReadNotificationMutation();
  const [readAllNotification] = useReadAllNotificationMutation();

  const handleGoBack = () => {
    router.back();
    dispatch(setMainTabHidden(false));
  };

  const noticeData = useMemo(() => {
    return (
      data?.items?.map((notice) => ({
        id: notice.id,
        title: notice.title,
        message: notice.message,
        isRead: notice.isRead,
        formattedDate: formatDate(notice.createdDate),
        formattedTime: formatTime(notice.createdDate),
      })) || []
    );
  }, [data]);

  const handleMarkAsRead = async (id: string) => {
    await readNotification(id);
    refetch();
  };

  const handleMarkAllAsRead = async () => {
    await readAllNotification({});
    refetch();
  };

  return {
    state: {
      noticeData,
      totalCount: data?.totalCount,
      totalPages: data?.totalPages,
      isLoading,
      isError,
      error,
    },
    handler: {
      handleGoBack,
      handleMarkAsRead,
      handleMarkAllAsRead,
      refetch,
    },
  };
};

export default useNotificationList;
