import { useGetActiveQuizQuery, useSubmitQuizMutation } from "@/services/quiz";
import { useGetSpendingModelQuery } from "@/services/spendingModel";
import { Quiz, QuizAnswer, QuizAnswerOption, QuizSubmitRequest, QuizSubmitResponse } from "@/types/quiz.types";
import { useState } from "react";
import { ToastAndroid } from "react-native";

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
  };
}

interface SpendingModelData {
  id: string;
  name: string;
  nameUnsign: string;
  description: string;
  isTemplate: boolean;
  spendingModelCategories: SpendingModelCategory[];
}

interface RecommendedModelData {
  id: string;
  name: string;
  description: string;
}

interface RecommendationResponse {
  recommendedModel: RecommendedModelData;
  alternativeModels: RecommendedModelData[];
  reasoning: string;
}

interface Answer {
  option: QuizAnswerOption | null;
  customAnswer: string;
  isCustom: boolean;
}

interface AnswersState {
  [questionId: string]: Answer;
}

const calculateTotalSteps = (quiz: Quiz | null) => {
  if (!quiz) return 2;
  return 1 + quiz.questions.length + 1;
};

const useQuiz = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [customAnswers, setCustomAnswers] = useState<{[questionId: string]: string}>({});
  const [suggestedModel, setSuggestedModel] = useState<SpendingModelData | null>(null);
  const [quizSubmitResponse, setQuizSubmitResponse] = useState<QuizSubmitResponse | null>(null);
  const [recommendationData, setRecommendationData] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { data: quizData, isLoading, refetch: refetchQuiz } = useGetActiveQuizQuery({});
  const { data: spendingModelsData } = useGetSpendingModelQuery({});
  const [submitQuizMutation, { isLoading: isSubmitting }] = useSubmitQuizMutation();
  
  const quiz = quizData?.data || null;
  const spendingModels = spendingModelsData?.items || [];
  
  const totalSteps = calculateTotalSteps(quiz);

  const fetchActiveQuiz = () => {
    setError(null);
    refetchQuiz()
      .unwrap()
      .then(() => {
      })
      .catch((err) => {
        console.log(err);
        ToastAndroid.show("Có lỗi khi load quiz", ToastAndroid.SHORT);
        setError("Có lỗi khi load quiz");
      });
  };
  
  const getModelFromRecommendation = (modelId: string): SpendingModelData | null => {
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

  const selectAnswer = (questionId: string, answerOption: QuizAnswerOption | null, isCustom: boolean = false, customValue: string = ""): void => {
    setAnswers({
      ...answers,
      [questionId]: {
        option: answerOption,
        customAnswer: isCustom ? customValue : (answerOption?.content || ""),
        isCustom
      },
    });
    
    if (isCustom) {
      setCustomAnswers({
        ...customAnswers,
        [questionId]: customValue
      });
    }
  };
  
  const updateCustomAnswer = (questionId: string, value: string): void => {
    setCustomAnswers({
      ...customAnswers,
      [questionId]: value
    });
    
    if (answers[questionId]?.isCustom) {
      setAnswers({
        ...answers,
        [questionId]: {
          ...answers[questionId],
          customAnswer: value
        },
      });
    }
  };

  const handleQuizSubmission = async (): Promise<void> => {
    if (!quiz) return;
    
    const payload: QuizSubmitRequest = {
      quizId: quiz.id,
      answers: Object.keys(answers).map((questionId): QuizAnswer => {
        const answer = answers[questionId];
        
        return {
          questionId,
          answerOptionId: answer.isCustom ? null : answer.option?.id || null,
          answerContent: answer.isCustom ? answer.customAnswer : (answer.option?.content || ""),
        };
      }),
    };
    
    try {
      const response = await submitQuizMutation(payload).unwrap();
      
      if (response.status === 200 && response.data) {
        setQuizSubmitResponse(response.data);
        
        if (response.data.recommendedModel) {
          setRecommendationData(response.data.recommendedModel);
          
          // Get the full model with categories from our data
          const recommendedId = response.data.recommendedModel.recommendedModel.id;
          const fullModel = getModelFromRecommendation(recommendedId);
          setSuggestedModel(fullModel);
        }
        
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
      customAnswers,
      suggestedModel,
      isLoading,
      isSubmitting,
      error,
      quizSubmitResponse,
      recommendationData,
    },
    handler: {
      nextStep,
      previousStep,
      selectAnswer,
      updateCustomAnswer,
      handleQuizSubmission,
      fetchActiveQuiz,
    },
  };
};

export default useQuiz;
