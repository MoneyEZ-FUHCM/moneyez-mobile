import { setGroupTabHidden } from "@/redux/slices/tabSlice";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";

const useHideGroupTabbar = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      dispatch(setGroupTabHidden(true));
      return () => {
        dispatch(setGroupTabHidden(false));
      };
    }, [dispatch]),
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      dispatch(setGroupTabHidden(false));
    });
    return unsubscribe;
  }, [navigation, dispatch]);
};

export default useHideGroupTabbar;
