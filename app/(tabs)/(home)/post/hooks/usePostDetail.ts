import useHideTabbar from "@/helpers/hooks/useHideTabbar";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { useGetPostDetailQuery } from "@/services/post";
import { Post } from "@/helpers/types/post.types";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const usePostDetail = () => {
  const { postId } = useLocalSearchParams();
  const [postDetail, setPostDetail] = useState<Post>();
  const dispatch = useDispatch();

  const { data: postDetailQuery, isLoading } = useGetPostDetailQuery(
    { id: postId },
    { skip: !postId },
  );

  useHideTabbar();

  useEffect(() => {
    if (postDetailQuery && postId) {
      setPostDetail(postDetailQuery?.data);
    }
  }, [postId, postDetailQuery]);

  const handleBack = useCallback(() => {
    router.back();
    dispatch(setMainTabHidden(false));
  }, []);

  return {
    state: {
      postDetail,
      isLoading,
    },
    handler: {
      handleBack,
    },
  };
};

export default usePostDetail;
