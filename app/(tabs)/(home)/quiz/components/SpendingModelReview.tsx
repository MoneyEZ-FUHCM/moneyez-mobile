import { appInfo } from "@/helpers/constants/appInfos";
import { Colors } from "@/helpers/constants/color";
import { useGetSpendingModelQuery } from "@/services/spendingModel";
import { SpendingModelData } from "@/helpers/types/spendingModel.types";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { Animated, Easing, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import RenderHTML from "react-native-render-html";
import Carousel from "react-native-snap-carousel";

// Constants
const THEME_GRADIENT = {
  start: Colors.colors.primary,
  end: "#4d7d73",
};
const CHART_COLORS = [
  "#FF9800",
  "#2196F3",
  "#4CAF50",
  "#F44336",
  "#9C27B0",
  "#FFEB3B",
  "#00BCD4",
  "#795548",
];

interface CarouselItemProps {
  item: SpendingModelData;
  index: number;
}

const CategoryItem = memo(({ category, index }: any) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      delay: index * 100,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const colorIndex = index % CHART_COLORS.length;
  const color = CHART_COLORS[colorIndex];

  return (
    <Animated.View
      style={{
        opacity: animatedValue,
        transform: [
          {
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 0],
            }),
          },
        ],
      }}
      className="mb-2.5 flex-row items-center"
    >
      <View
        style={{ backgroundColor: color }}
        className="mr-2 h-3 w-3 rounded-full"
      />
      <Text className="flex-1 text-gray-700" numberOfLines={1}>
        {category.category.name}
      </Text>
      <Text className="ml-1 font-semibold text-gray-800">
        {category.percentageAmount}%
      </Text>
    </Animated.View>
  );
});

const CarouselItem = memo(({ item, index }: CarouselItemProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [chartAnimated, setChartAnimated] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      setChartAnimated(true);
    });
  }, []);

  const generatePieChartData = useCallback(() => {
    if (!item?.spendingModelCategories) return [];

    return item.spendingModelCategories
      .filter((category) => category?.percentageAmount > 0)
      .map((category, index) => ({
        value: category.percentageAmount,
        color: CHART_COLORS[index % CHART_COLORS.length],
        text: `${category.percentageAmount}%`,
        label: category.category?.name || "Không xác định",
      }));
  }, [item]);

  const generateExample = useCallback(() => {
    if (!item?.spendingModelCategories) return "";

    const relevantCategories = item.spendingModelCategories.filter(
      (category) => category?.percentageAmount > 0,
    );

    const exampleText = relevantCategories
      .map((category) => {
        const name =
          category.category?.name?.toLowerCase() || "mục chưa xác định";
        return `${category.percentageAmount / 10} triệu VND cho ${name}`;
      })
      .join(", ");

    return relevantCategories.length > 0
      ? `Ví dụ: Thu nhập 10 triệu VND → ${exampleText}.`
      : "";
  }, [item]);

  const pieChartData = generatePieChartData();
  const relevantCategories =
    item?.spendingModelCategories
      ?.filter((category) => category?.percentageAmount > 0)
      .slice(0, 6) || [];

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 4.65,
        elevation: 6,
      }}
      className="mb-2 overflow-hidden rounded-2xl bg-white"
    >
      <LinearGradient
        colors={[THEME_GRADIENT.start, THEME_GRADIENT.end]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="items-center px-5 py-4"
      >
        <View className="flex-row items-center justify-center">
          <MaterialIcons name="pie-chart" size={24} color="white" />
          <Text className="ml-2 text-lg font-bold text-white" numberOfLines={1}>
            {item?.name}
          </Text>
        </View>
      </LinearGradient>

      {/* Main content */}
      <View className="p-5">
        <View className="mb-4">
          <RenderHTML
            contentWidth={appInfo.sizes.WIDTH * 0.8}
            source={{ html: item?.description }}
            tagsStyles={{
              p: {
                fontSize: 15,
                lineHeight: 22,
                color: "#4B5563",
                marginBottom: 0,
              },
            }}
          />
        </View>

        <View className="mb-4 h-px bg-gray-100" />

        <View className="flex-row flex-wrap">
          <View
            style={{ width: appInfo.sizes.WIDTH * 0.38 }}
            className="items-center justify-center"
          >
            <PieChart
              data={pieChartData}
              donut
              showText
              textColor="black"
              radius={70}
              innerRadius={35}
              textSize={11}
              focusOnPress
              strokeWidth={1}
              strokeColor="#FFFFFF"
            />
          </View>

          <View
            style={{ width: appInfo.sizes.WIDTH * 0.38 }}
            className="justify-center pl-2"
          >
            <Text className="mb-2 text-sm font-medium text-gray-600">
              Phân bổ chi tiêu:
            </Text>
            {relevantCategories.map((category, idx) => (
              <CategoryItem
                key={`${category.category.id}-${idx}`}
                category={category}
                index={idx}
              />
            ))}
          </View>
        </View>

        <View className="mt-4 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
          <LinearGradient
            colors={["rgba(96, 144, 132, 0.08)", "rgba(96, 144, 132, 0.16)"]}
            className="p-3.5"
          >
            <View className="mb-1 flex-row items-center">
              <FontAwesome5 name="lightbulb" size={12} color="#609084" />
              <Text className="ml-2 text-sm font-medium text-gray-700">
                Áp dụng thực tế
              </Text>
            </View>
            <Text className="text-xs text-gray-600">{generateExample()}</Text>
          </LinearGradient>
        </View>
      </View>
    </Animated.View>
  );
});

