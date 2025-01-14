import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { router } from "expo-router";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { BASE_URL } from "@env";

interface RefreshResultData {
  accessToken: string;
}

const axiosBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: {},
) => {
  const { HTTP_STATUS } = COMMON_CONSTANT;
  const { AUTH } = PATH_NAME;
  let token = await AsyncStorage.getItem("accessToken");

  const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  if (
    result.error &&
    result.error.status === HTTP_STATUS.CLIENT_ERROR.UNAUTHORIZED
  ) {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    const rfToken = JSON.stringify(refreshToken);

    if (rfToken) {
      const res = await baseQuery(
        {
          url: "/authen/refresh-token",
          method: "POST",
          body: rfToken,
        },
        api,
        extraOptions,
      );

      const refreshData = res.data as RefreshResultData | undefined;

      if (refreshData) {
        const newAccessToken = refreshData.accessToken;
        await AsyncStorage.setItem("accessToken", newAccessToken);
        token = newAccessToken;

        if (typeof args === "object") {
          result = await baseQuery(
            {
              ...args,
              headers: {
                ...args.headers,
                Authorization: `Bearer ${newAccessToken}`,
              },
            },
            api,
            extraOptions,
          );
        }
      } else {
        await AsyncStorage.clear();
        router.replace(AUTH.LOGIN as any);
      }
    }
  }

  return result;
};

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery,
  endpoints: () => ({}),
});

export default apiSlice;
