import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { Notification } from "@/helpers/types/notification.type";
import { transformCommonResponse } from "@/helpers/types/system.types";

const { HTTP_METHOD } = COMMON_CONSTANT;
const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotification: builder.query({
      query: ({ PageIndex, PageSize, type }) => {
        const url = `/notifications/user?PageIndex=${PageIndex}&PageSize=${PageSize}&sort_by=date&dir=desc`;
        return {
          url: type ? `${url}&type=${type}` : url,
          method: HTTP_METHOD.GET,
        };
      },
      transformResponse: (response) =>
        transformCommonResponse<Notification>(response),
      providesTags: ["Notification"],
    }),
    getNotificationById: builder.query({
      query: ({ id }) => ({
        url: `/notifications/${id}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformCommonResponse<Notification>(response),
      providesTags: ["Notification"],
    }),
    readNotification: builder.query({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/mark-isread`,
        method: HTTP_METHOD.GET,
      }),
    }),
    readAllNotification: builder.mutation({
      query: () => ({
        url: `/notifications/mark-all-isread`,
        method: HTTP_METHOD.GET,
      }),
      invalidatesTags: ["Notification"],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: HTTP_METHOD.DELETE,
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationQuery,
  useGetNotificationByIdQuery,
  useReadAllNotificationMutation,
  useDeleteNotificationMutation,
  useLazyReadNotificationQuery,
} = notificationApi;

export default notificationApi;
