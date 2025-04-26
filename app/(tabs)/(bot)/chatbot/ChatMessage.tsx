import { SectionComponent, TypingIndicatorComponent } from "@/components";
import { Message } from "@/helpers/types/bot.types";
import { ArrowDown2 } from "iconsax-react-native";
import React, { useMemo } from "react";
import { Animated, FlatList, TouchableOpacity, View } from "react-native";
import useChatBotScreen from "../hooks/useChatbotScreen";
import ChatMessageItem from "./ChatMessageItem";
import { useSelector } from "react-redux";
import { selectIsBotThinking } from "@/redux/hooks/systemSelector";

const ChatMessages = ({ messages }: { messages: Message[] }) => {
  const { state, handler } = useChatBotScreen();
  const reversedMessages = useMemo(() => [...messages]?.reverse(), [messages]);
  const isThikning = useSelector(selectIsBotThinking);

  return (
    <SectionComponent rootClassName="flex-1">
      {/* <LoadingSectionWrapper isLoading={state.isLoadingHistoryChat}> */}
      <FlatList
        inverted
        showsVerticalScrollIndicator={false}
        ref={state.flatListRef}
        removeClippedSubviews={false}
        data={reversedMessages}
        keyExtractor={(item) => item?.id}
        scrollEventThrottle={10}
        onScroll={handler.handleScroll}
        renderItem={({ item }) => (
          <ChatMessageItem
            item={item}
            selectedMessageIds={state.selectedMessageIds}
            toggleTimestamp={handler.toggleTimestamp}
          />
        )}
      />

      {isThikning && (
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
      {/* </LoadingSectionWrapper> */}
    </SectionComponent>
  );
};

export default ChatMessages;
