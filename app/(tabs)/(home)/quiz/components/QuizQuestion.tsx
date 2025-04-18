import React, { memo, useState } from "react";
import { Text, TouchableOpacity, View, Dimensions, TextInput } from "react-native";
import * as Progress from "react-native-progress";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import TEXT_TRANSLATE_QUIZ from "../Quiz.translate";
import { QuizQuestion as QuestionType, QuizAnswerOption } from "@/types/quiz.types";

interface Answer {
  option: QuizAnswerOption | null;
  customAnswer: string;
  isCustom: boolean;
}

interface QuizQuestionProps {
  question: QuestionType;
  selectedAnswer: Answer | null;
  onSelectAnswer: (questionId: string, option: QuizAnswerOption | null, isCustom?: boolean, customValue?: string) => void;
  currentQuestionIndex: number;
  totalQuestions: number;
}

const { width } = Dimensions.get("window");

const AnswerOptionItem = memo(({ 
  option, 
  isSelected, 
  onPress 
}: { 
  option: QuizAnswerOption; 
  isSelected: boolean; 
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`mb-3 rounded-xl p-4 border-2 flex-row items-center
      ${isSelected 
        ? "border-[#609084] bg-[#E8F5E9]" 
        : "border-gray-200"
      }`}
    activeOpacity={0.7}
  >
    <View 
      className={`w-6 h-6 rounded-full mr-3 items-center justify-center 
        ${isSelected 
          ? "bg-[#609084]" 
          : "bg-gray-200"
        }`}
    >
      {isSelected && (
        <MaterialIcons name="check" size={16} color="white" />
      )}
    </View>
    <Text 
      className={`text-base flex-1 ${isSelected ? "text-gray-800 font-medium" : "text-gray-700"}`}
    >
      {option.content}
    </Text>
  </TouchableOpacity>
));

const CustomAnswerItem = memo(({ 
  isSelected, 
  onPress,
  customValue,
  onChangeText 
}: { 
  isSelected: boolean; 
  onPress: () => void;
  customValue: string;
  onChangeText: (text: string) => void;
}) => (
  <View className="mb-3">
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-xl p-4 border-2 flex-row items-center
        ${isSelected 
          ? "border-[#609084] bg-[#E8F5E9]" 
          : "border-gray-200"
        }`}
      activeOpacity={0.7}
    >
      <View 
        className={`w-6 h-6 rounded-full mr-3 items-center justify-center 
          ${isSelected 
            ? "bg-[#609084]" 
            : "bg-gray-200"
          }`}
      >
        {isSelected && (
          <MaterialIcons name="check" size={16} color="white" />
        )}
      </View>
      <Text 
        className={`text-base flex-1 ${isSelected ? "text-gray-800 font-medium" : "text-gray-700"}`}
      >
        Khác
      </Text>
    </TouchableOpacity>

    {isSelected && (
      <View className="mt-2 mx-1">
        <TextInput
          className="border border-gray-300 rounded-lg p-3 bg-white"
          placeholder="Nhập câu trả lời của bạn..."
          value={customValue}
          onChangeText={onChangeText}
          autoFocus={true}
        />
      </View>
    )}
  </View>
));

const QuestionProgress = memo(({ 
  progress, 
  currentQuestionIndex, 
  totalQuestions 
}: { 
  progress: number; 
  currentQuestionIndex: number;
  totalQuestions: number;
}) => (
  <View className="mb-6">
    <View className="flex-row justify-between items-center mb-2">
      <Text className="text-sm font-semibold text-gray-500">
        {TEXT_TRANSLATE_QUIZ.QUESTION_PROGRESS
          .replace("{current}", (currentQuestionIndex + 1).toString())
          .replace("{total}", totalQuestions.toString())}
      </Text>
      <Text className="text-sm font-semibold text-[#609084]">
        {Math.round(progress * 100)}%
      </Text>
    </View>
    <Progress.Bar
      progress={progress}
      width={width - 74}
      color="#609084"
      unfilledColor="#E0E0E0"
      borderWidth={0}
      height={8}
      borderRadius={4}
    />
  </View>
));

const QuizQuestion = memo(({
  question,
  selectedAnswer,
  onSelectAnswer,
  currentQuestionIndex,
  totalQuestions,
}: QuizQuestionProps) => {
  const progress = (currentQuestionIndex + 1) / totalQuestions;
  const [customValue, setCustomValue] = useState<string>(selectedAnswer?.isCustom ? selectedAnswer.customAnswer : '');
  
  const handleCustomAnswerChange = (text: string) => {
    setCustomValue(text);
    onSelectAnswer(question.id, null, true, text);
  };

  return (
    <View className="mb-4 rounded-2xl bg-white p-5 shadow-md border border-gray-200 overflow-hidden">
      <LinearGradient
        colors={["rgba(96, 144, 132, 0.15)", "rgba(255, 255, 255, 0)"]}
        className="absolute top-0 left-0 right-0 h-24"
      />
      
      {/* Progress indicator */}
      <QuestionProgress 
        progress={progress} 
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
      />
      
      {/* Question */}
      <View className="bg-gray-50 rounded-xl p-4 mb-5">
        <Text className="text-lg font-bold text-gray-800">
          {question.content}
        </Text>
      </View>
      
      {/* Answer options */}
      <View className="mb-2">
        {question.answerOptions.map((option) => {
          const isSelected = selectedAnswer?.option?.id === option.id;
          return (
            <AnswerOptionItem
              key={option.id}
              option={option}
              isSelected={isSelected}
              onPress={() => onSelectAnswer(question.id, option, false)}
            />
          );
        })}
        
        {/* Custom "Khác" option */}
        <CustomAnswerItem
          isSelected={selectedAnswer?.isCustom || false}
          onPress={() => onSelectAnswer(question.id, null, true, customValue)}
          customValue={customValue}
          onChangeText={handleCustomAnswerChange}
        />
      </View>
    </View>
  );
});

export default QuizQuestion;
