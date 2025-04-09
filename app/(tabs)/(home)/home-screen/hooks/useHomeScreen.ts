import { PATH_NAME } from "@/helpers/constants/pathname";
import { selectHasUnreadNotification } from "@/redux/hooks/systemSelector";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { selectUserInfo } from "@/redux/slices/userSlice";
import { selectCurrentUserSpendingModel } from "@/redux/slices/userSpendingModelSlice";
import { useUpdateFcmTokenMutation } from "@/services/auth";
import { useGetGroupsQuery } from "@/services/group";
import { useGetCurrentUserSpendingModelQuery } from "@/services/userSpendingModel";
import { GroupDetail } from "@/types/group.type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, ToastAndroid } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import HOME_SCREEN_CONSTANTS from "../../HomeScreen.const";

interface ItemType {
  id: string;
  image: any;
  title: string;
  time: string;
}

const useHomeScreen = () => {
  const { POST_DATAS, MENU_ITEMS, GROUP_DATAS } = HOME_SCREEN_CONSTANTS;
  const today = dayjs();
  const startOfMonth = today.startOf("month").format("DD/MM");
  const endOfMonth = today.endOf("month").format("DD/MM/YYYY");
  const currentIndexRef = useRef(0);
  const [isShow, setIsShow] = useState(false);
  const [isShowGroupBalance, setIsShowGroupBalance] = useState<{
    [key: string]: boolean;
  }>({});
  const flatListRef = useRef<FlatList<ItemType>>(null);
  const userInfo = useSelector(selectUserInfo);
  const currentSpendingModel = useSelector(selectCurrentUserSpendingModel);
  const hasUnreadNotification = useSelector(selectHasUnreadNotification);
  const dispatch = useDispatch();
  const { HOME } = PATH_NAME;
  const [updateFcmToken] = useUpdateFcmTokenMutation();
  const [isRefetching, setIsRefetching] = useState(false);

  const { isLoading, refetch: refetchSpendingModel } =
    useGetCurrentUserSpendingModelQuery(undefined, {});

  // group loading
  const {
    data,
    isLoading: isGroupLoading,
    refetch: refetchGroups,
  } = useGetGroupsQuery({ PageIndex: 1, PageSize: 10 });
  const [groupData, setGroupData] = useState<GroupDetail[]>([]);

  useEffect(() => {
    if (data?.items) {
      setGroupData(data.items as GroupDetail[]);
    }
  }, [data]);

  useEffect(() => {
    refetchGroups();
    refetchSpendingModel();
  }, []);

  const toggleVisibility = useCallback(() => {
    setIsShow((prev) => !prev);
  }, []);

  const toggleVisibilityGroupBalance = useCallback((groupId: string) => {
    setIsShowGroupBalance((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      currentIndexRef.current =
        (currentIndexRef.current + 1) % POST_DATAS.length;
      flatListRef.current?.scrollToIndex({
        index: currentIndexRef.current,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [POST_DATAS.length]);

  const handleNavigateAddPersonalIncome = useCallback(() => {
    dispatch(setMainTabHidden(true));
    router.navigate(HOME.PERSONAL_EXPENSES_MODEL as any);
  }, []);

  const handleNavigateMenuItem = (url: string) => {
    dispatch(setMainTabHidden(true));
    router.push(url as any);
  };

  const handleNavigateNotification = useCallback(() => {
    dispatch(setMainTabHidden(true));
    router.navigate(HOME.NOTIFICATION as any);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fcmToken = await AsyncStorage.getItem("fcmToken");
        if (fcmToken) {
          const formValues = JSON.stringify(fcmToken);
          await updateFcmToken(formValues).unwrap();
        }
      } catch (err) {}
    };
    fetchData();
  }, []);

  const handleRefetch = useCallback(async () => {
    if (isRefetching) {
      ToastAndroid.show(
        "Vui lòng đợi trước khi làm mới lại!",
        ToastAndroid.SHORT,
      );
      return;
    }

    setIsRefetching(true);

    try {
      await Promise.all([refetchGroups(), refetchSpendingModel()]);
      ToastAndroid.show("Cập nhật thành công", ToastAndroid.SHORT);
    } finally {
      setTimeout(() => setIsRefetching(false), 2000);
    }
  }, [refetchGroups, refetchSpendingModel, isRefetching]);

  return {
    state: {
      isShow,
      currentIndex: currentIndexRef,
      POST_DATAS,
      MENU_ITEMS,
      GROUP_DATAS,
      today,
      startOfMonth,
      endOfMonth,
      flatListRef,
      userInfo,
      currentSpendingModel,
      isLoadingSpendingModel: isLoading,
      groupData,
      isGroupLoading,
      isShowGroupBalance,
      hasUnreadNotification,
    },
    handler: {
      toggleVisibility,
      handleNavigateAddPersonalIncome,
      handleNavigateMenuItem,
      toggleVisibilityGroupBalance,
      handleNavigateNotification,
      handleRefetch,
    },
  };
};

export default useHomeScreen;
