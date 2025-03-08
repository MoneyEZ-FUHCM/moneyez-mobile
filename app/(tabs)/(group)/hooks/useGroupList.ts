import { PATH_NAME } from "@/helpers/constants/pathname";
import { setGroupTabHidden, setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetGroupsQuery } from "@/services/group";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import TEXT_TRANSLATE_GROUP_LIST from "../GroupList.translate";

const useGroupList = () => {
  const pageSize = 10;
  const translate = TEXT_TRANSLATE_GROUP_LIST;

  // State
  const [visible, setVisible] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);

  const dispatch = useDispatch();

  const { data, isLoading } = useGetGroupsQuery({
    PageIndex: pageIndex,
    PageSize: pageSize,
  });

  const totalCount = useMemo(() => data?.totalCount || 0, [data?.totalCount]);

  // Load more handler
  const handleLoadMore = useCallback(() => {
    if (groups.length < totalCount && !isLoadingMore) {
      setIsLoadingMore(true);
      setPageIndex((prev) => prev + 1);
    }
  }, [groups.length, totalCount, isLoadingMore]);

  useEffect(() => {
    if (data?.items?.length) {
      setGroups((prev) => {
        const newItems = data.items.filter(
          (item: any) => !prev.some((existing) => existing.id === item.id),
        );
        return newItems.length ? [...prev, ...newItems] : prev;
      });
      setIsFetchingData(false);
      setIsLoadingMore(false);
    } else if (!isLoading) {
      setIsFetchingData(false);
    }
  }, [data?.items, isLoading]);

  const handleNavigateAndHideTabbar = useCallback(
    (groupId: string) => {
      router.navigate(
        `${PATH_NAME.GROUP_HOME.GROUP_HOME_DEFAULT}?groupId=${groupId}` as any,
      );
      dispatch(setMainTabHidden(true));
      dispatch(setGroupTabHidden(false));
    },
    [dispatch],
  );

  return {
    state: {
      groups,
      isLoading,
      isLoadingMore,
      isFetchingData,
      translate,
      visible,
    },
    handler: {
      handleLoadMore,
      setGroups,
      setVisible: useCallback(setVisible, []),
      handleNavigateAndHideTabbar,
    },
  };
};

export default useGroupList;
