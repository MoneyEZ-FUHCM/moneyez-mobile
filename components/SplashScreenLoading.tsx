import { appInfo } from "@/helpers/constants/appInfos";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, SafeAreaView, StyleSheet } from "react-native";
import { SplashScreen } from "./SplashScreenCustom/SplashScreen";

const SplashScreenLoading = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(-50)).current;
  const [isLoading, setIsLoading] = useState(true);

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

    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return !isLoading ? (
    <SplashScreen />
  ) : (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.animateContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }],
          },
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
