import { SectionComponent } from "@/components";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import usePost from "./hooks/usePost";
import TEXT_TRANSLATE_POST from "./post.translate";

const PostList = () => {
  const { state, handler } = usePost();

  return (
    <SectionComponent rootClassName="px-5 my-5">
      <Text className="mb-2 text-[19px] font-bold text-primary">
        {TEXT_TRANSLATE_POST.TITLE.POST}
      </Text>
      <FlatList
        ref={state.flatListRef}
        horizontal
        data={state.postList ?? []}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        ItemSeparatorComponent={() => <View style={{ width: 30 }} />}
        removeClippedSubviews={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="w-72 rounded-3xl border-[1px] border-[#CCCCCC] bg-white"
            style={{ overflow: "hidden" }}
            onPress={() => handler.handleViewDetailPost(item)}
          >
            <Image
              src={item?.thumbnail ?? ""}
              className="h-36 w-full"
              resizeMode="cover"
            />
            <View className="gap-y-1 p-3">
              <Text className="text-[18px] font-medium">{item?.title}</Text>
              <Text className="text-[#757575]">{item?.shortContent}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SectionComponent>
  );
};

export default PostList;
