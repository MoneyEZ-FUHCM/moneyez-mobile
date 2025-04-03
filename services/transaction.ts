import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { transformCommonResponse } from "@/types/system.types";
import { GroupTransaction } from "@/types/transaction.types";

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
      query: ({ groupId, PageIndex, PageSize, status }) => {
        const url = `/transactions/groups?groupId=${groupId}&PageIndex=${PageIndex}&PageSize=${PageSize}&status=${status}&sort_by=date&dir=desc&is_deleted=false`;
        // const url = `/transactions/groups?groupId=${groupId}?PageIndex=${PageIndex}&PageSize=${PageSize}&sort_by=date&dir=desc&is_deleted=false`;
        console.log("checkj url", url);
        return {
          url: url,
          method: HTTP_METHOD.GET,
        };
      },
      transformResponse: (response) =>
        transformCommonResponse<GroupTransaction>(response),
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
} = transactionApi;

export default transactionApi;
