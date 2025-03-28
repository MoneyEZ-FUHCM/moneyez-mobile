import React, { memo } from "react";
import { Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaViewCustom, ScrollViewCustom, SectionComponent } from "@/components";
import useQuiz from "./hooks/useQuiz";
import TEXT_TRANSLATE_QUIZ from "./Quiz.translate";
import SpendingModelReview from "./components/SpendingModelReview";
import QuizQuestion from "./components/QuizQuestion";
import SuggestionPage from "./components/SuggestionPage";
import { router } from "expo-router";
import { PATH_NAME } from "@/helpers/constants/pathname";

// Memoized components to prevent unnecessary re-renders
const LoadingState = memo(() => (
  <View className="bg-white rounded-2xl p-8 shadow-md items-center justify-center">
    <ActivityIndicator size="large" color="#609084" />
    <Text className="mt-4 text-base text-gray-700">
      Đang tải...
    </Text>
  </View>
));

const SubmittingState = memo(() => (
  <View className="bg-white rounded-2xl p-8 shadow-md items-center justify-center">
    <ActivityIndicator size="large" color="#609084" />
    <Text className="mt-4 text-base text-gray-700">
      Phân tích câu trả lời của bạn...
    </Text>
  </View>
));

const HeaderSection = memo(({ title, onBack }: { title: string; onBack?: () => void }) => (
  <SectionComponent rootClassName="h-14 bg-white justify-center shadow-sm">
    <View className="flex-row items-center justify-between px-5">
      {onBack ? (
        <TouchableOpacity onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="#609084" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}
      <Text className="text-lg font-bold text-black">
        {title}
      </Text>
      <View style={{ width: 24 }} />
    </View>
  </SectionComponent>
));

const BottomButtons = memo(
  ({ 
    onPrevious, 
    onNext, 
    showPrevious, 
    buttonText,
    isDisabled
  }: { 
    onPrevious?: () => void; 
    onNext: () => void;
    showPrevious: boolean;
    buttonText: string;
    isDisabled?: boolean;
  }) => (
    <View className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-6 py-4 shadow-lg">
      <View className={`flex-row ${showPrevious ? "justify-between" : "justify-center"}`}>
        {showPrevious && (
          <TouchableOpacity
            onPress={onPrevious}
            className="px-6 py-4 rounded-lg bg-gray-200 items-center"
          >
            <Text className="text-base font-semibold text-gray-800">
              {TEXT_TRANSLATE_QUIZ.BUTTON_PREVIOUS}
            </Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          onPress={onNext}
          disabled={isDisabled}
          className={`px-6 py-4 rounded-lg ${isDisabled ? "bg-gray-300" : "bg-[#609084]"} items-center`}
        >
          <Text className="text-base font-semibold text-white">
            {buttonText}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
);

// Memoized SuggestionButton for the final screen
const SuggestionButton = memo(({ onNavigateModel }: { onNavigateModel: () => void }) => (
  <View className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-6 py-4 shadow-lg">
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
  </View>
));

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
    quizSubmitResponse 
  } = state;

  const quizStepIndex = currentStep - 1;
  
  // Determine if the next button should be disabled (no answer selected for current question)
  const isNextButtonDisabled = () => {
    if (currentStep === 0) return false; // Review page
    if (currentStep >= totalSteps - 1) return false; // Suggestion page
    
    // For question pages, check if the current question has an answer
    const currentQuestion = quiz?.questions[quizStepIndex];
    return currentQuestion ? !answers[currentQuestion.id] : false;
  };
  
  // Determine which button text to show
  const getButtonText = () => {
    if (currentStep === 0) return TEXT_TRANSLATE_QUIZ.BUTTON_CONTINUE;
    if (currentStep === totalSteps - 2) return TEXT_TRANSLATE_QUIZ.BUTTON_SUBMIT;
    return TEXT_TRANSLATE_QUIZ.BUTTON_NEXT;
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }
    
    if (isSubmitting) {
      return <SubmittingState />;
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

  const isSuggestionPage = currentStep === totalSteps - 1 && !isLoading && !isSubmitting;
  const paddingBottom = (!isLoading && !isSubmitting) ? "pb-24" : "pb-4";

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
        <View className={`p-4 ${isSuggestionPage ? 'flex-1' : ''}`}>
          {renderContent()}
        </View>
      </ScrollViewCustom>

      {!isLoading && !isSubmitting && currentStep < totalSteps - 1 && (
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
            router.replace(PATH_NAME.HOME.PERSONAL_EXPENSES_MODEL as any)
          }} 
        />
      )}
    </SafeAreaViewCustom>
  );
});

export default QuizScreen;
