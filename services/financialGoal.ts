import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { FinancialGoal } from "@/types/financialGoal.type";
import { transformCommonResponse } from "@/types/system.types";

const { HTTP_METHOD } = COMMON_CONSTANT;
const financialGoalApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPersonalFinancialGoals: builder.query({
      query: ({ PageIndex, PageSize }) => ({
        url: `/financial-goals/personal?PageIndex=${PageIndex}&PageSize=${PageSize}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformCommonResponse<FinancialGoal>(response),
      providesTags: ["FinancialGoal"],
    }),
    
  }),
});

export const {
  useGetPersonalFinancialGoalsQuery
} = financialGoalApi;

export default financialGoalApi;
