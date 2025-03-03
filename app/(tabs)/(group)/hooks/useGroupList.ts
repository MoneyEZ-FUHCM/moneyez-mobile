import { useCallback, useEffect, useState } from "react";
import { useGetGroupsQuery } from "@/services/group";
import TEXT_TRANSLATE_GROUP_LIST from "../GroupList.translate";
import { useDispatch } from "react-redux";
import { router } from "expo-router";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { setGroupTabHidden, setMainTabHidden } from "@/redux/slices/tabSlice";

const useGroupList = () => {
  const pageSize = 10;
  // constants
  const translate = TEXT_TRANSLATE_GROUP_LIST;

  // state
  const [visible, setVisible] = useState(false);

  // hooks
  const dispatch = useDispatch();
  // state
  const [pageIndex, setPageIndex] = useState(1);
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // hooks
  const { data, isLoading } = useGetGroupsQuery({
    PageIndex: pageIndex,
    PageSize: pageSize,
  });
  const totalCount = data?.totalCount || 0;

  // handlers
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
        return [...prev, ...newItems];
      });
      setIsLoadingMore(false);
    }
  }, [data?.items]);

  const handleNavigateAndHideTabbar = useCallback(() => {
    router.navigate(PATH_NAME.GROUP_HOME.GROUP_HOME_DEFAULT as any);
    dispatch(setMainTabHidden(true));
    dispatch(setGroupTabHidden(false));
  }, []);

  return {
    state: {
      groups,
      isLoading,
      isLoadingMore,
      translate,
      visible,
    },
    handler: {
      handleLoadMore,
      dispatch,
      setGroups,
      setVisible,
      handleNavigateAndHideTabbar,
    },
  };
};

export default useGroupList;
