import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { GroupDetail, GroupLogs } from "@/types/group.type";
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
        url: `/groups/fund-rasising/request`,
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
      query: ({ groupId, PageIndex, PageSize }) => ({
        url: `/groups/logs/${groupId}?PageIndex=${PageIndex}&PageSize=${PageSize}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformCommonResponse<GroupLogs>(response),
    }),
    getMemberLogs: builder.query({
      query: ({ groupId, PageIndex, PageSize }) => ({
        url: `/groups/member-logs?PageIndex=${PageIndex}&PageSize=${PageSize}&GroupId=${groupId}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) => transformCommonResponse(response),
    }),
    inviteMemberEmail: builder.mutation({
      query: (payload) => ({
        url: `/groups/invite-member/email`,
        method: HTTP_METHOD.POST,
        body: payload,
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
  useRequestFundMutation,
  useGetGroupDetailQuery,
  useGetGroupLogsQuery,
  useGetMemberLogsQuery,
  useInviteMemberEmailMutation,
} = groupApi;

export default groupApi;
