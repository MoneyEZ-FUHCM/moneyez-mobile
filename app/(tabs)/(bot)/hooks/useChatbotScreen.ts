import {
  receiveMessage,
  sendMessage,
  startConnection,
  stopConnection,
} from "@/helpers/libs";
import { setHiddenTabbar } from "@/redux/slices/tabSlice";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Animated, FlatList } from "react-native";
import { useDispatch } from "react-redux";
import BOT_SCREEN_CONSTANTS from "../BotScreen.const";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  createdAt: string;
}

const useChatBotScreen = () => {
  const [state, setState] = useState({
    messages: [] as Message[],
    input: "",
    isModalVisible: false,
    selectedMessageIds: new Set<string>(),
    showScrollToBottom: false,
    isBotTyping: false,
    isSending: false,
  });

  const { SUGGESTION } = BOT_SCREEN_CONSTANTS;
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(0)).current;
  const lastOffsetY = useRef(0);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      dispatch(setHiddenTabbar(true));
      return () => dispatch(setHiddenTabbar(false));
    }, [dispatch]),
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () =>
      dispatch(setHiddenTabbar(false)),
    );
    return unsubscribe;
  }, [navigation, dispatch]);

  useEffect(() => {
    startConnection();

    receiveMessage("ReceiveMessage", (botName, newMessage) => {
      setState((prev) => ({
        ...prev,
        isBotTyping: false,
        messages: [
          ...prev.messages,
          {
            id: newMessage.id || Date.now().toString(),
            text: newMessage,
            sender: "bot",
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
    const inputText = message || state.input.trim();
    if (!inputText) return;
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, newUserMessage],
      input: message ? state.input : "",
      isBotTyping: true,
      isSending: true,
    }));

    try {
      await sendMessage(
        "SendMessage",
        "E001207B-F5FD-4F1E-10ED-08DD3B02ACB7",
        inputText,
      );
    } catch {
      setState((prev) => ({ ...prev, isBotTyping: false }));
    } finally {
      setTimeout(() => {
        setState((prev) => ({ ...prev, isSending: false }));
      }, 1000);
    }
  };

  const handleBack = () => {
    router.back();
    dispatch(setHiddenTabbar(false));
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

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const threshold = contentHeight / 3;

    if (offsetY > threshold) {
      setState((prev) => ({ ...prev, showScrollToBottom: true }));
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setState((prev) => ({ ...prev, showScrollToBottom: false }));
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    lastOffsetY.current = offsetY;
  };

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

  return {
    state: useMemo(
      () => ({ ...state, fadeAnim, moveAnim, flatListRef, SUGGESTION }),
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
    },
  };
};

export default useChatBotScreen;
