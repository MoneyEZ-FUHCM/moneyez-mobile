import { useCallback, useEffect, useState } from "react";
import { useGetGroupsQuery } from "@/services/group";
import TEXT_TRANSLATE_GROUP_LIST from "../GroupList.translate";
import { useDispatch } from "react-redux";

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
    },
  };
};

export default useGroupList;
