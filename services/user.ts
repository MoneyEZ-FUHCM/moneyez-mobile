import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { transformCommonResponse } from "@/types/system.types";
import { UserInfo } from "@/types/user.types";

const { HTTP_METHOD } = COMMON_CONSTANT;
const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateInfo: builder.mutation({
      query: (payload) => ({
        url: "/users",
        method: HTTP_METHOD.PUT,
        body: payload,
      }),
    }),
    getUsers: builder.query({
      query: ({ search }) => ({
        url: `/users?search=${search}&field=email`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformCommonResponse<UserInfo>(response),
    }),
  }),
});

export const { useUpdateInfoMutation, useGetUsersQuery } = userApi;

export default userApi;
