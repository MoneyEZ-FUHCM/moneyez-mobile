import { PATH_NAME } from "@/helpers/constants/pathname";
import { useGetPostListQuery } from "@/services/post";
import { Post } from "@/types/post.types";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList } from "react-native";

const usePost = () => {
  const { data: postList } = useGetPostListQuery({
    PageIndex: 1,
    PageSize: 100,
  });
  const currentIndexRef = useRef(0);
  const flatListRef = useRef<FlatList<Post>>(null);
  const [postDetail, setPostDetail] = useState<Post | undefined>();

  useEffect(() => {
    const interval = setInterval(() => {
      currentIndexRef.current = postList?.items?.length
        ? (currentIndexRef.current + 1) % postList.items.length
        : 0;
      flatListRef.current?.scrollToIndex({
        index: currentIndexRef.current,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [postList?.items.length]);

  const handleViewDetailPost = useCallback((item: Post) => {
    if (item) {
      setPostDetail(item);
      router.navigate({
        pathname: PATH_NAME.HOME.POST_DETAIL as any,
        params: { postId: item.id },
      });
    }
  }, []);

  return {
    state: {
      postDetail,
      flatListRef,
      currentIndexRef,
      postList: postList?.items,
    },
    handler: {
      handleViewDetailPost,
    },
  };
};

export default usePost;
