export interface QuizAnswerOption {
  id: string;
  content: string;
}

export interface QuizQuestion {
  id: string;
  content: string;
  answerOptions: QuizAnswerOption[];
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

export interface QuizSubmitResponse {
  id: string;
  userId: string;
  quizId: string;
  quizVersion: string;
  takenAt: string;
  recommendedModel: string;
  answers: QuizUserAnswer[];
}