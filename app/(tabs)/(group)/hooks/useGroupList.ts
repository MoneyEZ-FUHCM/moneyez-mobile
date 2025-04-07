import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { isValidGUID } from "@/helpers/libs";
import useHideTabbar from "@/hooks/useHideTabbar";
import { setLoading } from "@/redux/slices/loadingSlice";
import { setGroupTabHidden, setMainTabHidden } from "@/redux/slices/tabSlice";
import {
  useGetGroupDetailQuery,
  useGetGroupsQuery,
  useInviteMemberQRCodeMutation,
  useLazyInviteMemberQRCodeAcceptQuery,
} from "@/services/group";
import { GroupDetail } from "@/types/group.type";
import { Camera } from "expo-camera";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ToastAndroid } from "react-native";
import { Modalize } from "react-native-modalize";
import { useDispatch } from "react-redux";
import TEXT_TRANSLATE_GROUP_LIST from "../GroupList.translate";

const useGroupList = () => {
  const pageSize = 10;
  const translate = TEXT_TRANSLATE_GROUP_LIST;

  const [visibleItems, setVisibleItems] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [pageIndex, setPageIndex] = useState(1);
  const [groups, setGroups] = useState<GroupDetail[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const isScanningRef = useRef(false);
  const [token, setToken] = useState("");
  const { SYSTEM_ERROR } = COMMON_CONSTANT;
  const { data: groupDetailPreview, isFetching } = useGetGroupDetailQuery(
    { id: token },
    { skip: !token },
  );
  const [inviteMemberByQRCode] = useInviteMemberQRCodeMutation();
  const [trigger] = useLazyInviteMemberQRCodeAcceptQuery();

  const [isShowScanner, setIsShowScanner] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const modalizeRef = useRef<Modalize>(null);
  const modalizeJoinGroupRef = useRef<Modalize>(null);
  const [memberCode, setMemberCode] = useState("");
  const [isLogin, setIsLogin] = useState(false);
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
      if (isRefetching) {
        setGroups(data?.items);
        setPageIndex(1);
      } else {
        setGroups((prevGroups) => {
          const existingIds = new Set(prevGroups.map((item) => item.id));
          const newItems = data.items.filter(
            (item: any) => !existingIds.has(item.id),
          );
          return [...prevGroups, ...newItems];
        });
      }

      setIsFetchingData(false);
      setIsLoadingMore(false);
    }
  }, [data?.items, isRefetching]);

  const handleNavigateAndHideTabbar = useCallback(
    (group: GroupDetail) => () => {
      router.navigate({
        pathname: PATH_NAME.GROUP_HOME.GROUP_HOME_DEFAULT as any,
        params: { id: group?.id },
      });
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

  const handleRefetchGrouplist = useCallback(async () => {
    if (isRefetching) {
      ToastAndroid.show(
        "Vui lòng đợi trước khi làm mới lại!",
        ToastAndroid.SHORT,
      );
      return;
    }

    setIsRefetching(true);
    setPageIndex(1);
    await refetch().finally(() => {
      setTimeout(() => setIsRefetching(false), 2000);
      ToastAndroid.show("Danh sách đã được cập nhật", ToastAndroid.SHORT);
    });
  }, [refetch, isRefetching]);

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

  const handleScanSuccess = async (scannedToken: string) => {
    if (isScanningRef.current) return;
    isScanningRef.current = true;

    try {
      if (!scannedToken || !isValidGUID(scannedToken)) {
        ToastAndroid.show("Dữ liệu không hợp lệ", ToastAndroid.SHORT);
        setIsShowScanner(false);
        dispatch(setLoading(false));
        isScanningRef.current = false;
        return;
      }

      setToken(scannedToken);
      dispatch(setLoading(true));
      setIsShowScanner(false);

      while (isFetching) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      if (data?.items?.some((group) => group?.id === scannedToken)) {
        dispatch(setLoading(false));
        isScanningRef.current = false;
        router.navigate({
          pathname: PATH_NAME.GROUP_HOME.GROUP_HOME_DEFAULT as any,
          params: { id: scannedToken },
        });
        ToastAndroid.show(
          TEXT_TRANSLATE_GROUP_LIST.MESSAGE_ERROR.ALREADY_JOIN_GROUP,
          ToastAndroid.SHORT,
        );
        return;
      }
      if (groupDetailPreview?.data) {
        dispatch(setLoading(false));
        modalizeJoinGroupRef.current?.open();
      } else {
        ToastAndroid.show("Dữ liệu nhóm không hợp lệ", ToastAndroid.SHORT);
        setIsShowScanner(false);
      }
    } catch (error) {
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
      dispatch(setLoading(false));
      setToken("");
      setIsShowScanner(false);
    } finally {
      isScanningRef.current = false;
      dispatch(setLoading(false));
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

  const handleJoinGroupByQR = useCallback(async () => {
    if (!token || !groupDetailPreview?.data) return;

    try {
      await trigger(token).unwrap();
      router.navigate({
        pathname: PATH_NAME.GROUP_HOME.GROUP_HOME_DEFAULT as any,
        params: { id: token },
      });
      setToken("");
      dispatch(setMainTabHidden(true));
      dispatch(setGroupTabHidden(false));

      ToastAndroid.show(
        TEXT_TRANSLATE_GROUP_LIST.MESSAGE_SUCCESS.JOIN_GROUP_SUCCESSFUL,
        ToastAndroid.SHORT,
      );
    } catch (err: any) {
      if (err?.data?.statusCode === 400) {
        ToastAndroid.show("Mã thành viên không hợp lệ", ToastAndroid.SHORT);
        return;
      }
      ToastAndroid.show(SYSTEM_ERROR.SERVER_ERROR, ToastAndroid.SHORT);
    } finally {
      modalizeJoinGroupRef.current?.close();
      isScanningRef.current = false;
      setToken("");
    }
  }, [dispatch, groupDetailPreview, token, router]);

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
      groupDetailPreview: groupDetailPreview?.data,
      modalizeJoinGroupRef,
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
      handleJoinGroupByQR,
      setMemberCode,
      setIsLogin,
      setIsShowScanner,
    },
  };
};

export default useGroupList;
