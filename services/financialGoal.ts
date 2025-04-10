import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import {
  FinancialGoal,
  PersonalTransactionFinancialGoals,
} from "@/types/financialGoal.type";
import { transformCommonResponse } from "@/types/system.types";

const { HTTP_METHOD } = COMMON_CONSTANT;
const financialGoalApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPersonalFinancialGoals: builder.query({
      query: ({ PageIndex, PageSize }) => ({
        url: `/financial-goals/personal?PageIndex=${PageIndex}&PageSize=${PageSize}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformCommonResponse<FinancialGoal>(response),
      providesTags: ["FinancialGoal"],
    }),
    createFinancialGoal: builder.mutation({
      query: (data) => ({
        url: `/financial-goals/personal`,
        method: HTTP_METHOD.POST,
        body: data,
      }),
      invalidatesTags: ["FinancialGoal"],
    }),
    getFinancialGoalById: builder.query({
      query: ({ id }) => ({
        url: `/financial-goals/personal/${id}`,
        method: HTTP_METHOD.GET,
      }),
    }),
    getPersonalTransactionFinancialGoals: builder.query({
      query: ({ id, PageIndex, PageSize }) => ({
        url: `/financial-goals/personal/transaction/${id}?PageIndex=${PageIndex}&PageSize=${PageSize}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformCommonResponse<PersonalTransactionFinancialGoals>(response),
    }),
    getPersonalLimitBudgetSubcategory: builder.query({
      query: ({ id }) => ({
        url: `/financial-goals/personal/limit-budget/subcategory/${id}`,
        method: HTTP_METHOD.GET,
      }),
    }),
    getPersonalFinancialGoalChart: builder.query({
      query: ({ goalId, type }) => ({
        url: `/financial-goals/personal/chart/${goalId}?type=${type}`,
        method: HTTP_METHOD.GET,
      }),
    }),
    updateFinancialGoal: builder.mutation({
      query: (payload) => ({
        url: `/financial-goals/personal`,
        method: HTTP_METHOD.PUT,
        body: payload,
      }),
      invalidatesTags: ["FinancialGoal"],
    }),
    getGroupFinancialGoal: builder.query({
      query: ({ groupId }) => ({
        url: `/financial-goals/group?GroupId=${groupId}`,
        method: HTTP_METHOD.GET,
      }),
      providesTags: ["FinancialGoal"],
    }),
    createGroupFinancialGoal: builder.mutation({
      query: (payload) => ({
        url: `/financial-goals/group`,
        method: HTTP_METHOD.POST,
        body: payload,
      }),
      invalidatesTags: ["FinancialGoal"],
    }),
    updateGroupFinancialGoal: builder.mutation({
      query: (payload) => ({
        url: `/financial-goals/group`,
        method: HTTP_METHOD.PUT,
        body: payload,
      }),
      invalidatesTags: ["FinancialGoal"],
    }),
    deleteGroupFinancialGoal: builder.mutation({
      query: ({ id }) => ({
        url: `/financial-goals/group/${id}`,
        method: HTTP_METHOD.DELETE,
      }),
      invalidatesTags: ["FinancialGoal"],
    }),
    getPersonalFinancialGoalUserSpendingModel: builder.query({
      query: ({ id }) => ({
        url: `/financial-goals/personal/user-spending-model/${id}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformCommonResponse<FinancialGoal>(response),
      providesTags: ["FinancialGoal"],
    }),
  }),
});

export const {
  useGetPersonalFinancialGoalsQuery,
  useCreateFinancialGoalMutation,
  useGetFinancialGoalByIdQuery,
  useGetPersonalTransactionFinancialGoalsQuery,
  useGetPersonalLimitBudgetSubcategoryQuery,
  useGetPersonalFinancialGoalChartQuery,
  useUpdateFinancialGoalMutation,
  useGetGroupFinancialGoalQuery,
  useCreateGroupFinancialGoalMutation,
  useUpdateGroupFinancialGoalMutation,
  useDeleteGroupFinancialGoalMutation,
  useGetPersonalFinancialGoalUserSpendingModelQuery,
} = financialGoalApi;

export default financialGoalApi;
