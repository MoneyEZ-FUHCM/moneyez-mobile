import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { transformCommonResponse } from "@/types/system.types";

const { HTTP_METHOD } = COMMON_CONSTANT;
const transactionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTransaction: builder.mutation({
      query: (payload) => ({
        url: "transactions",
        method: HTTP_METHOD.POST,
        body: payload,
      }),
      transformResponse: (response) => transformCommonResponse(response),
    }),
  }),
});

export const { useCreateTransactionMutation } = transactionApi;

export default transactionApi;