const EmptyState = memo(() => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{ transform: [{ scale: scaleAnim }] }}
      className="m-4 items-center justify-center rounded-xl border border-gray-100 bg-white p-8 shadow-md"
    >
      <View className="mb-4 rounded-full bg-gray-50 p-4">
        <MaterialIcons
          name="info-outline"
          size={32}
          color={Colors.colors.primary}
        />
      </View>
      <Text className="text-center text-base font-medium text-gray-700">
        Hiện chưa có mô hình chi tiêu nào
      </Text>
      <Text className="mt-2 text-center text-sm text-gray-500">
        Vui lòng quay lại sau
      </Text>
    </Animated.View>
  );
});

const CustomLoadingIndicator = memo(() => {
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View className="items-center justify-center p-8">
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <MaterialIcons
          name="donut-large"
          size={40}
          color={Colors.colors.primary}
        />
      </Animated.View>
      <Text className="mt-4 text-sm font-medium text-gray-600">
        Đang tải mô hình chi tiêu...
      </Text>
    </View>
  );
});

const ErrorState = memo(() => {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{ transform: [{ translateX: shakeAnim }] }}
      className="border-red-100 m-4 items-center rounded-xl border bg-white p-6 shadow-md"
    >
      <View className="bg-red-50 mb-3 rounded-full p-3">
        <MaterialIcons name="error-outline" size={28} color="#F44336" />
      </View>
      <Text className="text-red-500 text-center text-base font-medium">
        Lỗi khi tải các mô hình chi tiêu
      </Text>
      <Text className="mt-2 text-center text-xs text-gray-500">
        Vui lòng thử lại sau
      </Text>
    </Animated.View>
  );
});

const CarouselIndicators = memo(
  ({ models, activeIndex }: { models: any[]; activeIndex: number }) => {
    return (
      <View className="my-2 h-6 flex-row items-center justify-center">
        {models.map((_, i) => (
          <View
            key={i}
            className={`mx-1 h-2 w-2 rounded-full ${
              i === activeIndex ? "bg-[#609084]" : "bg-gray-300"
            }`}
          />
        ))}
      </View>
    );
  },
);

const SpendingModelReview = memo(() => {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const {
    data: apiData,
    isLoading,
    error,
    isFetching,
  } = useGetSpendingModelQuery({});

  const [models, setModels] = useState<SpendingModelData[]>([]);
  const [isRefetching, setIsRefetching] = useState(false);

  useEffect(() => {
    if (apiData?.items) {
      setModels(apiData.items);
    }
  }, [apiData]);

  useEffect(() => {
    setIsRefetching(isFetching && !isLoading);
  }, [isFetching, isLoading]);

  const handleSnapToItem = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  if (error) {
    return <ErrorState />;
  }

  if (isLoading || isRefetching) {
    return <CustomLoadingIndicator />;
  }

  if (models.length === 0) {
    return <EmptyState />;
  }

  return (
    <View className="flex-1">
      <Carousel
        ref={carouselRef}
        data={models}
        renderItem={({ item, index }) => (
          <CarouselItem item={item} index={index} />
        )}
        sliderWidth={appInfo.sizes.WIDTH - 32}
        itemWidth={appInfo.sizes.WIDTH - 48}
        autoplay
        autoplayDelay={1000}
        autoplayInterval={6000}
        loop
        vertical={false}
        onSnapToItem={handleSnapToItem}
        inactiveSlideScale={0.95}
        inactiveSlideOpacity={0.7}
        contentContainerCustomStyle={{ paddingVertical: 8 }}
      />

      <CarouselIndicators models={models} activeIndex={activeIndex} />
    </View>
  );
});

export default SpendingModelReview;
