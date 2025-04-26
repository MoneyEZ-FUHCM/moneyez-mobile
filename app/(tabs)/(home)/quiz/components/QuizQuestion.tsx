import { appInfo } from "@/helpers/constants/appInfos";
import {
  Answer,
  QuizQuestion as QuestionType,
  QuizAnswerOption,
} from "@/helpers/types/quiz.types";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Progress from "react-native-progress";
import TEXT_TRANSLATE_QUIZ from "../Quiz.translate";

interface QuizQuestionProps {
  question: QuestionType;
  selectedAnswer: Answer | null;
  onSelectAnswer: (
    questionId: string,
    option: QuizAnswerOption | null,
    isCustom?: boolean,
    customValue?: string,
  ) => void;
  currentQuestionIndex: number;
  totalQuestions: number;
}

const AnswerOptionItem = memo(
  ({
    option,
    isSelected,
    onPress,
  }: {
    option: QuizAnswerOption;
    isSelected: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`mb-3 flex-row items-center rounded-xl border-2 p-4 ${
        isSelected ? "border-[#609084] bg-[#E8F5E9]" : "border-gray-200"
      }`}
      activeOpacity={0.7}
    >
      <View
        className={`mr-3 h-6 w-6 items-center justify-center rounded-full ${
          isSelected ? "bg-[#609084]" : "bg-gray-200"
        }`}
      >
        {isSelected && <MaterialIcons name="check" size={16} color="white" />}
      </View>
      <Text
        className={`flex-1 text-base ${isSelected ? "font-medium text-gray-800" : "text-gray-700"}`}
      >
        {option.content}
      </Text>
    </TouchableOpacity>
  ),
);

const CustomAnswerItem = memo(
  ({
    isSelected,
    onPress,
    customValue,
    onChangeText,
  }: {
    isSelected: boolean;
    onPress: () => void;
    customValue: string;
    onChangeText: (text: string) => void;
  }) => (
    <View className="mb-3">
      <TouchableOpacity
        onPress={onPress}
        className={`flex-row items-center rounded-xl border-2 p-4 ${
          isSelected ? "border-[#609084] bg-[#E8F5E9]" : "border-gray-200"
        }`}
        activeOpacity={0.7}
      >
        <View
          className={`mr-3 h-6 w-6 items-center justify-center rounded-full ${
            isSelected ? "bg-[#609084]" : "bg-gray-200"
          }`}
        >
          {isSelected && <MaterialIcons name="check" size={16} color="white" />}
        </View>
        <Text
          className={`flex-1 text-base ${isSelected ? "font-medium text-gray-800" : "text-gray-700"}`}
        >
          Khác
        </Text>
      </TouchableOpacity>

      {isSelected && (
        <View className="mx-1 mt-2">
          <TextInput
            className="rounded-lg border border-gray-300 bg-white p-3"
            placeholder="Nhập câu trả lời của bạn..."
            value={customValue}
            onChangeText={onChangeText}
            autoFocus={true}
          />
        </View>
      )}
    </View>
  ),
);

const QuestionProgress = memo(
  ({
    progress,
    currentQuestionIndex,
    totalQuestions,
  }: {
    progress: number;
    currentQuestionIndex: number;
    totalQuestions: number;
  }) => (
    <View className="mb-6">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-gray-500">
          {TEXT_TRANSLATE_QUIZ.QUESTION_PROGRESS.replace(
            "{current}",
            (currentQuestionIndex + 1).toString(),
          ).replace("{total}", totalQuestions.toString())}
        </Text>
        <Text className="text-sm font-semibold text-[#609084]">
          {Math.round(progress * 100)}%
        </Text>
      </View>
      <Progress.Bar
        progress={progress}
        width={appInfo.sizes.WIDTH - 74}
        color="#609084"
        unfilledColor="#E0E0E0"
        borderWidth={0}
        height={8}
        borderRadius={4}
      />
    </View>
  ),
);

const QuizQuestion = memo(
  ({
    question,
    selectedAnswer,
    onSelectAnswer,
    currentQuestionIndex,
    totalQuestions,
  }: QuizQuestionProps) => {
    const progress = (currentQuestionIndex + 1) / totalQuestions;
    const [customValue, setCustomValue] = useState<string>(
      selectedAnswer?.isCustom ? selectedAnswer.customAnswer : "",
    );

    const handleCustomAnswerChange = (text: string) => {
      setCustomValue(text);
      onSelectAnswer(question.id, null, true, text);
    };

    return (
      <View className="mb-4 overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-md">
        <LinearGradient
          colors={["rgba(96, 144, 132, 0.15)", "rgba(255, 255, 255, 0)"]}
          className="absolute left-0 right-0 top-0 h-24"
        />

        {/* Progress indicator */}
        <QuestionProgress
          progress={progress}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
        />

        {/* Question */}
        <View className="mb-5 rounded-xl bg-gray-50 p-4">
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

          <CustomAnswerItem
            isSelected={selectedAnswer?.isCustom || false}
            onPress={() => onSelectAnswer(question.id, null, true, customValue)}
            customValue={customValue}
            onChangeText={handleCustomAnswerChange}
          />
        </View>
      </View>
    );
  },
);

export default QuizQuestion;
