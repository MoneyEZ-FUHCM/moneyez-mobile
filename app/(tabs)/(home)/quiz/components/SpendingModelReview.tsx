import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState, memo, useEffect } from "react";
import { Dimensions, Text, View, ActivityIndicator } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import Carousel from "react-native-snap-carousel";
import TEXT_TRANSLATE_QUIZ from "../Quiz.translate";
import { useGetSpendingModelQuery } from "@/services/spendingModel";

// Using API types directly
interface SpendingModelCategory {
  spendingModelId: string;
  categoryId: string;
  percentageAmount: number;
  category: {
    name: string;
    nameUnsign: string;
    description: string;
    code: string;
    icon: string;
    type: string;
    isSaving: boolean;
    id: string;
  }
}

interface SpendingModelData {
  id: string;
  name: string;
  nameUnsign: string;
  description: string;
  isTemplate: boolean;
  spendingModelCategories: SpendingModelCategory[];
}

interface SpendingModelReviewProps {
  spendingModels?: SpendingModelData[];
}

const { width } = Dimensions.get("window");

const CarouselItem = memo(({ item }: { item: SpendingModelData }) => {
  // Generate chart data from API data
  const pieChartData = item.spendingModelCategories
    .filter(category => category.percentageAmount > 0)
    .map((category, index) => {
      // Predefined colors for consistency
      const colors = ["#FF9800", "#2196F3", "#4CAF50", "#F44336", "#9C27B0", "#FFEB3B"];
      return {
        value: category.percentageAmount,
        color: colors[index % colors.length],
        text: `${category.percentageAmount}%`,
        label: category.category.name,
      };
    });

  const getIconName = () => {
    const name = item.name.toLowerCase();
    if (name.includes('jar')) return "account-balance-wallet";
    if (name.includes('50-30-20')) return "pie-chart";
    if (name.includes('80-20')) return "donut-large";
    return "attach-money"; // Default icon
  };

  const generateExample = () => {
    return `Ví dụ: Thu nhập 10 triệu VND → ${item.spendingModelCategories
      .filter(category => category.percentageAmount > 0)
      .map(category => `${category.percentageAmount / 10} triệu VND cho ${category.category.name.toLowerCase()}`)
      .join(", ")}.`;
  };

  return (
    <View className="mb-4 rounded-2xl bg-white p-6 shadow-md border border-gray-200 overflow-hidden">
      <LinearGradient
        colors={["rgba(96, 144, 132, 0.2)", "rgba(96, 144, 132, 0.05)"]}
        className="absolute top-0 left-0 right-0 h-40"
      />
      <View className="flex-row items-center justify-center mb-4">
        <MaterialIcons
          name={getIconName() as any}
          size={30}
          color="#609084"
        />
        <Text className="ml-2 text-xl font-bold text-gray-800">
          {item.name}
        </Text>
      </View>

      <Text className="ml-2 text-xl font-bold text-gray-800">
        {item.description}
      </Text>
      {/* Cứu t cái này Bảo ơi */}

      <View className="items-center mb-6">
        <PieChart
          data={pieChartData}
          donut
          showText
          textColor="black"
          radius={90}
          innerRadius={45}
          textSize={12}
          labelsPosition="outward"
          focusOnPress
        />
      </View>

      <View className="bg-gray-50 p-4 rounded-xl mb-4">
        <Text className="text-sm text-gray-700 italic">
          {generateExample()}
        </Text>
      </View>
    </View>
  );
});

const SpendingModelReview = memo(({ spendingModels: propModels }: SpendingModelReviewProps) => {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { data: apiData, isLoading, error } = useGetSpendingModelQuery({});
  const [models, setModels] = useState<SpendingModelData[]>([]);

  useEffect(() => {
    if (propModels) {
      setModels(propModels);
    } else if (apiData?.items) {
      setModels(apiData.items);
    }
  }, [propModels, apiData]);

  if (isLoading && !propModels) {
    return (
      <View className="items-center justify-center p-10">
        <ActivityIndicator size="large" color="#609084" />
        <Text className="mt-2 text-gray-600">Đang tải...</Text>
      </View>
    );
  }

  if (error && !propModels) {
    return (
      <View className="items-center justify-center p-10">
        <Text className="text-red-500">Lỗi khi tải các mô hình chi tiêu</Text>
      </View>
    );
  }

  if (models.length === 0) {
    return (
      <View className="items-center justify-center p-10">
        <Text className="text-gray-600">Hiện chưa có mô hình chi tiêu nào</Text>
      </View>
    );
  }

  return (
    <View>
      <Carousel
        ref={carouselRef}
        data={models}
        renderItem={({ item }: { item: SpendingModelData; index: number }) => (
          <CarouselItem item={item} />
        )}
        sliderWidth={width - 32}
        itemWidth={width - 64}
        autoplay
        autoplayInterval={8000}
        loop
        onSnapToItem={(index) => setActiveIndex(index)}
        {...{ lockScrollWhileSnapping: true } as any}
      />

      <View className="flex-row justify-center mt-2">
        {models.map((_, i) => (
          <View
            key={i}
            className={`h-2.5 w-2.5 rounded-full mx-1 ${i === activeIndex ? "bg-[#609084]" : "bg-gray-300"
              }`}
          />
        ))}
      </View>
    </View>
  );
});

export default SpendingModelReview;
