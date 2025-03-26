import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { GroupDetail } from "@/types/group.type";
import { transformCommonResponse } from "@/types/system.types";

const { HTTP_METHOD } = COMMON_CONSTANT;
const groupApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query({
      query: ({ PageIndex, PageSize }) => ({
        url: `/groups?PageIndex=${PageIndex}&PageSize=${PageSize}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformCommonResponse<GroupDetail>(response),
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
    requestFund: builder.mutation({
      query: (payload) => ({
        url: `/groups/funds/request`,
        method: HTTP_METHOD.POST,
        body: payload,
      }),
      invalidatesTags: ["Group"],
    }),
    getGroupDetail: builder.query({
      query: ({ id }) => ({
        url: `/groups/${id}`,
        method: HTTP_METHOD.GET,
      }),
    }),
    getGroupLogs: builder.query({
      query: () => ({
        url: `/groups/group-logs`,
        method: HTTP_METHOD.GET,
      }),
    }),
    getMemberLogs: builder.query({
      query: () => ({
        url: `/groups/member-logs`,
        method: HTTP_METHOD.GET,
      }),
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useRequestFundMutation,
  useGetGroupDetailQuery,
  useGetGroupLogsQuery,
  useGetMemberLogsQuery,
} = groupApi;

export default groupApi;
