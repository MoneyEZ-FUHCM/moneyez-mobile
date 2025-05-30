import { COMMON_CONSTANT } from "@/helpers/constants/common";
import apiSlice from "@/redux/slices/apiSlice";
import { transformCommonResponse } from "@/helpers/types/system.types";

const { HTTP_METHOD } = COMMON_CONSTANT;
const subCategoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubCate: builder.query({
      query: ({ PageIndex, PageSize }) => ({
        url: `/subcategories?PageIndex=${PageIndex}&PageSize=${PageSize}`,
        method: HTTP_METHOD.GET,
      }),
      transformResponse: (response) => transformCommonResponse(response),
    }),
    getSubCateById: builder.query({
      query: ({ subcateId }) => ({
        url: `/subcategories/${subcateId}`,
        method: HTTP_METHOD.GET,
      }),
    }),
  }),
});

export const { useGetSubCateQuery, useLazyGetSubCateByIdQuery } =
  subCategoryApi;

export default subCategoryApi;
