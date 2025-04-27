import { CHAT_ROLE } from "@/helpers/enums/globals";
import { formatFromNow, parseMarkdown } from "@/helpers/libs";
import { Message } from "@/helpers/types/bot.types";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";

interface ChatMessageItemProps {
  item: Message;
  toggleTimestamp: (id: string) => void;
  selectedMessageIds: Set<string>;
}

const ChatMessageItem = memo(
  ({ item, toggleTimestamp, selectedMessageIds }: ChatMessageItemProps) => {
    return (
      <View
        className={`px-4 py-2 ${item?.type === CHAT_ROLE.USER ? "items-end" : "items-start"}`}
      >
        <Pressable
          onPress={() => toggleTimestamp(item?.id)}
          className={`max-w-[70%] px-3 py-2 shadow-sm ${
            item?.type === CHAT_ROLE.USER
              ? "rounded-b-2xl rounded-tl-2xl bg-[#609084]"
              : "rounded-b-2xl rounded-tr-2xl bg-gray-200"
          }`}
        >
          <Text
            className={`text-base ${item.type === CHAT_ROLE.USER ? "text-white" : "text-black"}`}
          >
            {parseMarkdown(item?.message)}
          </Text>
        </Pressable>
        {selectedMessageIds.has(item?.id) && item?.createdAt && (
          <Text className="text-xs text-gray-500">
            {formatFromNow(item?.createdAt)}
          </Text>
        )}
      </View>
    );
  },
);

export default ChatMessageItem;
