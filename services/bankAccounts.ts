import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { BankAccount } from "@/types/bankAccount.types";
import { transformCommonResponse } from "@/types/system.types";

const { HTTP_METHOD } = COMMON_CONSTANT;
const bankAccountsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBankAccounts: builder.query({
      query: ({ PageIndex, PageSize }) => ({
        url: `/bank-accounts/user?PageIndex=${PageIndex}&PageSize=${PageSize}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformCommonResponse<BankAccount>(response),
      providesTags: ["bank-accounts"],
    }),
    createBankAccount: builder.mutation({
      query: (payload) => ({
        url: "/bank-accounts",
        method: HTTP_METHOD.POST,
        body: payload,
      }),
      invalidatesTags: ["bank-accounts"],
    }),
    deleteBankAccount: builder.mutation({
      query: (id) => ({
        url: `/bank-accounts/${id}`,
        method: HTTP_METHOD.DELETE,
      }),
      invalidatesTags: ["bank-accounts"],
    }),
    updateBankAccount: builder.mutation({
      query: (payload) => ({
        url: "/bank-accounts",
        method: HTTP_METHOD.PUT,
        body: payload,
      }),
      invalidatesTags: ["bank-accounts"],
    }),
  }),
});

export const {
  useCreateBankAccountMutation,
  useGetBankAccountsQuery,
  useDeleteBankAccountMutation,
  useUpdateBankAccountMutation,
} = bankAccountsApi;

export default bankAccountsApi;
