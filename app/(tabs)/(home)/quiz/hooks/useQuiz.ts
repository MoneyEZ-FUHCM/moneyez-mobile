import { SpendingModel, spendingModels } from "@/helpers/constants/spendingModels";
import { useGetActiveQuizQuery, useSubmitQuizMutation } from "@/services/quiz";
import { Quiz, QuizAnswerOption, QuizSubmitRequest, QuizSubmitResponse } from "@/types/quiz.types";
import { useState } from "react";
import { ToastAndroid } from "react-native";

interface AnswersState {
  [questionId: string]: QuizAnswerOption;
}

const calculateTotalSteps = (quiz: Quiz | null) => {
  if (!quiz) return 2; // Just the review and suggestion page as placeholders
  return 1 + quiz.questions.length + 1;
};

const useQuiz = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [suggestedModel, setSuggestedModel] = useState<SpendingModel | null>(null);
  const [quizSubmitResponse, setQuizSubmitResponse] = useState<QuizSubmitResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { data: quizData, isLoading, refetch: refetchQuiz } = useGetActiveQuizQuery({});
  const [submitQuizMutation, { isLoading: isSubmitting }] = useSubmitQuizMutation();
  
  const quiz = quizData?.items[0] || null;
  
  const totalSteps = calculateTotalSteps(quiz);

  const fetchActiveQuiz = () => {
    setError(null);
    refetchQuiz()
      .unwrap()
      .then(() => {
        // Success is already handled by the RTK Query hook
      })
      .catch((err) => {
        console.log(err);
        ToastAndroid.show("Có lỗi khi load quiz", ToastAndroid.SHORT);
        setError("Có lỗi khi load quiz");
      });
  };
  
  const getSpendingModelFromRecommendation = (modelId: string): SpendingModel | null => {
    const model = spendingModels.find(m => m.id === modelId);
    return model || null;
  };

  const nextStep = (): void => {
    if (quiz && currentStep === totalSteps - 2) {
      handleQuizSubmission();
    } else if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const selectAnswer = (questionId: string, answerOption: QuizAnswerOption): void => {
    setAnswers({
      ...answers,
      [questionId]: answerOption,
    });
  };

  const handleQuizSubmission = async (): Promise<void> => {
    if (!quiz) return;
    
    // Prepare submission payload
    const payload: QuizSubmitRequest = {
      quizId: quiz.id,
      answers: Object.keys(answers).map((questionId) => ({
        answerOptionId: answers[questionId].id,
        answerContent: answers[questionId].content,
      })),
    };
    
    try {
      const response = await submitQuizMutation(payload).unwrap();
      if (response.status === 200 && response.data) {
        setQuizSubmitResponse(response.data);
        
        // Get the suggested model based on the recommendation
        const model = getSpendingModelFromRecommendation(response.data.recommendedModel);
        setSuggestedModel(model);
        
        // Move to the suggestion page
        setCurrentStep(totalSteps - 1);
        ToastAndroid.show("Đã hoàn thành quiz thành công", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Lỗi khi submit quiz", ToastAndroid.SHORT);
        console.log(response.message);
      }
    } catch (err) {
      ToastAndroid.show("Lỗi khi submit quiz", ToastAndroid.SHORT);
      console.log(err);
    }
  };

  return {
    state: {
      currentStep,
      totalSteps,
      quiz,
      spendingModels,
      answers,
      suggestedModel,
      isLoading,
      isSubmitting,
      error,
      quizSubmitResponse,
    },
    handler: {
      nextStep,
      previousStep,
      selectAnswer,
      handleQuizSubmission,
      fetchActiveQuiz,
    },
  };
};

export default useQuiz;
