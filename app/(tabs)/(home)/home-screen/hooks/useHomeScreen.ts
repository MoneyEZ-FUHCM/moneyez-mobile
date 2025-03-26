import { PATH_NAME } from "@/helpers/constants/pathname";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { selectUserInfo } from "@/redux/slices/userSlice";
import { selectCurrentUserSpendingModel } from "@/redux/slices/userSpendingModelSlice";
import { useUpdateFcmTokenMutation } from "@/services/auth";
import { useGetGroupsQuery } from "@/services/group";
import { useGetCurrentUserSpendingModelQuery } from "@/services/userSpendingModel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList } from "react-native";
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
  const dispatch = useDispatch();
  const { HOME } = PATH_NAME;
  const [updateFcmToken] = useUpdateFcmTokenMutation();

  const { isLoading, refetch: refetchSpendingModel } =
    useGetCurrentUserSpendingModelQuery(undefined, {});

  // group loading
  const {
    data,
    isLoading: isGroupLoading,
    refetch: refetchGroups,
  } = useGetGroupsQuery({ PageIndex: 1, PageSize: 10 });
  const [groupData, setGroupData] = useState<Group[]>([]);

  useEffect(() => {
    if (data?.items) {
      setGroupData(data.items as Group[]);
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
    },
    handler: {
      toggleVisibility,
      handleNavigateAddPersonalIncome,
      handleNavigateMenuItem,
      toggleVisibilityGroupBalance,
      handleNavigateNotification,
    },
  };
};

export default useHomeScreen;
