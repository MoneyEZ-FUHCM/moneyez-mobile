import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState, memo } from "react";
import { Dimensions, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import Carousel from "react-native-snap-carousel";
import TEXT_TRANSLATE_QUIZ from "../Quiz.translate";
import { SpendingModel, chartData, examples, modelIcons } from "@/helpers/constants/spendingModels";

interface SpendingModelReviewProps {
  spendingModels: SpendingModel[];
}

const { width } = Dimensions.get("window");

const CarouselItem = memo(({ item }: { item: SpendingModel }) => {
  const modelData = chartData[item.id];
  
  return (
    <View className="mb-4 rounded-2xl bg-white p-6 shadow-md border border-gray-200 overflow-hidden">
      <LinearGradient
        colors={["rgba(96, 144, 132, 0.2)", "rgba(96, 144, 132, 0.05)"]}
        className="absolute top-0 left-0 right-0 h-40"
      />
      <View className="flex-row items-center justify-center mb-4">
        <MaterialIcons
          name={modelIcons[item.id] as any}
          size={30}
          color="#609084"
        />
        <Text className="ml-2 text-xl font-bold text-gray-800">
          {item.name}
        </Text>
      </View>

      <Text className="mb-6 text-base text-gray-700 text-center">
        {item.description}
      </Text>

      <View className="items-center mb-6">
        <PieChart
          data={modelData}
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
          {examples[item.id]}
        </Text>
      </View>
    </View>
  );
});

const SpendingModelReview = memo(({ spendingModels }: SpendingModelReviewProps) => {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View>
      <Text className="mb-4 text-lg font-bold text-center text-gray-800">
        {TEXT_TRANSLATE_QUIZ.SPENDING_MODEL_REVIEW_TITLE}
      </Text>

      <Carousel
        ref={carouselRef}
        data={spendingModels}
        renderItem={({ item }: { item: SpendingModel; index: number }) => (
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
        {spendingModels.map((_, i) => (
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
