import { SectionComponent, TypingIndicatorComponent } from "@/components";
import { formatFromNow } from "@/helpers/libs";
import { ArrowDown2 } from "iconsax-react-native";
import React from "react";
import {
  Animated,
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useChatBotScreen, { Message } from "../hooks/useChatbotScreen";

const ChatMessages = ({ messages }: { messages: Message[] }) => {
  const { state, handler } = useChatBotScreen();

  return (
    <SectionComponent rootClassName="flex-1">
      <FlatList
        inverted
        ref={state.flatListRef}
        removeClippedSubviews={false}
        data={[...messages].reverse()}
        keyExtractor={(item) => item.id}
        scrollEventThrottle={10}
        onScroll={handler.handleScroll}
        renderItem={({ item }) => (
          <View
            className={`px-4 py-2 ${item.sender === "user" ? "items-end" : "items-start"}`}
          >
            <Pressable
              onPress={() => handler.toggleTimestamp(item.id)}
              className={`max-w-[70%] px-3 py-2 shadow-sm ${
                item.sender === "user"
                  ? "rounded-b-2xl rounded-tl-2xl bg-[#609084]"
                  : "rounded-b-2xl rounded-tr-2xl bg-gray-200"
              }`}
            >
              <Text
                className={`text-base ${item.sender === "user" ? "text-white" : "text-black"}`}
              >
                {item.text}
              </Text>
            </Pressable>
            {state.selectedMessageIds.has(item.id) && item.createdAt && (
              <Text className="text-xs text-gray-500">
                {formatFromNow(item.createdAt)}
              </Text>
            )}
          </View>
        )}
      />

      {state.isBotTyping && (
        <View className="items-start px-4 py-2">
          <View className="max-w-[70%] rounded-b-2xl rounded-tr-2xl bg-gray-200 px-3 py-2">
            <TypingIndicatorComponent />
          </View>
        </View>
      )}

      {state.showScrollToBottom && (
        <Animated.View
          style={{
            opacity: state.fadeAnim,
            position: "absolute",
            bottom: 10,
            left: "50%",
            transform: [{ translateX: -20 }, { translateY: state.moveAnim }],
          }}
        >
          <TouchableOpacity
            onPress={handler.scrollToBottom}
            className="rounded-full bg-white p-2 shadow-lg"
          >
            <ArrowDown2 size="25" color="black" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </SectionComponent>
  );
};

export default ChatMessages;
