import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { Notification } from "@/types/notification.type";
import { transformCommonResponse } from "@/types/system.types";

const { HTTP_METHOD } = COMMON_CONSTANT;
const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotification: builder.query({
      query: ({ PageIndex, PageSize, type }) => {
        const url = `/notifications/user?PageIndex=${PageIndex}&PageSize=${PageSize}`;
        return {
          url: type ? `${url}&type=${type}` : url,
          method: HTTP_METHOD.GET,
        };
      },
      transformResponse: (response) => transformCommonResponse<Notification>(response),
      providesTags: ["Notification"],
    }),
    getNotificationById: builder.query({
      query: ({ id }) => ({
        url: `/notifications/${id}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) => transformCommonResponse<Notification>(response),
      providesTags: ["Notification"],
    }),
    readNotification: builder.mutation({
      query: ({ id }) => ({
        url: `/notifications/${id}/mark-is-read`,
        method: HTTP_METHOD.GET,
      }),
      invalidatesTags: ["Notification"],
    }),
    readAllNotification: builder.mutation({
      query: () => ({
        url: `/notifications/mark-all-isread`,
        method: HTTP_METHOD.GET,
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const { useGetNotificationQuery, useGetNotificationByIdQuery, useReadAllNotificationMutation, useReadNotificationMutation } = notificationApi;

export default notificationApi;
