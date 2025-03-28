export interface QuizAnswerOption {
  id: string;
  content: string;
  type: string; // STATIC or other types
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
  questions: QuizQuestion[];
}

export interface QuizAnswer {
  answerOptionId: string;
  answerContent: string;
}

export interface QuizSubmitRequest {
  quizId: string;
  answers: QuizAnswer[];
}

export interface UserQuizAnswer {
  id: string;
  answerOptionId: string;
  answerContent: string;
}

export interface QuizSubmitResponse {
  id: string;
  userId: string;
  quizId: string;
  recommendedModel: string;
  userAnswers: UserQuizAnswer[];
}