import React, { useState, useEffect, memo } from "react";
import { Text, TouchableOpacity, View, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { PieChart } from "react-native-gifted-charts";
import TEXT_TRANSLATE_QUIZ from "../Quiz.translate";
import { SpendingModel, chartData, examples, modelIcons } from "@/helpers/constants/spendingModels";

interface SuggestionPageProps {
  suggestedModel: SpendingModel | null;
  onSubmit: () => void;
  onNavigateModel: () => void;
  isButtonBelow?: boolean;
}

const ChartSection = memo(({ modelId }: { modelId: string }) => {
  return (
    <View className="items-center mb-4">
      <PieChart
        data={chartData[modelId as keyof typeof chartData] || []}
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
const ModelInfo = memo(({ model }: { model: SpendingModel }) => {
  const icon = modelIcons[model.id] || "pie-chart";
  
  return (
    <View className="bg-gray-50 rounded-xl p-5 mb-6">
      <View className="flex-row items-center mb-4">
        <MaterialIcons 
          name={icon} 
          size={28} 
          color="#609084" 
          style={{ marginRight: 10 }}
        />
        <Text className="text-lg font-bold text-gray-800">
          {model.name}
        </Text>
      </View>
      
      <Text className="text-base text-gray-700 mb-4">
        {model.description}
      </Text>
      
      <ChartSection modelId={model.id} />
      
      <View className="bg-gray-100 p-3 rounded-lg">
        <Text className="text-sm text-gray-700 italic">
          {examples[model.id as keyof typeof examples] || ""}
        </Text>
      </View>
    </View>
  );
});

const SuggestionPage = memo(({ 
  suggestedModel, 
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
