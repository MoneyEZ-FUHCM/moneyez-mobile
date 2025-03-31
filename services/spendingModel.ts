import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { SpendingModelMap } from "@/types/spendingModel.types";
import { transformCommonResponse } from "@/types/system.types";

const { HTTP_METHOD } = COMMON_CONSTANT;
const spendingModelApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSpendingModelDetail: builder.query({
      query: ({ id }) => ({
        url: `/spending-models/${id}`,
        method: HTTP_METHOD.GET,
        invalidatesTags: ["spendingModel"],
      }),
    }),
    getSpendingModel: builder.query({
      query: () => ({
        url: `/spending-models`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformCommonResponse<SpendingModelMap>(response),
      providesTags: ["spendingModel"],
    }),
  }),
});

export const { useGetSpendingModelDetailQuery, useGetSpendingModelQuery } =
  spendingModelApi;

export default spendingModelApi;
