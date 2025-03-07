import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { transformCommonResponse } from "@/types/system.types";

const { HTTP_METHOD } = COMMON_CONSTANT;
const groupApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query({
      query: ({ PageIndex, PageSize }) => ({
        url: `/groups?PageIndex=${PageIndex}&PageSize=${PageSize}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) => transformCommonResponse(response),
      providesTags: ["Group"],
    }),
    createGroup: builder.mutation({
      query: (payload) => ({
        url: "/groups",
        method: HTTP_METHOD.POST,
        body: payload,
      }),
      invalidatesTags: ["Group"],
    }),
    updateGroup: builder.mutation({
      query: (payload) => ({
        url: `/groups/${payload.id}`,
        method: HTTP_METHOD.PUT,
        body: payload,
      }),
      invalidatesTags: ["Group"],
    }),
    deleteGroup: builder.mutation({
      query: (id) => ({
        url: `/groups/${id}`,
        method: HTTP_METHOD.DELETE,
      }),
      invalidatesTags: ["Group"],
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
} = groupApi;

export default groupApi;
