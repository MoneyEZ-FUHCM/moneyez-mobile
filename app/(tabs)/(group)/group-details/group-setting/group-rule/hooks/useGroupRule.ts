import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { BackHandler } from "react-native";
import { useDispatch } from "react-redux";

const useGroupRule = () => {
  const dispatch = useDispatch();

  const handleBack = useCallback(() => {
    router.back();
    dispatch(setGroupTabHidden(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleBack();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [handleBack]),
  );

  return {
    state: {},
    handler: {
      handleBack,
    },
  };
};

export default useGroupRule;
