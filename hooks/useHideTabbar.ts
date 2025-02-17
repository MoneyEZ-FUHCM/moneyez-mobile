import { setHiddenTabbar } from "@/redux/slices/tabSlice";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";

const useHideTabbar = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      dispatch(setHiddenTabbar(true));
      return () => {
        dispatch(setHiddenTabbar(false));
      };
    }, [dispatch]),
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      dispatch(setHiddenTabbar(false));
    });
    return unsubscribe;
  }, [navigation, dispatch]);
};

export default useHideTabbar;
