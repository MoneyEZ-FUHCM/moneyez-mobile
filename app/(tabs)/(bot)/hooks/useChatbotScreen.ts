import { router, useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, FlatList } from "react-native";
import { useDispatch } from "react-redux";
import BOT_SCREEN_CONSTANTS from "../BotScreen.const";
import { setHiddenTabbar } from "@/redux/slices/tabSlice";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  createdAt: string;
}

const useChatBotScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMessageIds, setSelectedMessageIds] = useState<Set<string>>(
    new Set(),
  );
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
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
      return () => {
        dispatch(setHiddenTabbar(false));
      };
    }, [dispatch]),
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      dispatch(setHiddenTabbar(false));
    });
    return unsubscribe;
  }, [navigation, dispatch]);

  const sendMessage = (message?: string) => {
    const text = message || input.trim();
    if (!text) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: Date.now().toString(),
        text,
        sender: "user",
        createdAt: new Date().toISOString(),
      },
    ]);

    setInput("");

    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now().toString(),
          text: "Mày đừng code nữa Bảo ơi",
          sender: "bot",
          createdAt: new Date().toISOString(),
        },
      ]);
    }, 1000);
  };

  const handleBack = () => {
    router.back();
    dispatch(setHiddenTabbar(false));
  };

  const toggleTimestamp = (id: string) => {
    setSelectedMessageIds((prevIds) => {
      const newIds = new Set(prevIds);
      newIds.has(id) ? newIds.delete(id) : newIds.add(id);
      return newIds;
    });
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const viewHeight = event.nativeEvent.layoutMeasurement.height;
    const threshold = contentHeight / 3;

    if (offsetY + viewHeight < contentHeight - threshold) {
      setShowScrollToBottom(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowScrollToBottom(false));
    }

    lastOffsetY.current = offsetY;
  };

  const activeScrollToBottomAnimation = () => {
    if (showScrollToBottom) {
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
  };

  const scrollToBottomEffect = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 200);
  };

  useEffect(() => {
    activeScrollToBottomAnimation();
  }, [showScrollToBottom]);

  return {
    state: {
      messages,
      input,
      isModalVisible,
      selectedMessageIds,
      showScrollToBottom,
      fadeAnim,
      moveAnim,
      flatListRef,
      SUGGESTION,
    },
    handler: {
      setInput,
      sendMessage,
      setIsModalVisible,
      handleBack,
      toggleTimestamp,
      scrollToBottom,
      handleScroll,
      activeScrollToBottomAnimation,
      scrollToBottomEffect,
    },
  };
};

export default useChatBotScreen;
