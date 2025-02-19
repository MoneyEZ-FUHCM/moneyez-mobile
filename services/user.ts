import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";

const { HTTP_METHOD } = COMMON_CONSTANT;
const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateInfo: builder.mutation({
      query: (payload) => ({
        url: "/users",
        method: HTTP_METHOD.POST,
        body: payload,
      }),
    }),
  }),
});

export const { useUpdateInfoMutation } = userApi;

export default userApi;
