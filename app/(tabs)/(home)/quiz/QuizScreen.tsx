import {
  SafeAreaViewCustom,
  ScrollViewCustom,
  SectionComponent,
} from "@/components";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { memo, useEffect } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import QuizQuestion from "./components/QuizQuestion";
import SpendingModelReview from "./components/SpendingModelReview";
import SuggestionPage from "./components/SuggestionPage";
import useQuiz from "./hooks/useQuiz";
import TEXT_TRANSLATE_QUIZ from "./Quiz.translate";

// Memoized components to prevent unnecessary re-renders
const LoadingState = memo(() => (
  <View className="items-center justify-center rounded-2xl bg-white p-8 shadow-md">
    <ActivityIndicator size="large" color="#609084" />
    <Text className="mt-4 text-base text-gray-700">Đang tải...</Text>
  </View>
));

const SubmittingState = memo(() => (
  <View className="items-center justify-center rounded-2xl bg-white p-8 shadow-md">
    <ActivityIndicator size="large" color="#609084" />
    <Text className="mt-4 text-base text-gray-700">
      Phân tích câu trả lời của bạn...
    </Text>
  </View>
));

const HeaderSection = memo(
  ({ title, onBack }: { title: string; onBack?: () => void }) => (
    <SectionComponent rootClassName="h-14 bg-white justify-center shadow-sm">
      <View className="flex-row items-center justify-between px-5">
        {onBack ? (
          <TouchableOpacity onPress={onBack}>
            <MaterialIcons name="arrow-back" size={24} color="#609084" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}
        <Text className="text-lg font-bold text-black">{title}</Text>
        <View style={{ width: 24 }} />
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
    <View className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-6 py-4 shadow-lg">
      <View
        className={`flex-row ${showPrevious ? "justify-between" : "justify-center"}`}
      >
        {showPrevious && (
          <TouchableOpacity
            onPress={onPrevious}
            className="items-center rounded-lg bg-gray-200 px-6 py-4"
          >
            <Text className="text-base font-semibold text-gray-800">
              {TEXT_TRANSLATE_QUIZ.BUTTON_PREVIOUS}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={onNext}
          disabled={isDisabled}
          className={`rounded-lg px-6 py-4 ${isDisabled ? "bg-gray-300" : "bg-[#609084]"} items-center`}
        >
          <Text className="text-base font-semibold text-white">
            {buttonText}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  ),
);

// Memoized SuggestionButton for the final screen
const SuggestionButton = memo(
  ({ onNavigateModel }: { onNavigateModel: () => void }) => (
    <View className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-6 py-4 shadow-lg">
      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={onNavigateModel}
          className="mr-2 flex-1 items-center rounded-xl border-2 border-[#609084] bg-white p-4"
          activeOpacity={0.7}
        >
          <Text className="text-base font-semibold text-[#609084]">
            {TEXT_TRANSLATE_QUIZ.BUTTON_SELECT_MODEL}
          </Text>
        </TouchableOpacity>
      </View>
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
    spendingModels,
    answers,
    suggestedModel,
    isLoading,
    isSubmitting,
    quizSubmitResponse,
    error,
  } = state;

  // Fetch the active quiz when the component mounts
  useEffect(() => {
    handler.fetchActiveQuiz();
  }, []);

  const quizStepIndex = currentStep - 1;

  // Determine if the next button should be disabled (no answer selected for current question)
  const isNextButtonDisabled = () => {
    if (currentStep === 0) return false; // Review page
    if (currentStep >= totalSteps - 1) return false; // Suggestion page

    // For question pages, check if the current question has an answer
    const currentQuestion = quiz?.questions[quizStepIndex];

    if (!currentQuestion) return true;

    const answer = answers[currentQuestion.id];
    if (!answer) return true;

    // If it's a custom answer, check that it's not empty
    if (
      answer.isCustom &&
      (!answer.customAnswer || answer.customAnswer.trim() === "")
    ) {
      return true;
    }

    return false;
  };

  // Determine which button text to show
  const getButtonText = () => {
    if (currentStep === 0) return TEXT_TRANSLATE_QUIZ.BUTTON_CONTINUE;
    if (currentStep === totalSteps - 2)
      return TEXT_TRANSLATE_QUIZ.BUTTON_SUBMIT;
    return TEXT_TRANSLATE_QUIZ.BUTTON_NEXT;
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (isSubmitting) {
      return <SubmittingState />;
    }

    if (error) {
      return (
        <View className="items-center justify-center rounded-2xl bg-white p-8 shadow-md">
          <MaterialIcons name="error-outline" size={40} color="#F44336" />
          <Text className="mt-4 text-center text-base text-gray-700">
            {error}
          </Text>
          <TouchableOpacity
            className="mt-6 rounded-lg bg-[#609084] px-5 py-3"
            onPress={handler.fetchActiveQuiz}
          >
            <Text className="font-medium text-white">Thử lại</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (currentStep === 0) {
      return <SpendingModelReview spendingModels={spendingModels} />;
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
          onNavigateModel={() => {
            router.replace(PATH_NAME.HOME.PERSONAL_EXPENSES_MODEL as any);
          }}
          isButtonBelow={true} // This ensures the button is not shown inside the component
        />
      );
    }
  };

  const isSuggestionPage =
    currentStep === totalSteps - 1 && !isLoading && !isSubmitting;
  const paddingBottom = !isLoading && !isSubmitting ? "pb-24" : "pb-4";

  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-[#f9f9f9]">
      <HeaderSection
        title={TEXT_TRANSLATE_QUIZ.HEADER}
        onBack={currentStep > 0 ? handler.previousStep : undefined}
      />

      <ScrollViewCustom
        showsVerticalScrollIndicator={false}
        className={`${paddingBottom}`}
        isBottomTab={false}
        contentContainerStyle={{ flexGrow: isSuggestionPage ? 1 : undefined }}
      >
        <View className={`p-4 ${isSuggestionPage ? "flex-1" : ""}`}>
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
            buttonText={getButtonText()}
            isDisabled={isNextButtonDisabled()}
          />
        )}

      {isSuggestionPage && (
        <SuggestionButton
          onNavigateModel={() => {
            router.replace(PATH_NAME.HOME.PERSONAL_EXPENSES_MODEL as any);
          }}
        />
      )}
    </SafeAreaViewCustom>
  );
});

export default QuizScreen;
