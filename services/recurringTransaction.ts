import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";

const { HTTP_METHOD } = COMMON_CONSTANT;
const recurringTransactionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecurringTransaction: builder.query({
      query: ({ PageIndex, PageSize, isActive }) => ({
        url: `/recurring-transactions?PageIndex=${PageIndex}&PageSize=${PageSize}&IsActive=${isActive}&is_deleted=false`,
        method: HTTP_METHOD.GET,
      }),
      providesTags: ["RecurringTransaction"],
    }),
    getRecurringTransactionById: builder.query({
      query: ({ id }) => ({
        url: `/recurring-transactions/${id}`,
        method: HTTP_METHOD.GET,
      }),
      providesTags: ["RecurringTransaction"],
    }),
    createRecurringTransaction: builder.mutation({
      query: (payload) => ({
        url: `/recurring-transactions`,
        method: HTTP_METHOD.POST,
        body: payload,
      }),
      invalidatesTags: ["RecurringTransaction"],
    }),
    updateRecurringTransaction: builder.mutation({
      query: (payload) => ({
        url: `/recurring-transactions`,
        method: HTTP_METHOD.PUT,
        body: payload,
      }),
      invalidatesTags: ["RecurringTransaction"],
    }),
    deleteRecurringTransaction: builder.mutation({
      query: ({ id }) => ({
        url: `/recurring-transactions/${id}`,
        method: HTTP_METHOD.DELETE,
      }),
      invalidatesTags: ["RecurringTransaction"],
    }),
    getRecurringTransactionCalendar: builder.query({
      query: () => ({
        url: `/recurring-transactions/calendar`,
        method: HTTP_METHOD.GET,
      }),
      providesTags: ["RecurringTransaction"],
    }),
  }),
});

export const {
  useGetRecurringTransactionQuery,
  useGetRecurringTransactionByIdQuery,
  useCreateRecurringTransactionMutation,
  useUpdateRecurringTransactionMutation,
  useDeleteRecurringTransactionMutation,
  useGetRecurringTransactionCalendarQuery,
} = recurringTransactionApi;

export default recurringTransactionApi;
