import { TRANSACTION_TYPE_TEXT } from "@/helpers/enums/globals";
import { selectCurrentGroup } from "@/redux/slices/groupSlice";
import { selectUserInfo } from "@/redux/slices/userSlice";
import { useGetPendingRequestQuery } from "@/services/group";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modalize } from "react-native-modalize";
import { useSelector } from "react-redux";

const usePendingRequests = () => {
  const currentGroup = useSelector(selectCurrentGroup);
  const userInfo = useSelector(selectUserInfo);
  const detailModalizeRef = useRef<Modalize>(null);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const pageSize = 20;

  const {
    data: pendingRequestsData,
    isLoading: isLoadingRequests,
    refetch: refetchRequests,
    isFetching: isFetchingRequests,
  } = useGetPendingRequestQuery(
    {
      id: currentGroup?.id,
      PageIndex: pageIndex,
      PageSize: pageSize,
    },
    { skip: !currentGroup?.id },
  );

  useEffect(() => {
    if (pendingRequestsData?.data?.data) {
      if (pageIndex === 1) {
        setPendingRequests(pendingRequestsData.data.data);
      } else {
        setPendingRequests((prevRequests) => {
          const existingIds = new Set(prevRequests.map((item) => item.id));
          const newItems = pendingRequestsData.data.data.filter(
            (item: any) => !existingIds.has(item.id),
          );
          return [...prevRequests, ...newItems];
        });
      }
      setIsLoadingMore(false);
    }
  }, [pendingRequestsData, pageIndex]);

  const filteredPendingRequests = useMemo(() => {
    if (!pendingRequests || !userInfo) return [];

    return pendingRequests.filter(
      (request) =>
        request.type === TRANSACTION_TYPE_TEXT.INCOME &&
        request.userId === userInfo.id,
    );
  }, [pendingRequests, userInfo]);

  const handleOpenDetailModal = useCallback((request: any) => {
    setSelectedRequest(request);
    if (detailModalizeRef.current) {
      setTimeout(() => {
        detailModalizeRef.current?.open();
      }, 100);
    }
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    detailModalizeRef.current?.close();
    setTimeout(() => {
      setSelectedRequest(null);
    }, 300);
  }, []);

  const refreshRequests = useCallback(() => {
    setPageIndex(1);
    refetchRequests();
  }, [refetchRequests]);

  const handleLoadMore = useCallback(() => {
    if (
      !isLoadingRequests &&
      !isLoadingMore &&
      pendingRequestsData?.data?.data?.length === pageSize
    ) {
      setIsLoadingMore(true);
      setPageIndex((prev) => prev + 1);
    }
  }, [
    isLoadingRequests,
    isLoadingMore,
    pendingRequestsData?.data?.data?.length,
    pageSize,
  ]);

  return {
    state: {
      pendingRequests: filteredPendingRequests,
      selectedRequest,
      isLoadingRequests,
      isFetchingRequests,
      isLoadingMore,
      detailModalizeRef,
      pageSize,
    },
    handler: {
      handleOpenDetailModal,
      handleCloseDetailModal,
      refreshRequests,
      handleLoadMore,
    },
  };
};

export default usePendingRequests;
