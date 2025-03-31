import LogoApp from "@/assets/images/logo/logo_app.png";
import "@/globals.css";
import { appInfo } from "@/helpers/constants/appInfos";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { CarouselItem } from "./components/CarouselItem";
import { SPLASH_SCREEN_CONSTANT } from "./SplashScreen.const";
import { TEXT_TRANSLATE } from "./SplashScreen.translate";

const SplashScreen = () => {
  const { PATH_LOGIN, CAROUSELS } = SPLASH_SCREEN_CONSTANT;

  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = new Animated.Value(0);

  const handleSnapToItem = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  return (
    <View className="bg-white">
      <View
        style={{ height: appInfo.sizes.HEIGHT * 0.7 }}
        className="relative bg-white"
      >
        <View className="absolute inset-0 left-0 right-0 top-5 items-center justify-center">
          <Image source={LogoApp} className="h-28 w-28" resizeMode="contain" />
        </View>
        <Carousel
          data={CAROUSELS}
          renderItem={({ item }) => <CarouselItem item={item} />}
          sliderWidth={appInfo.sizes.WIDTH}
          itemWidth={appInfo.sizes.WIDTH * 0.8}
          onSnapToItem={handleSnapToItem}
          autoplay
          loop
          vertical={false}
          autoplayDelay={3000}
          autoplayInterval={3000}
        />
        <Pagination
          dotsLength={CAROUSELS.length}
          activeDotIndex={currentIndex}
          containerStyle={styles.paginationContainer}
          dotStyle={styles.activeDot}
          inactiveDotStyle={styles.inactiveDot}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
      </View>
      <View
        style={{ height: appInfo.sizes.HEIGHT * 0.3 }}
        className="relative items-center justify-center rounded-t-[65px] bg-primary px-10"
      >
        <View className="absolute top-10 w-full flex-1 items-center justify-center">
          <Animated.Text
            style={{ opacity: fadeAnim }}
            className="mb-1 text-center text-3xl font-bold text-superlight"
          >
            {CAROUSELS[currentIndex].title}
          </Animated.Text>
          <Animated.Text
            style={{ opacity: fadeAnim }}
            className="text-center text-gray-200"
          >
            {CAROUSELS[currentIndex].description}
          </Animated.Text>
        </View>
        <View className="absolute bottom-1/4 w-4/5">
          <Pressable
            className="w-full rounded-lg bg-superlight px-3 py-3 shadow-md"
            onPress={() => router.navigate(PATH_LOGIN as any)}
          >
            <Text className="text-center font-bold text-primary">
              {TEXT_TRANSLATE.EXPERIENCE_NOW}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    position: "relative",
    bottom: 10,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#609084",
  },
  inactiveDot: {
    backgroundColor: "gray",
  },
});

export { SplashScreen };
