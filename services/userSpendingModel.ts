import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { UserSpendingModel } from "@/helpers/types/spendingModel.types";
import { transformCommonResponse } from "@/helpers/types/system.types";
import { Transaction } from "@/helpers/types/transaction.types";

const { HTTP_METHOD } = COMMON_CONSTANT;
const userSpendingModelApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserSpendingModel: builder.query({
      query: ({ PageIndex, PageSize }) => ({
        url: `user-spending-models?PageIndex=${PageIndex}&PageSize=${PageSize}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) => transformCommonResponse(response),
      providesTags: ["UserSpendingModel"],
    }),
    getCurrentUserSpendingModel: builder.query<
      { data: UserSpendingModel },
      void
    >({
      query: () => ({
        url: `user-spending-models/current`,
        method: HTTP_METHOD.GET,
      }),
      providesTags: ["UserSpendingModel"],
    }),
    getCurrentUserSpendingModelChart: builder.query({
      query: () => ({
        url: `user-spending-models/current/chart`,
        method: HTTP_METHOD.GET,
      }),
      providesTags: ["UserSpendingModel"],
    }),
    getCurrentUserSpendingModelChartDetail: builder.query({
      query: ({ id }) => ({
        url: `user-spending-models/chart/${id}`,
        method: HTTP_METHOD.GET,
      }),
      providesTags: ["UserSpendingModel"],
    }),
    getTransactionById: builder.query({
      query: ({ id, PageIndex, PageSize, type }) => ({
        url: `/user-spending-models/transactions/${id}?PageIndex=${PageIndex}&PageSize=${PageSize}${type !== "" ? `&type=${type}` : ""}&is_deleted=false&sort_by=date&dir=desc`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformCommonResponse<Transaction>(response),
    }),
    getUserSpendingModelDetail: builder.query<
      { data: UserSpendingModel },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/user-spending-models/${id}`,
        method: HTTP_METHOD.GET,
      }),
    }),
    createUserSpendingModel: builder.mutation({
      query: (payload) => ({
        url: `/user-spending-models/choose`,
        method: HTTP_METHOD.POST,
        body: payload,
      }),
    }),
    getSubCategories: builder.query({
      query: ({ code, type }) => ({
        url: `/user-spending-models/current/sub-categories?type=${type}${code !== "" ? `&category_code=${code}&last_used=true` : "&last_used=true"}`,
        method: HTTP_METHOD.GET,
      }),
    }),
    getCurrentCategories: builder.query({
      query: () => ({
        url: `/user-spending-models/current/categories`,
        method: HTTP_METHOD.GET,
      }),
    }),
    cancelUserSpendingModel: builder.mutation({
      query: ({ spendingModelId }) => ({
        url: `/user-spending-models/cancel?spendingModelId=${spendingModelId}&isBypassGoal=true&isBypassTransaction=false`,
        method: HTTP_METHOD.DELETE,
      }),
      invalidatesTags: ["UserSpendingModel"],
    }),
  }),
});

export const {
  useGetCurrentUserSpendingModelQuery,
  useGetUserSpendingModelQuery,
  useGetCurrentUserSpendingModelChartQuery,
  useGetCurrentUserSpendingModelChartDetailQuery,
  useGetTransactionByIdQuery,
  useGetUserSpendingModelDetailQuery,
  useCreateUserSpendingModelMutation,
  useGetSubCategoriesQuery,
  useGetCurrentCategoriesQuery,
  useCancelUserSpendingModelMutation,
} = userSpendingModelApi;

export default userSpendingModelApi;
