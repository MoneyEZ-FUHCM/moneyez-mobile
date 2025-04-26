import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { ChatMessageHistory } from "@/helpers/types/bot.types";
import { Post } from "@/helpers/types/post.types";
import { transformCommonResponse } from "@/helpers/types/system.types";

const { HTTP_METHOD } = COMMON_CONSTANT;
const postApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPostList: builder.query({
      query: ({ PageIndex, PageSize }) => ({
        url: `/posts?PageIndex=${PageIndex}&PageSize=${PageSize}&is_deleted=false`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) => transformCommonResponse<Post>(response),
    }),
    getPostDetail: builder.query({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: HTTP_METHOD.GET,
      }),
    }),
  }),
});

export const { useGetPostListQuery, useGetPostDetailQuery } = postApi;

export default postApi;
