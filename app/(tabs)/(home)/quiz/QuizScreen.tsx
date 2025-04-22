import {
  SafeAreaViewCustom,
  ScrollViewCustom,
  SectionComponent,
} from "@/components";
import { MaterialIcons } from "@expo/vector-icons";
import React, { memo, useEffect } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import QuizQuestion from "./components/QuizQuestion";
import SpendingModelReview from "./components/SpendingModelReview";
import SuggestionPage from "./components/SuggestionPage";
import useQuiz from "./hooks/useQuiz";
import TEXT_TRANSLATE_QUIZ from "./Quiz.translate";

const LoadingState = memo(() => (
  <View className="items-center justify-center rounded-3xl bg-white p-8 shadow-lg">
    <View className="h-16 w-16 items-center justify-center rounded-full bg-gray-50">
      <ActivityIndicator size="large" color="#609084" />
    </View>
    <Text className="mt-5 text-base font-medium text-gray-700">
      Đang tải...
    </Text>
  </View>
));

const SubmittingState = memo(() => (
  <View className="items-center justify-center rounded-3xl bg-white p-8 shadow-lg">
    <View className="h-16 w-16 items-center justify-center rounded-full bg-gray-50">
      <ActivityIndicator size="large" color="#609084" />
    </View>
    <Text className="mt-5 text-base font-medium text-gray-700">
      Phân tích câu trả lời của bạn...
    </Text>
  </View>
));

const HeaderSection = memo(
  ({ title, onBack }: { title: string; onBack?: () => void }) => (
    <SectionComponent rootClassName="h-16 bg-white justify-center shadow-sm">
      <View className="flex-row items-center justify-between px-5">
        {onBack ? (
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-gray-50"
            activeOpacity={0.7}
            onPress={onBack}
          >
            <MaterialIcons name="arrow-back" size={22} color="#333" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
        <Text className="text-lg font-bold text-gray-800">{title}</Text>
        <View style={{ width: 40 }} />
      </View>
    </SectionComponent>
  ),
);

const BottomButtons = memo(
  ({
    onPrevious,
    onNext,
    showPrevious,
    buttonText,
    isDisabled,
  }: {
    onPrevious?: () => void;
    onNext: () => void;
    showPrevious: boolean;
    buttonText: string;
    isDisabled?: boolean;
  }) => (
    <View className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white px-6 py-5 shadow-lg">
      <View
        className={`flex-row ${showPrevious ? "justify-between" : "justify-center"}`}
      >
        {showPrevious && (
          <TouchableOpacity
            onPress={onPrevious}
            activeOpacity={0.7}
            className="mr-3 items-center rounded-xl border border-gray-200 bg-gray-50 px-6 py-4"
          >
            <Text className="text-base font-semibold text-gray-700">
              {TEXT_TRANSLATE_QUIZ.BUTTON_PREVIOUS}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={onNext}
          disabled={isDisabled}
          activeOpacity={0.7}
          className={`rounded-xl px-6 py-4 ${
            isDisabled ? "bg-gray-300" : "bg-[#609084]"
          } items-center ${showPrevious ? "" : "w-4/5"}`}
          style={{
            shadowColor: isDisabled ? "#ccc" : "#609084",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <Text className="text-base font-semibold text-white">
            {buttonText}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  ),
);

const SuggestionButton = memo(
  ({ onNavigateModel }: { onNavigateModel: () => void }) => (
    <View className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white px-6 py-5 shadow-lg">
      <LinearGradient
        colors={["#609084", "#4d7d73"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="overflow-hidden rounded-xl"
        style={{
          shadowColor: "#609084",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <TouchableOpacity
          onPress={onNavigateModel}
          className="items-center justify-center py-4"
          activeOpacity={0.8}
        >
          <Text className="text-base font-semibold text-white">
            {TEXT_TRANSLATE_QUIZ.BUTTON_SELECT_MODEL}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  ),
);

// Main component
const QuizScreen = memo(() => {
  const { state, handler } = useQuiz();

  const {
    currentStep,
    totalSteps,
    quiz,
    answers,
    suggestedModel,
    isLoading,
    isSubmitting,
    quizSubmitResponse,
    error,
  } = state;

  useEffect(() => {
    handler.fetchActiveQuiz();
  }, []);

  const quizStepIndex = currentStep - 1;

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (isSubmitting) {
      return <SubmittingState />;
    }

    if (error) {
      return (
        <View className="items-center justify-center rounded-3xl bg-white p-8 shadow-lg">
          <View className="bg-red-50 h-16 w-16 items-center justify-center rounded-full">
            <MaterialIcons name="error-outline" size={32} color="#F44336" />
          </View>
          <Text className="mt-5 text-center text-base text-gray-700">
            {error}
          </Text>
          <TouchableOpacity
            className="mt-6 rounded-xl bg-[#609084] px-6 py-3"
            activeOpacity={0.7}
            onPress={handler.fetchActiveQuiz}
            style={{
              shadowColor: "#609084",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 6,
              elevation: 4,
            }}
          >
            <Text className="font-medium text-white">Thử lại</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (currentStep === 0) {
      return <SpendingModelReview />;
    } else if (currentStep > 0 && currentStep < totalSteps - 1 && quiz) {
      const question = quiz.questions[quizStepIndex];
      return (
        <QuizQuestion
          question={question}
          selectedAnswer={answers[question.id] || null}
          onSelectAnswer={handler.selectAnswer}
          currentQuestionIndex={quizStepIndex}
          totalQuestions={quiz.questions.length}
        />
      );
    } else {
      return (
        <SuggestionPage
          suggestedModel={suggestedModel}
          quizSubmitResponse={quizSubmitResponse}
          onSubmit={() => {}}
          onNavigateModel={handler.navigateToRecommendedModel}
        />
      );
    }
  };

  const isSuggestionPage =
    currentStep === totalSteps - 1 && !isLoading && !isSubmitting;
  const paddingBottom = !isLoading && !isSubmitting ? "pb-28" : "pb-6";

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-[#f5f7f8]">
      <HeaderSection
        title={TEXT_TRANSLATE_QUIZ.HEADER}
        onBack={currentStep > 0 ? handler.previousStep : undefined}
      />

      <ScrollViewCustom
        showsVerticalScrollIndicator={false}
        className={`${paddingBottom}`}
        isBottomTab={true}
        contentContainerStyle={{
          flexGrow: isSuggestionPage ? 1 : undefined,
          paddingHorizontal: 16,
        }}
      >
        <View className={`py-6 ${isSuggestionPage ? "flex-1" : ""}`}>
          {renderContent()}
        </View>
      </ScrollViewCustom>

      {!isLoading &&
        !isSubmitting &&
        !error &&
        currentStep < totalSteps - 1 && (
          <BottomButtons
            onPrevious={currentStep > 0 ? handler.previousStep : undefined}
            onNext={handler.nextStep}
            showPrevious={currentStep > 0}
            buttonText={handler.getButtonText()}
            isDisabled={handler.isNextButtonDisabled()}
          />
        )}

      {isSuggestionPage && (
        <SuggestionButton
          onNavigateModel={handler.navigateToRecommendedModel}
        />
      )}
    </SafeAreaViewCustom>
  );
});

export default QuizScreen;
