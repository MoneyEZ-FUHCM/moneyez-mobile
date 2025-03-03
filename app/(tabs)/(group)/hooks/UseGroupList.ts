import { useCallback, useEffect, useState } from "react";
import { ToastAndroid } from "react-native";
import { useDispatch } from "react-redux";
import {
  useCreateGroupMutation,
  useDeleteGroupMutation,
  useGetGroupsQuery,
  useUpdateGroupMutation,
} from "@/services/group";
import { setLoading } from "@/redux/slices/loadingSlice";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import TEXT_TRANSLATE_GROUP_LIST from "../GroupList.translate";

const useGroupList = () => {
  const pageSize = 10;
  const dispatch = useDispatch();
  const { MESSAGE_SUCCESS, MESSAGE_ERROR } = TEXT_TRANSLATE_GROUP_LIST;
  const { HTTP_STATUS, SYSTEM_ERROR } = COMMON_CONSTANT;

  // state
  const [pageIndex, setPageIndex] = useState(1);
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // hooks
  const { data, isLoading } = useGetGroupsQuery({
    PageIndex: pageIndex,
    PageSize: pageSize,
  });
  const [createGroup] = useCreateGroupMutation();
  const [updateGroup] = useUpdateGroupMutation();
  const [deleteGroup] = useDeleteGroupMutation();

  // derived state
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

  const handleCreateGroup = useCallback(
    async (payload: any) => {
      dispatch(setLoading(true));
      try {
        const res = await createGroup(payload).unwrap();
        if (res && res.status === HTTP_STATUS.SUCCESS.CREATED) {
          ToastAndroid.show(
            MESSAGE_SUCCESS.CREATE_GROUP_SUCCESSFUL,
            ToastAndroid.CENTER,
          );
          setGroups((prev) => [res.data, ...prev]);
        }
      } catch (err: any) {
        ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [
      createGroup,
      dispatch,
      MESSAGE_SUCCESS.CREATE_GROUP_SUCCESSFUL,
      SYSTEM_ERROR.SERVER_ERROR,
    ],
  );

  const handleUpdateGroup = useCallback(
    async (payload: any) => {
      dispatch(setLoading(true));
      try {
        const res = await updateGroup(payload).unwrap();
        if (res && res.status === HTTP_STATUS.SUCCESS.OK) {
          ToastAndroid.show(
            MESSAGE_SUCCESS.UPDATE_GROUP_SUCCESSFUL,
            ToastAndroid.CENTER,
          );
          setGroups((prev) =>
            prev.map((group) => (group.id === payload.id ? res.data : group)),
          );
        }
      } catch (err: any) {
        ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [
      updateGroup,
      dispatch,
      MESSAGE_SUCCESS.UPDATE_GROUP_SUCCESSFUL,
      SYSTEM_ERROR.SERVER_ERROR,
    ],
  );

  const handleDeleteGroup = useCallback(
    async (id: string) => {
      dispatch(setLoading(true));
      try {
        const res = await deleteGroup(id).unwrap();
        if (res && res.status === HTTP_STATUS.SUCCESS.OK) {
          ToastAndroid.show(
            MESSAGE_SUCCESS.DELETE_GROUP_SUCCESSFUL,
            ToastAndroid.CENTER,
          );
          setGroups((prev) => prev.filter((group) => group.id !== id));
        }
      } catch (err: any) {
        ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [
      deleteGroup,
      dispatch,
      MESSAGE_SUCCESS.DELETE_GROUP_SUCCESSFUL,
      SYSTEM_ERROR.SERVER_ERROR,
    ],
  );

  return {
    state: {
      groups,
      isLoading,
      isLoadingMore,
    },
    handler: {
      handleLoadMore,
      handleCreateGroup,
      handleUpdateGroup,
      handleDeleteGroup,
    },
  };
};

export default useGroupList;
