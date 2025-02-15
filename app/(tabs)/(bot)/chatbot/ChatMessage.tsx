import LogoApp from "@/assets/images/logo/logo_app.png";
import { SectionComponent } from "@/components";
import { formatFromNow } from "@/helpers/libs";
import { ArrowDown2 } from "iconsax-react-native";
import React, { useEffect } from "react";
import {
  Animated,
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TEXT_TRANSLATE_BOT from "../BotScreen.translate";
import useChatBotScreen, { Message } from "../hooks/useChatbotScreen";

const ChatMessages = ({ messages }: { messages: Message[] }) => {
  const { state, handler } = useChatBotScreen();

  handler.activeScrollToBottomAnimation();
  useEffect(() => {
    handler.scrollToBottomEffect();
  }, [messages]);

  return (
    <SectionComponent rootClassName="flex-1">
      <FlatList
        showsVerticalScrollIndicator={false}
        ref={state.flatListRef}
        data={messages}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        removeClippedSubviews={false}
        ListHeaderComponent={() => (
          <View className="center h-72 flex-1 items-center justify-center gap-2 p-4">
            <Image
              source={LogoApp}
              alt="star"
              className="w-[50%]"
              resizeMode="contain"
            />
            <Text className="text-xl font-semibold">
              {TEXT_TRANSLATE_BOT.TITLE.NOTICE_AI_TITLE}
            </Text>
            <Text className="text-center text-sm font-normal text-gray-400">
              {TEXT_TRANSLATE_BOT.TITLE.NOTICE_AI_CONTENT}
            </Text>
          </View>
        )}
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
        className="flex-1"
        onScroll={handler.handleScroll}
        scrollEventThrottle={10}
      />
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
