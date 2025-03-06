import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { transformCommonResponse } from "@/types/system.types";
import { Transaction } from "@/types/transaction.types";

const { HTTP_METHOD } = COMMON_CONSTANT;
const transactionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTransaction: builder.mutation({
      query: (payload) => ({
        url: "transactions/user",
        method: HTTP_METHOD.POST,
        body: payload,
      }),
    }),
    getTransaction: builder.query({
      query: ({ PageIndex, PageSize }) => ({
        url: `transactions/user?PageIndex=${PageIndex}&PageSize=${PageSize}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) => transformCommonResponse(response),
    }),
    getTransactionByModel: builder.query({
      query: ({ modelId, PageIndex, PageSize }) => ({
        url: `transactions/user-spending-model/${modelId}?PageIndex=${PageIndex}&PageSize=${PageSize}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) => transformCommonResponse(response),
    }),
    getTransactionById: builder.query({
      query: ({ id, PageIndex, PageSize }) => ({
        url: `/user-spending-models/transactions/${id}?PageIndex=${PageIndex}&PageSize=${PageSize}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformCommonResponse<Transaction>(response),
    }),
  }),
});

export const {
  useCreateTransactionMutation,
  useGetTransactionQuery,
  useGetTransactionByModelQuery,
  useGetTransactionByIdQuery,
} = transactionApi;

export default transactionApi;
