import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { transformCommonResponse, transformTransactionsResponse } from "@/types/system.types";
import { GroupTransaction, TransactionsReportAllTime, TransactionsReportCategoryAllTime, TransactionsReportCategoryYear, TransactionsReportYearlyBalance, TransactionsReportYearlyData } from "@/types/transaction.types";

const { HTTP_METHOD } = COMMON_CONSTANT;
const transactionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTransaction: builder.mutation({
      query: (payload) => ({
        url: "transactions/user",
        method: HTTP_METHOD.POST,
        body: payload,
      }),
      invalidatesTags: ["transaction"],
    }),
    getTransaction: builder.query({
      query: ({ PageIndex, PageSize }) => ({
        url: `transactions/user?PageIndex=${PageIndex}&PageSize=${PageSize}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) => transformCommonResponse(response),
      providesTags: ["transaction"],
    }),
    getTransactionByModel: builder.query({
      query: ({ modelId, PageIndex, PageSize }) => ({
        url: `transactions/user-spending-model/${modelId}?PageIndex=${PageIndex}&PageSize=${PageSize}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) => transformCommonResponse(response),
      providesTags: ["transaction"],
    }),
    getTransactionDetail: builder.query({
      query: ({ transactionId }) => ({
        url: `/transactions/user/${transactionId}`,
        method: HTTP_METHOD.GET,
      }),
    }),
    getGroupTransaction: builder.query({
      query: ({ id, PageIndex, PageSize }) => ({
        url: `/transactions/groups?groupId=${id}&PageIndex=${PageIndex}&PageSize=${PageSize}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformCommonResponse<GroupTransaction>(response),
    }),
    getReportTransactionYear: builder.query({
      query: ({ year, type }) => ({
        url: `transactions/report/year?year=${year}&type=${type}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformTransactionsResponse<TransactionsReportYearlyData>(response),
    }),
    getReportTransactionCategoryYear: builder.query({
      query: ({ year, type }) => ({
        url: `transactions/report/category-year?year=${year}&type=${type}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformTransactionsResponse<TransactionsReportCategoryYear>(response),
    }),
    getReportTransactionAllTime: builder.query({
      query: () => ({
        url: `transactions/report/all-time`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformTransactionsResponse<TransactionsReportAllTime>(response),
    }),
    getReportTransactionAllTimeCategory: builder.query({
      query: ({ type }) => ({
        url: `transactions/report/all-time-category?type=${type}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformTransactionsResponse<TransactionsReportCategoryAllTime>(response),
    }),
    getReportTransactionBalanceYear: builder.query({
      query: ({ year }) => ({
        url: `transactions/report/balance-year?year=${year}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformTransactionsResponse<TransactionsReportYearlyBalance>(response)
      ,
    }),
    getRecurringTransactionsCalendar: builder.query({
      query: () => ({
        url: `recurring-transactions/calendar`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformTransactionsResponse<Number[]>(response)
      ,
    }),
  }),
});

export const {
  useCreateTransactionMutation,
  useGetTransactionQuery,
  useGetTransactionByModelQuery,
  useLazyGetTransactionDetailQuery,
  useGetTransactionDetailQuery,
  useGetGroupTransactionQuery,
  useGetReportTransactionYearQuery,
  useGetReportTransactionCategoryYearQuery,
  useGetReportTransactionAllTimeCategoryQuery,
  useGetReportTransactionAllTimeQuery,
  useGetReportTransactionBalanceYearQuery,
  useGetRecurringTransactionsCalendarQuery
} = transactionApi;

export default transactionApi;
