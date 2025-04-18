import { useGetSpendingModelQuery } from "@/services/spendingModel";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import RenderHTML from "react-native-render-html";
import Carousel from "react-native-snap-carousel";

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
  };
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
    .filter((category) => category.percentageAmount > 0)
    .map((category, index) => {
      // Predefined colors for consistency
      const colors = [
        "#FF9800",
        "#2196F3",
        "#4CAF50",
        "#F44336",
        "#9C27B0",
        "#FFEB3B",
      ];
      return {
        value: category.percentageAmount,
        color: colors[index % colors.length],
        text: `${category.percentageAmount}%`,
        label: category.category.name,
      };
    });

  const getIconName = () => {
    const name = item.name.toLowerCase();
    if (name.includes("jar")) return "account-balance-wallet";
    if (name.includes("50-30-20")) return "pie-chart";
    if (name.includes("80-20")) return "donut-large";
    return "attach-money"; // Default icon
  };

  const generateExample = () => {
    return `Ví dụ: Thu nhập 10 triệu VND → ${item?.spendingModelCategories
      .filter((category) => category?.percentageAmount > 0)
      .map(
        (category) =>
          `${category?.percentageAmount / 10} triệu VND cho ${category?.category?.name.toLowerCase()}`,
      )
      .join(", ")}.`;
  };

  return (
    <View className="mb-4 overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
      <LinearGradient
        colors={["rgba(96, 144, 132, 0.2)", "rgba(96, 144, 132, 0.05)"]}
        className="absolute left-0 right-0 top-0 h-40"
      />
      <View className="mb-4 flex-row items-center justify-center">
        <MaterialIcons name={getIconName() as any} size={30} color="#609084" />
        <Text className="ml-2 text-xl font-bold text-gray-800">
          {item?.name}
        </Text>
      </View>

      <Text className="text-xl font-bold text-gray-800">
        <RenderHTML
          contentWidth={width * 1}
          source={{ html: item?.description }}
        />
      </Text>

      <View className="mb-6 items-center">
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

      <View className="mb-4 rounded-xl bg-gray-50 p-4">
        <Text className="text-sm italic text-gray-700">
          {generateExample()}
        </Text>
      </View>
    </View>
  );
});

const SpendingModelReview = memo(
  ({ spendingModels: propModels }: SpendingModelReviewProps) => {
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
          <Text className="text-gray-600">
            Hiện chưa có mô hình chi tiêu nào
          </Text>
        </View>
      );
    }

    return (
      <View>
        <Carousel
          ref={carouselRef}
          data={models}
          renderItem={({
            item,
          }: {
            item: SpendingModelData;
            index: number;
          }) => <CarouselItem item={item} />}
          sliderWidth={width - 32}
          itemWidth={width - 64}
          autoplay
          autoplayInterval={8000}
          loop
          onSnapToItem={(index) => setActiveIndex(index)}
          {...({ lockScrollWhileSnapping: true } as any)}
        />

        <View className="mt-2 flex-row justify-center">
          {models?.map((_, i) => (
            <View
              key={i}
              className={`mx-1 h-2.5 w-2.5 rounded-full ${
                i === activeIndex ? "bg-[#609084]" : "bg-gray-300"
              }`}
            />
          ))}
        </View>
      </View>
    );
  },
);

export default SpendingModelReview;
