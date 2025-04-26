export interface QuizAnswerOption {
  id: string;
  content: string;
}

export interface QuizQuestion {
  id: string;
  content: string;
  answerOptions: QuizAnswerOption[];
}

export interface Answer {
  option: QuizAnswerOption | null;
  customAnswer: string;
  isCustom: boolean;
}

export interface AnswersState {
  [questionId: string]: Answer;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  status: number;
  version: string;
  questions: QuizQuestion[];
  createdDate: string;
  createdBy: string | null;
  updatedDate: string | null;
  updatedBy: string | null;
  isDeleted: boolean;
}

export interface QuizAnswer {
  questionId: string;
  answerOptionId: string | null;
  answerContent: string;
}

export interface QuizSubmitRequest {
  quizId: string;
  answers: QuizAnswer[];
}

export interface QuizUserAnswer {
  questionId: string;
  answerOptionId: string | null;
  answerContent: string;
}

export interface BudgetModel {
  id: string;
  name: string;
  description: string;
}

export interface RecommendationResult {
  recommendedModel: BudgetModel;
  alternativeModels: BudgetModel[];
  reasoning: string;
}

export interface QuizSubmitResponse {
  id: string;
  userId: string;
  quizId: string;
  quizVersion: string;
  takenAt: string;
  recommendedModel: RecommendationResult;
  answers: QuizUserAnswer[];
}

export interface SpendingModelCategory {
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

export interface SpendingModelData {
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

export interface RecommendationResponse {
  recommendedModel: RecommendedModelData;
  alternativeModels: RecommendedModelData[];
  reasoning: string;
}