import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";

const useHideTabbar = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      dispatch(setMainTabHidden(true));
      return () => {
        dispatch(setMainTabHidden(false));
      };
    }, [dispatch]),
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      dispatch(setMainTabHidden(false));
    });
    return unsubscribe;
  }, [navigation, dispatch]);
};

export default useHideTabbar;
