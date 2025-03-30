import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { ChatMessageHistory } from "@/types/bot.types";
import { transformCommonResponse } from "@/types/system.types";

const { HTTP_METHOD } = COMMON_CONSTANT;
const botApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBotHistory: builder.query({
      query: ({ PageIndex, PageSize }) => ({
        url: `/chats/conversation/messages/user?PageIndex=${PageIndex}&PageSize=${PageSize}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) =>
        transformCommonResponse<ChatMessageHistory>(response),
    }),
  }),
});

export const { useGetBotHistoryQuery } = botApi;

export default botApi;
