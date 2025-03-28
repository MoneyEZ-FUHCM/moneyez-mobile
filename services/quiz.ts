import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { Quiz } from "@/types/quiz.types";
import { transformCommonResponse } from "@/types/system.types";

const { HTTP_METHOD } = COMMON_CONSTANT;
const quizApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActiveQuiz: builder.query({
      query: () => ({
        url: '/quiz/active',
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) => transformCommonResponse<Quiz>(response),
      providesTags: ["Quiz"],
    }),
    submitQuiz: builder.mutation({
      query: (data) => ({
        url: '/api/v1/quiz/submit',
        method: HTTP_METHOD.POST,
        body: data,
      }),
      invalidatesTags: ["Quiz"],
    }),
  }),
});

export const {
  useGetActiveQuizQuery,
  useSubmitQuizMutation,
} = quizApi;

export default quizApi;