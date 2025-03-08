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
      providesTags: ["UserSpendingModel"],
    }),
    getCurrentUserSpendingModel: builder.query<{ data: UserSpendingModel }, void>({
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
  }),
});

export const {
  useGetCurrentUserSpendingModelQuery,
  useGetUserSpendingModelQuery,
  useGetCurrentUserSpendingModelChartQuery,
  useGetCurrentUserSpendingModelChartDetailQuery,
} = transactionApi;

export default transactionApi;
