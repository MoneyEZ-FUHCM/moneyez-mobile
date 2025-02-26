import { selectUserInfo } from "@/redux/slices/userSlice";
import dayjs from "dayjs";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import HOME_SCREEN_CONSTANTS from "../HomeScreen.const";
import { setHiddenTabbar } from "@/redux/slices/tabSlice";
import { router } from "expo-router";
import { PATH_NAME } from "@/helpers/constants/pathname";

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
  const flatListRef = useRef<FlatList<ItemType>>(null);
  const userInfo = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  const { HOME } = PATH_NAME;

  const toggleVisibility = useCallback(() => {
    setIsShow((prev) => !prev);
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
    dispatch(setHiddenTabbar(true));
    router.navigate(HOME.PERSONAL_EXPENSES_MODEL as any);
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
    },
    handler: {
      toggleVisibility,
      handleNavigateAddPersonalIncome,
    },
  };
};

export default useHomeScreen;
