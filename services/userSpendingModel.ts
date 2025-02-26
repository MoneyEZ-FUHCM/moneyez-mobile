import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";

const { HTTP_METHOD } = COMMON_CONSTANT;
const transactionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserSpendingModel: builder.query({
      query: ({ PageIndex, PageSize }) => ({
        url: `user-spending-models?PageIndex=${PageIndex}&PageSize=${PageSize}`,
        method: HTTP_METHOD.GET,
      }),
    }),
    getCurrentUserSpendingModel: builder.query({
      query: () => ({
        url: `user-spending-models/current`,
        method: HTTP_METHOD.GET,
      }),
    }),
  }),
});

export const { useGetCurrentUserSpendingModelQuery, useGetUserSpendingModelQuery  } = transactionApi;

export default transactionApi;
