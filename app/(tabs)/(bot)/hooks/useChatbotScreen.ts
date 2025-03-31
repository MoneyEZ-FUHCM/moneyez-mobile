import {
  receiveMessage,
  sendMessage,
  startConnection,
  stopConnection,
} from "@/configs/signalR";
import { CHAT_ROLE, CHATBOT_CONNECTION } from "@/enums/globals";
import useHideTabbar from "@/hooks/useHideTabbar";
import { setIsThinking } from "@/redux/slices/systemSlice";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { selectUserInfo } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import { useGetBotHistoryQuery } from "@/services/bot";
import { Message } from "@/types/bot.types";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BOT_SCREEN_CONSTANTS from "../BotScreen.const";

const useChatBotScreen = () => {
  const [state, setState] = useState({
    messages: [] as Message[],
    input: "",
    isModalVisible: false,
    selectedMessageIds: new Set<string>(),
    showScrollToBottom: false,
    isSending: false,
  });

  const { SUGGESTION } = BOT_SCREEN_CONSTANTS;
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(0)).current;
  const connectionStatus = useSelector(
    (state: RootState) => state.system.status,
  );
  const userInfo = useSelector(selectUserInfo);
  const [isLoadingHistoryChat, setIsLoadingHistoryChat] = useState(false);

  const lastOffsetY = useRef(0);
  const dispatch = useDispatch();
  const { data: botHistory } = useGetBotHistoryQuery({
    PageIndex: 1,
    PageSize: 100,
  });

  useHideTabbar();

  useEffect(() => {
    setIsLoadingHistoryChat(true);
    if (botHistory?.items) {
      setState((prev: any) => ({
        ...prev,
        messages: [...botHistory.items].reverse(),
      }));
    }
    setIsLoadingHistoryChat(false);
  }, [botHistory]);

  useEffect(() => {
    startConnection();

    receiveMessage("ReceiveMessage", (botName: string, newMessage: any) => {
      const messageId = newMessage.id || Date.now().toString();
      setState((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            id: messageId,
            message: newMessage,
            type: CHAT_ROLE.BOT,
            createdAt: newMessage.createdAt || new Date().toISOString(),
          },
        ],
      }));
    });

    return () => {
      stopConnection();
    };
  }, []);

  const handleSendMessages = async (message?: string) => {
    if (state.isSending) return;
    if (connectionStatus !== CHATBOT_CONNECTION.CONNECTED) return;

    const inputText = message || state.input.trim();

    if (!inputText) return;
    const newUserMessage: Message = {
      id: Date.now().toString(),
      message: inputText,
      type: CHAT_ROLE.USER,
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, newUserMessage],
      input: message ? state.input : "",
      isSending: true,
    }));
    dispatch(setIsThinking(true));

    try {
      await sendMessage("SendMessage", userInfo?.id as string, inputText);
    } catch (err) {
      setState((prev) => ({ ...prev, isBotTyping: false }));
    } finally {
      dispatch(setIsThinking(false));
      setTimeout(() => {
        setState((prev) => ({ ...prev, isSending: false }));
      }, 1000);
    }
  };

  const handleBack = () => {
    router.back();
    dispatch(setMainTabHidden(false));
  };

  const toggleTimestamp = (id: string) => {
    setState((prev) => {
      const selectedMessageIds = new Set(prev.selectedMessageIds);
      selectedMessageIds.has(id)
        ? selectedMessageIds.delete(id)
        : selectedMessageIds.add(id);
      return { ...prev, selectedMessageIds };
    });
  };

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }
  };

  const handleScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const threshold = contentHeight / 3;

    if (offsetY > threshold) {
      setState((prev) => {
        if (!prev.showScrollToBottom) {
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
        return { ...prev, showScrollToBottom: true };
      });
    } else {
      setState((prev) => {
        if (prev.showScrollToBottom) {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
        return { ...prev, showScrollToBottom: false };
      });
    }

    lastOffsetY.current = offsetY;
  }, []);

  useEffect(() => {
    if (state.showScrollToBottom) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(moveAnim, {
            toValue: -10,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(moveAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      );
      animation.start();
      return () => animation.stop();
    } else {
      moveAnim.setValue(0);
    }
  }, [state.showScrollToBottom]);

  const getStatusColorConnection = useCallback(
    (status: string) => {
      if (status === CHATBOT_CONNECTION.CONNECTING) return "yellow";
      if (status === CHATBOT_CONNECTION.DISCONNECTED) return "red";
      return "green";
    },
    [connectionStatus],
  );

  return {
    state: useMemo(
      () => ({
        ...state,
        fadeAnim,
        moveAnim,
        flatListRef,
        SUGGESTION,
        isLoadingHistoryChat,
      }),
      [state],
    ),
    handler: {
      setInput: (input: string) => setState((prev) => ({ ...prev, input })),
      sendMessage,
      setIsModalVisible: (isModalVisible: boolean) =>
        setState((prev) => ({ ...prev, isModalVisible })),
      handleBack,
      toggleTimestamp,
      scrollToBottom,
      handleScroll,
      handleSendMessages,
      getStatusColorConnection,
    },
    signalR: {
      connectionStatus,
    },
  };
};

export default useChatBotScreen;
