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
        url: `/groups/fund-raising/request`,
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
      query: ({ PageIndex, PageSize, change_type, groupId }) => {
        const url = `/groups/logs/${groupId}?PageIndex=${PageIndex}&PageSize=${PageSize}&sort_by=date&dir=desc&is_deleted=false`;
        return {
          url: change_type ? `${url}&change_type=${change_type}` : url,
          method: HTTP_METHOD.GET,
        };
      },
      transformResponse: (response) =>
        transformCommonResponse<GroupLogs>(response),
      providesTags: ["Group"],
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
    inviteMemberQRCode: builder.mutation({
      query: (payload) => ({
        url: `/groups/invite-member/qrcode`,
        method: HTTP_METHOD.POST,
        body: payload,
      }),
      invalidatesTags: ["Group"],
    }),
    contributeGroup: builder.mutation({
      query: (payload) => ({
        url: `/groups/contribution`,
        method: HTTP_METHOD.PUT,
        body: payload,
      }),
      invalidatesTags: ["Group"],
    }),
    inviteMemberQRCodeAccept: builder.query({
      query: (payload) => ({
        url: `/groups/invite-member/qrcode/accept?token=${payload}`,
        method: HTTP_METHOD.GET,
      }),
    }),
    withDrawFundRequest: builder.mutation({
      query: (payload) => ({
        url: `/groups/fund-withdraw/request`,
        method: HTTP_METHOD.POST,
        body: payload,
      }),
    }),
    leaveGroup: builder.mutation({
      query: (id) => ({
        url: `/groups/members/leave?groupId=${id}`,
        method: HTTP_METHOD.GET,
      }),
      invalidatesTags: ["Group"],
    }),
    kickMember: builder.mutation({
      query: ({ groupId, memberId }) => ({
        url: `/groups/${groupId}/members/${memberId}`,
        method: HTTP_METHOD.GET,
      }),
      invalidatesTags: ["Group"],
    }),
    fundRaisingRemind: builder.mutation({
      query: (payload) => ({
        url: `/groups/fund-raising/remind`,
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
  useInviteMemberQRCodeMutation,
  useContributeGroupMutation,
  useLazyInviteMemberQRCodeAcceptQuery,
  useWithDrawFundRequestMutation,
  useLeaveGroupMutation,
  useKickMemberMutation,
  useFundRaisingRemindMutation,
} = groupApi;

export default groupApi;
