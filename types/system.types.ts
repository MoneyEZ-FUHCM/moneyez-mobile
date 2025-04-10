export interface BaseResponse<T> {
  status: number;
  errorCode: string;
  message: string;
  data: T;
}

export interface MetaData {
  totalCount: number;
  totalPages: number;
}

export interface CommonResponse<T> {
  items: T[];
  totalCount: number;
  totalPages: number;
}

export interface TransactionsResponse<T> {
  items: T,
  totalCount: number;
  totalPages: number;
}

export const transformCommonResponse = <T>(
  response: any,
): CommonResponse<T> => ({
  items: response.data?.data || [],
  totalCount: response.data?.metaData?.totalCount || 0,
  totalPages: response.data?.metaData?.totalPages || 0,
});

export const transformTransactionsResponse = <T>(
  response: any,
): TransactionsResponse<T> => ({
  items: response.data || {},
  totalCount: response.data?.metaData?.totalCount || 0,
  totalPages: response.data?.metaData?.totalPages || 0,
});
