import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { PATH_NAME } from "@/helpers/constants/pathname";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { router } from "expo-router";

interface RefreshResultData {
  accessToken: string;
  refreshToken: string;
}

interface RefreshResponse {
  data?: {
    data?: RefreshResultData;
  };
  error?: unknown;
}

const axiosBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: {},
) => {
  const { HTTP_STATUS, HTTP_METHOD } = COMMON_CONSTANT;
  let token = await AsyncStorage.getItem("accessToken");

  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_BASE_URL,
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

    if (refreshToken) {
      const res = (await baseQuery(
        {
          url: "/auth/refresh-token",
          method: HTTP_METHOD.POST,
          body: JSON.stringify(refreshToken),
        },
        api,
        extraOptions,
      )) as RefreshResponse;

      const refreshData = res?.data?.data;

      if (refreshData) {
        const { accessToken, refreshToken: newRefreshToken } = refreshData;
        await AsyncStorage.setItem("accessToken", accessToken);
        await AsyncStorage.setItem("refreshToken", newRefreshToken);
        token = accessToken;

        if (typeof args === "object") {
          result = await baseQuery(
            {
              ...args,
              headers: {
                ...args.headers,
                Authorization: `Bearer ${accessToken}`,
              },
            },
            api,
            extraOptions,
          );
        }
      } else {
        await AsyncStorage.clear();
        await GoogleSignin.signOut();
        router.replace(PATH_NAME.AUTH.LOGIN as any);
      }
    }
  }

  return result;
};

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery,
  endpoints: () => ({}),
  keepUnusedDataFor: 300,
  tagTypes: [
    "subCate",
    "Group",
    "UserSpendingModel",
    "transaction",
    "spendingModel",
    "Notification",
    "User",
    "FinancialGoal",
    "bank-accounts",
    "Quiz",
    "RecurringTransaction",
  ],
});

export default apiSlice;
