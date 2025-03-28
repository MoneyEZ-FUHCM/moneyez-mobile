import { useState } from "react";
import { spendingModels, SpendingModel } from "@/helpers/constants/spendingModels";

interface AnswerOption {
  id: string;
  content: string;
}

interface Question {
  id: string;
  content: string;
  answerOptions: AnswerOption[];
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

interface AnswersState {
  [questionId: string]: AnswerOption;
}

interface QuizSubmissionPayload {
  quizId: string;
  answers: Array<{
    questionId: string;
    answerOptionId: string | null;
    answerContent: string;
  }>;
  suggestedModel: SpendingModel | null;
}

const constantQuiz: Quiz = {
  id: "250b830f-55a0-4041-d6d5-08dd6c7a2e2a",
  title: "General Knowledge Quiz",
  description: "A quiz about general knowledge.",
  questions: [
    {
      id: "68b134ab-0aa5-4eec-dc4f-08dd6c7a2e34",
      content: "What is the largest planet in our solar system?",
      answerOptions: [
        { id: "cee9e4b5-5598-46a1-6ffc-08dd6c7a2e3b", content: "Earth" },
        { id: "938bb39a-d912-4b6c-6ffd-08dd6c7a2e3b", content: "Jupiter" },
        { id: "0371808e-b1dd-49b1-6ffe-08dd6c7a2e3b", content: "Mars" },
      ],
    },
    {
      id: "84d30e7b-3f7d-4bb3-dc50-08dd6c7a2e34",
      content: "Who wrote 'Hamlet'?",
      answerOptions: [
        { id: "e693637f-9fd3-4621-6fff-08dd6c7a2e3b", content: "Charles Dickens" },
        { id: "95fb0902-eba1-4bb0-7000-08dd6c7a2e3b", content: "William Shakespeare" },
      ],
    },
  ],
};

// Total steps: 1 review + quiz questions + 1 suggestion page
const totalSteps = 1 + constantQuiz.questions.length + 1;

const useQuiz = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  // answers: { [questionId]: answerOption }
  const [answers, setAnswers] = useState<AnswersState>({});
  const [suggestedModel, setSuggestedModel] = useState<SpendingModel | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Simulate suggestion based on quiz answers - randomly select a model for demonstration
  const computeSuggestion = (): SpendingModel => {
    // Simulate a loading effect
    setIsLoading(true);
    
    // Random index between 0 and spendingModels.length - 1
    const randomIndex = Math.floor(Math.random() * spendingModels.length);
    return spendingModels[randomIndex];
  };

  const nextStep = (): void => {
    // When moving from last quiz question to suggestion page, compute suggestion.
    if (currentStep === totalSteps - 2) {
      setIsLoading(true);
      
      // Simulate network delay for more realistic feel
      setTimeout(() => {
        const suggestion = computeSuggestion();
        setSuggestedModel(suggestion);
        setIsLoading(false);
        setCurrentStep(currentStep + 1);
      }, 1500);
    } else if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const selectAnswer = (questionId: string, answerOption: AnswerOption): void => {
    setAnswers({
      ...answers,
      [questionId]: answerOption,
    });
  };

  const handleSubmit = (): void => {
    // Prepare submission payload
    const payload: QuizSubmissionPayload = {
      quizId: constantQuiz.id,
      answers: constantQuiz.questions.map((q) => ({
        questionId: q.id,
        answerOptionId: answers[q.id]?.id || null,
        answerContent: answers[q.id]?.content || "",
      })),
      suggestedModel,
    };
    console.log("Submitting Quiz", payload);
    alert("Quiz submitted successfully!");
  };

  return {
    state: {
      currentStep,
      totalSteps,
      quiz: constantQuiz,
      spendingModels,
      answers,
      suggestedModel,
      isLoading,
    },
    handler: {
      nextStep,
      previousStep,
      selectAnswer,
      handleSubmit,
    },
  };
};

export default useQuiz;
