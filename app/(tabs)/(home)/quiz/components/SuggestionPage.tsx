import { appInfo } from "@/helpers/constants/appInfos";
import { QuizSubmitResponse } from "@/types/quiz.types";
import { SpendingModelData } from "@/types/spendingModel.types";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useEffect, useState } from "react";
import { Animated, Text, View, TouchableOpacity } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import RenderHTML from "react-native-render-html";
import TEXT_TRANSLATE_QUIZ from "../Quiz.translate";

interface SuggestionPageProps {
  suggestedModel: SpendingModelData | null;
  quizSubmitResponse?: QuizSubmitResponse | null;
  onSubmit?: () => void;
  onNavigateModel: () => void;
}

const CHART_COLORS = [
  "#4ECDC4", // Teal
  "#FF6B6B", // Coral
  "#FFD166", // Yellow
  "#118AB2", // Blue
  "#073B4C", // Dark Blue
  "#06D6A0", // Mint
  "#8A89C0", // Purple
  "#F78C6B", // Orange
];

const ChartSection = memo(({ model }: { model: SpendingModelData }) => {
  const chartData = model.spendingModelCategories
    .filter((category) => category.percentageAmount > 0)
    .map((category, index) => ({
      value: category.percentageAmount,
      color: CHART_COLORS[index % CHART_COLORS.length],
      text: `${category.percentageAmount}%`,
      label: category.category.name,
      onPress: () => console.log(`${category.category.name} pressed`),
    }));

  return (
    <View className="mb-6 items-center">
      <PieChart
        data={chartData}
        donut
        showText
        textColor="white"
        textBackgroundRadius={18}
        textSize={12}
        radius={90}
        innerRadius={50}
        centerLabelComponent={() => (
          <View className="items-center justify-center">
            <Text className="text-xl font-bold text-gray-800">100%</Text>
            <Text className="text-xs text-gray-500">Thu nhập</Text>
          </View>
        )}
        labelsPosition="outward"
        focusOnPress
        shadow
      />

      <View className="mt-6 flex-row flex-wrap justify-center">
        {chartData.map((item, index) => (
          <View key={index} className="mx-2 mb-2 flex-row items-center">
            <View
              style={{ backgroundColor: item.color }}
              className="mr-1 h-3 w-3 rounded-sm"
            />
            <Text className="text-xs text-gray-700">
              {item.label}: {item.value}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
});

const ModelInfo = memo(({ model }: { model: SpendingModelData }) => {
  const generateExample = () => {
    return `Ví dụ: Thu nhập 10 triệu VND → ${model.spendingModelCategories
      .filter((category) => category.percentageAmount > 0)
      .map(
        (category) =>
          `${category.percentageAmount / 10} triệu VND cho ${category.category.name.toLowerCase()}`,
      )
      .join(", ")}.`;
  };

  return (
    <View className="mb-6 overflow-hidden rounded-2xl bg-white shadow">
      <LinearGradient
        colors={["rgba(96, 144, 132, 0.15)", "rgba(255, 255, 255, 0)"]}
        className="absolute h-full w-full"
      />

      <View className="p-5">
        <View className="mb-4 flex-row items-center">
          <View className="mr-3 rounded-full bg-[#E8F5E9] p-2">
            <MaterialIcons name="pie-chart" size={24} color="#609084" />
          </View>
          <Text className="text-lg font-bold text-gray-800">{model.name}</Text>
        </View>

        <View className="mb-4">
          <RenderHTML
            contentWidth={appInfo.sizes.WIDTH - 60}
            source={{ html: model.description }}
            tagsStyles={{
              p: { fontSize: 14, lineHeight: 22, color: "#4A5568" },
            }}
          />
        </View>

        <ChartSection model={model} />

        <View className="rounded-lg bg-[#F0F9FF] p-4">
          <View className="mb-2 flex-row items-center">
            <MaterialIcons name="lightbulb" size={16} color="#0369A1" />
            <Text className="ml-2 font-medium text-[#0369A1]">
              Áp dụng thực tế
            </Text>
          </View>
          <Text className="text-sm text-gray-700">{generateExample()}</Text>
        </View>
      </View>
    </View>
  );
});

const SuggestionPage = memo(
  ({
    suggestedModel,
    quizSubmitResponse,
    onNavigateModel,
  }: SuggestionPageProps) => {
    const [animatedValue] = useState(new Animated.Value(0));

    useEffect(() => {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }).start();
    }, []);

    const renderResultDetails = () => {
      if (!quizSubmitResponse) return null;

      const takenAtDate = quizSubmitResponse.takenAt
        ? new Date(quizSubmitResponse.takenAt).toLocaleString("vi-VN")
        : new Date().toLocaleString("vi-VN");

      const modelName =
        suggestedModel?.name ||
        quizSubmitResponse?.recommendedModel?.recommendedModel?.name ||
        "";

      return (
        <View className="mb-5 overflow-hidden rounded-xl bg-[#EDF7F5] shadow">
          <LinearGradient
            colors={["rgba(96, 144, 132, 0.2)", "rgba(255, 255, 255, 0)"]}
            className="absolute h-full w-full"
          />
          <View className="p-4">
            <Text className="mb-2 text-sm font-medium text-gray-600">
              Kết quả đánh giá của bạn:
            </Text>

            <View className="flex-row items-center justify-between">
              <Text className="text-base font-medium text-gray-800">
                Mô hình được đề xuất:
              </Text>
              <View className="rounded-full bg-[#609084] px-3 py-1 shadow">
                <Text className="font-medium text-white">{modelName}</Text>
              </View>
            </View>

            <Text className="mt-3 text-xs text-gray-500">
              Hoàn thành vào: {takenAtDate}
            </Text>
          </View>
        </View>
      );
    };

    const renderReasoning = () => {
      if (!quizSubmitResponse?.recommendedModel?.reasoning) return null;

      return (
        <View className="mb-5 overflow-hidden rounded-xl border border-gray-100 bg-white shadow">
          <View className="border-b border-gray-100 bg-[#F9F9F9] px-4 py-3">
            <Text className="font-medium text-gray-800">Lý do đề xuất</Text>
          </View>
          <View className="p-4">
            <Text className="text-sm leading-6 text-gray-700">
              {quizSubmitResponse?.recommendedModel?.reasoning}
            </Text>
          </View>
        </View>
      );
    };

    return (
      <Animated.View
        className="flex-1"
        style={{
          opacity: animatedValue,
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
          marginBottom: 40,
        }}
      >
        <View className="mb-6 items-center">
          <View className="mb-4 overflow-hidden rounded-full bg-[#E8F5E9] p-4 shadow">
            <LinearGradient
              colors={["rgba(96, 144, 132, 0.2)", "rgba(255, 255, 255, 0)"]}
              className="absolute h-full w-full"
            />
            <MaterialIcons name="lightbulb" size={36} color="#609084" />
          </View>
          <Text className="mb-2 text-center text-2xl font-bold text-gray-800">
            {TEXT_TRANSLATE_QUIZ.SUGGESTION_TITLE}
          </Text>
          <Text className="text-center text-base text-gray-600">
            {TEXT_TRANSLATE_QUIZ.SUGGESTION_DESCRIPTION}
          </Text>
        </View>

        {renderResultDetails()}

        {suggestedModel ? (
          <ModelInfo model={suggestedModel} />
        ) : (
          <View className="mb-6 items-center rounded-xl bg-gray-100 p-6 shadow">
            <MaterialIcons name="hourglass-empty" size={40} color="#9E9E9E" />
            <Text className="mt-3 text-center text-base text-gray-700">
              {TEXT_TRANSLATE_QUIZ.NO_SUGGESTION_AVAILABLE}
            </Text>
          </View>
        )}

        {renderReasoning()}
      </Animated.View>
    );
  },
);

export default SuggestionPage;
