import { PATH_NAME } from "@/helpers/constants/pathname";
import useHideTabbar from "@/hooks/useHideTabbar";
import { setCurrentGroup } from "@/redux/slices/groupSlice";
import { setGroupTabHidden, setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetGroupsQuery } from "@/services/group";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ToastAndroid } from "react-native";
import { useDispatch } from "react-redux";
import TEXT_TRANSLATE_GROUP_LIST from "../GroupList.translate";
import { Camera } from "expo-camera";
import { Modalize } from "react-native-modalize";

const useGroupList = () => {
  const pageSize = 10;

  const translate = TEXT_TRANSLATE_GROUP_LIST;

  const [visibleItems, setVisibleItems] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [pageIndex, setPageIndex] = useState(1);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);

  const dispatch = useDispatch();

  const { data, isLoading, refetch } = useGetGroupsQuery({
    PageIndex: pageIndex,
    PageSize: pageSize,
  });

  useHideTabbar();

  const handleLoadMore = useCallback(() => {
    if (!isLoading && !isLoadingMore && data?.items.length === pageSize) {
      setIsLoadingMore(true);
      setPageIndex((prev) => prev + 1);
    }
  }, [isLoading, isLoadingMore, data?.items.length]);

  useEffect(() => {
    if (data?.items) {
      setGroups((prevGroups) => {
        const existingIds = new Set(prevGroups.map((item) => item.id));
        const newItems = data.items.filter(
          (item: any) => !existingIds.has(item.id),
        );
        return [...prevGroups, ...newItems];
      });

      setIsFetchingData(false);
      setIsLoadingMore(false);
    }
  }, [data?.items]);

  const handleNavigateAndHideTabbar = useCallback(
    (group: Group) => () => {
      router.navigate(PATH_NAME.GROUP_HOME.GROUP_HOME_DEFAULT as any);
      dispatch(setCurrentGroup(group));
      dispatch(setMainTabHidden(true));
      dispatch(setGroupTabHidden(false));
    },
    [dispatch],
  );

  const handleCreateGroupAndHideTabbar = useCallback(() => {
    dispatch(setMainTabHidden(true));
    router.navigate(PATH_NAME.GROUP.CREATE_GROUP_STEP_1 as any);
  }, [dispatch]);

  const handleBack = useCallback(() => {
    router.back();
    dispatch(setMainTabHidden(false));
  }, [dispatch]);

  const toggleVisibility = useCallback((groupId: string) => {
    setVisibleItems((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  }, []);

  const handleRefetchGrouplist = useCallback(() => {
    if (isRefetching) {
      ToastAndroid.show(
        "Vui lòng đợi trước khi làm mới lại!",
        ToastAndroid.SHORT,
      );
      return;
    }

    setIsRefetching(true);
    refetch().finally(() => {
      setTimeout(() => setIsRefetching(false), 2000);
      ToastAndroid.show("Danh sách đã được cập nhật", ToastAndroid.SHORT);
    });
  }, [refetch, isRefetching]);

  const [isShowScanner, setIsShowScanner] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const modalizeRef = useRef<Modalize>(null);
  const [memberCode, setMemberCode] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
    if (status === "granted") {
      setIsShowScanner(true);
    } else {
      ToastAndroid.show(
        "Vui lòng cấp quyền camera để quét mã QR",
        ToastAndroid.SHORT,
      );
    }
  };

  const handleScanSuccess = async (token: string) => {
    try {
    } catch (error) {
      ToastAndroid.show("Có lỗi xảy ra", ToastAndroid.SHORT);
    }
  };

  const handleScanQR = useCallback(async () => {
    if (!hasPermission) {
      await requestCameraPermission();
    } else {
      setIsShowScanner(true);
    }
  }, [hasPermission]);

  const handleJoinGroup = useCallback(() => {
    modalizeRef.current?.open();
  }, []);

  const handleSubmitJoinGroup = () => {
    if (memberCode.trim()) {
      modalizeRef.current?.close();
      router.replace(PATH_NAME.HOME.HOME_DEFAULT as any);
    } else {
      ToastAndroid.show("Vui lòng nhập mã thành viên", ToastAndroid.SHORT);
    }
  };

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
      isRefetching,
      isShowScanner,
      isLogin,
      modalizeRef,
      memberCode,
    },
    handler: {
      handleLoadMore,
      setGroups,
      toggleVisibility,
      handleNavigateAndHideTabbar,
      handleBack,
      handleCreateGroupAndHideTabbar,
      handleRefetchGrouplist,
      handleSubmitJoinGroup,
      handleJoinGroup,
      handleScanQR,
      handleScanSuccess,
      setMemberCode,
      setIsLogin,
      setIsShowScanner,
    },
  };
};

export default useGroupList;
