import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { transformCommonResponse } from "@/types/system.types";

const { HTTP_METHOD } = COMMON_CONSTANT;
const transactionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserSpendingModel: builder.query({
      query: ({ PageIndex, PageSize }) => ({
        url: `user-spending-models?PageIndex=${PageIndex}&PageSize=${PageSize}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) => transformCommonResponse(response),
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
