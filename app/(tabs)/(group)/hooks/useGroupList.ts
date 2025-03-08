import { PATH_NAME } from "@/helpers/constants/pathname";
import { setGroupTabHidden, setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetGroupsQuery } from "@/services/group";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import TEXT_TRANSLATE_GROUP_LIST from "../GroupList.translate";

const useGroupList = () => {
  const pageSize = 10;

  const translate = TEXT_TRANSLATE_GROUP_LIST;

  // State
  const [visibleItems, setVisibleItems] = useState<{ [key: string]: boolean }>(
    {},
  );

  const [pageIndex, setPageIndex] = useState(1);
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);

  const dispatch = useDispatch();

  const { data, isLoading } = useGetGroupsQuery({
    PageIndex: pageIndex,
    PageSize: pageSize,
  });

  useFocusEffect(
    useCallback(() => {
      dispatch(setMainTabHidden(true));

      return () => {
        dispatch(setMainTabHidden(false));
      };
    }, [dispatch]),
  );

  const totalCount = useMemo(() => data?.totalCount || 0, [data?.totalCount]);

  // Load more handler
  const handleLoadMore = useCallback(() => {
    if (!isLoading && !isLoadingMore && data?.items.length === pageSize) {
      setIsLoadingMore(true);
      setPageIndex((prev) => prev + 1);
    }
  }, [groups.length, totalCount, isLoadingMore]);

  useEffect(() => {
    if (data?.items) {
      setGroups((prevGroups) => [...prevGroups, ...data.items]);
      setIsFetchingData(false);
      setIsLoadingMore(false);
    }
  }, [data]);

  const handleNavigateAndHideTabbar = useCallback(() => {
    router.navigate(PATH_NAME.GROUP_HOME.GROUP_HOME_DEFAULT as any);
    dispatch(setMainTabHidden(true));
    dispatch(setGroupTabHidden(false));
  }, [dispatch]);

  const handleCreateGroupAndHideTabbar = () => {
    dispatch(setMainTabHidden(true));
    router.navigate(PATH_NAME.GROUP.CREATE_GROUP_STEP_1 as any);
  };

  const handleBack = () => {
    router.back();
    dispatch(setMainTabHidden(false));
  };

  const toggleVisibility = useCallback((groupId: string) => {
    setVisibleItems((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  }, []);

  return {
    state: {
      groups,
      isLoading,
      isLoadingMore,
      isFetchingData,
      translate,
      visibleItems,
      pageSize,
      data,
    },
    handler: {
      handleLoadMore,
      setGroups,
      toggleVisibility,
      handleNavigateAndHideTabbar,
      handleBack,
      handleCreateGroupAndHideTabbar,
    },
  };
};

export default useGroupList;
