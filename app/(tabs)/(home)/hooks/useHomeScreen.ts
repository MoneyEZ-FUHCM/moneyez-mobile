import dayjs from "dayjs";
import HOME_SCREEN_CONSTANTS from "../HomeScreen.const";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList } from "react-native";

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

  const [isShow, setIsShow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<ItemType>>(null);

  const toggleVisibility = useCallback(() => {
    setIsShow((prev) => !prev);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex =
          prevIndex + 1 >= POST_DATAS.length ? 0 : prevIndex + 1;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [POST_DATAS.length]);

  return {
    state: {
      isShow,
      currentIndex,
      POST_DATAS,
      MENU_ITEMS,
      GROUP_DATAS,
      today,
      startOfMonth,
      endOfMonth,
      flatListRef,
    },
    handler: {
      toggleVisibility,
    },
  };
};

export default useHomeScreen;
