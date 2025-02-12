import { appInfo } from "@/helpers/constants/appInfos";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { setShowSplash } from "@/redux/slices/loadingSlice";
import { RootState } from "@/redux/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Image, SafeAreaView, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SplashScreen } from "./SplashScreenCustom/SplashScreen";

const SplashScreenLoading = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(-50)).current;
  const dispatch = useDispatch();
  const isShowSplash = useSelector(
    (state: RootState) => state.loading.isShowSplash,
  );

  useEffect(() => {
    const checkTokenAndNavigate = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");

        setTimeout(() => {
          if (token) {
            router.replace(PATH_NAME.HOME.HOME_DEFAULT as any);
          } else {
            dispatch(setShowSplash(true));
          }
        }, 2500);
      } catch (error) {}
    };

    checkTokenAndNavigate();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (isShowSplash) return <SplashScreen />;

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.animateContainer,
          { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] },
        ]}
      >
        <Image
          source={require("@/assets/images/logo/logo_app.png")}
          style={styles.image}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animateContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: appInfo.sizes.WIDTH * 0.5,
    height: appInfo.sizes.HEIGHT * 0.5,
    resizeMode: "contain",
  },
});

export { SplashScreenLoading };
