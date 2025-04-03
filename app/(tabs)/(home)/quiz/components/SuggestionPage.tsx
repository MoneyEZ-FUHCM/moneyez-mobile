import React, { useState, useEffect, memo } from "react";
import { Text, TouchableOpacity, View, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { PieChart } from "react-native-gifted-charts";
import TEXT_TRANSLATE_QUIZ from "../Quiz.translate";
import { QuizSubmitResponse } from "@/types/quiz.types";

// API model interface
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

interface SuggestionPageProps {
  suggestedModel: SpendingModelData | null;
  quizSubmitResponse?: QuizSubmitResponse | null;
  onSubmit?: () => void;
  onNavigateModel: () => void;
  isButtonBelow?: boolean;
}

const ChartSection = memo(({ model }: { model: SpendingModelData }) => {
  // Generate chart data from model categories
  const chartData = model.spendingModelCategories
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

  return (
    <View className="items-center mb-4">
      <PieChart
        data={chartData}
        donut
        showText
        textColor="black"
        radius={80}
        innerRadius={40}
        textSize={12}
        labelsPosition="outward"
        focusOnPress
      />
    </View>
  );
});

// Memoized ModelInfo component
const ModelInfo = memo(({ model }: { model: SpendingModelData }) => {
  // Select an appropriate icon based on the model name
  const getIconName = () => {
    const name = model.name.toLowerCase();
    if (name.includes('jar')) return "account-balance-wallet";
    if (name.includes('50-30-20')) return "pie-chart";
    if (name.includes('80-20')) return "donut-large";
    return "attach-money"; // Default icon
  };
  
  // Clean HTML tags from description
  const cleanDescription = model.description.replace(/<\/?[^>]+(>|$)/g, "");

  // Generate example text based on model data
  const generateExample = () => {
    return `Ví dụ: Thu nhập 10 triệu VND → ${model.spendingModelCategories
      .filter(category => category.percentageAmount > 0)
      .map(category => `${category.percentageAmount / 10} triệu VND cho ${category.category.name.toLowerCase()}`)
      .join(", ")}.`;
  };
  
  return (
    <View className="bg-gray-50 rounded-xl p-5 mb-6">
      <View className="flex-row items-center mb-4">
        <MaterialIcons 
          name={getIconName() as any} 
          size={28} 
          color="#609084" 
          style={{ marginRight: 10 }}
        />
        <Text className="text-lg font-bold text-gray-800">
          {model.name}
        </Text>
      </View>
      
      <Text className="text-base text-gray-700 mb-4">
        {cleanDescription}
      </Text>
      
      <ChartSection model={model} />
      
      <View className="bg-gray-100 p-3 rounded-lg">
        <Text className="text-sm text-gray-700 italic">
          {generateExample()}
        </Text>
      </View>
    </View>
  );
});

const SuggestionPage = memo(({ 
  suggestedModel, 
  quizSubmitResponse,
  onNavigateModel,
  isButtonBelow = false
}: SuggestionPageProps) => {
  const [animatedValue] = useState(new Animated.Value(0));
  
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start();
  }, []);

  const renderInternalButton = () => {
    if (isButtonBelow) return null;
    
    return (
      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={onNavigateModel}
          className="flex-1 mr-2 rounded-xl bg-white p-4 items-center border-2 border-[#609084]"
          activeOpacity={0.7}
        >
          <Text className="text-base font-semibold text-[#609084]">
            {TEXT_TRANSLATE_QUIZ.BUTTON_SELECT_MODEL}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderResultDetails = () => {
    if (!quizSubmitResponse) return null;
    
    return (
      <View className="bg-[#EDF7F5] rounded-xl p-4 mb-5">
        <Text className="text-sm text-gray-600 mb-2">
          Kết quả đánh giá:
        </Text>
        
        <View className="flex-row justify-between items-center">
          <Text className="text-base font-medium text-gray-800">
            Mô hình được đề xuất:
          </Text>
          <View className="bg-[#609084] py-1 px-3 rounded-full">
            <Text className="text-white font-medium">
              {suggestedModel?.name || quizSubmitResponse.recommendedModel}
            </Text>
          </View>
        </View>
        
        <Text className="text-xs text-gray-500 mt-2 italic">
          Hoàn thành vào: {new Date(quizSubmitResponse.takenAt).toLocaleString('vi-VN')}
        </Text>
      </View>
    );
  };

  return (
    <Animated.View 
      className="rounded-2xl bg-white p-6 shadow-md border border-gray-200 overflow-hidden"
      style={{
        opacity: animatedValue,
        transform: [{ 
          translateY: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0]
          })
        }],
        flex: isButtonBelow ? 1 : undefined
      }}
    >
      <LinearGradient
        colors={["rgba(96, 144, 132, 0.2)", "rgba(255, 255, 255, 0)"]}
        className="absolute top-0 left-0 right-0 h-48"
      />
      
      <View className="items-center mb-6">
        <View className="bg-[#E8F5E9] p-3 rounded-full mb-4">
          <MaterialIcons name="lightbulb" size={36} color="#609084" />
        </View>
        <Text className="text-xl font-bold text-gray-800 text-center mb-1">
          {TEXT_TRANSLATE_QUIZ.SUGGESTION_TITLE}
        </Text>
        <Text className="text-base text-gray-600 text-center">
          {TEXT_TRANSLATE_QUIZ.SUGGESTION_DESCRIPTION}
        </Text>
      </View>

      {renderResultDetails()}

      {suggestedModel ? (
        <ModelInfo model={suggestedModel} />
      ) : (
        <View className="bg-gray-100 rounded-xl p-5 mb-6 items-center">
          <MaterialIcons name="hourglass-empty" size={40} color="#9E9E9E" />
          <Text className="mt-3 text-base text-gray-700 text-center">
            {TEXT_TRANSLATE_QUIZ.NO_SUGGESTION_AVAILABLE}
          </Text>
        </View>
      )}
      
      {renderInternalButton()}
    </Animated.View>
  );
});

export default SuggestionPage;