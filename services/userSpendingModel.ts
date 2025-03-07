import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { UserSpendingChart } from "@/types/category.types";
import { UserSpendingModel } from "@/types/spendingModel.types";
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
    getCurrentUserSpendingModel: builder.query<
      { data: UserSpendingModel },
      void
    >({
      query: () => ({
        url: `user-spending-models/current`,
        method: HTTP_METHOD.GET,
      }),
    }),
    getCurrentUserSpendingModelChart: builder.query({
      query: () => ({
        url: `user-spending-models/current/chart`,
        method: HTTP_METHOD.GET,
      }),
    }),
    getCurrentUserSpendingModelChartDetail: builder.query({
      query: ({ id }) => ({
        url: `user-spending-models/chart/${id}`,
        method: HTTP_METHOD.GET,
      }),
    }),
  }),
});

export const {
  useGetCurrentUserSpendingModelQuery,
  useGetUserSpendingModelQuery,
  useGetCurrentUserSpendingModelChartQuery,
  useGetCurrentUserSpendingModelChartDetailQuery,
} = transactionApi;

export default transactionApi;
