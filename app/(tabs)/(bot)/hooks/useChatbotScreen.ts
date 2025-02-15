import { router, useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Animated, FlatList } from "react-native";
import { useDispatch } from "react-redux";
import BOT_SCREEN_CONSTANTS from "../BotScreen.const";
import { setHiddenTabbar } from "@/redux/slices/tabSlice";
import {
  receiveMessage,
  sendMessage,
  startConnection,
  stopConnection,
} from "@/helpers/libs";

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
  const [messagess, setMessagess] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  useFocusEffect(
    useCallback(() => {
      dispatch(setHiddenTabbar(true));
      return () => {
        dispatch(setHiddenTabbar(false));
      };
    }, [dispatch]),
  );

  console.log("check messages", messages);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      dispatch(setHiddenTabbar(false));
    });
    return unsubscribe;
  }, [navigation, dispatch]);

  const ws = useRef<WebSocket | null>(null);

  // useEffect(() => {
  //   let reconnectTimeout: NodeJS.Timeout;

  //   const connectWebSocket = () => {
  //     ws.current = new WebSocket("wss://easymoney.anttravel.online/chatHub");

  //     ws.current.onopen = () => {
  //       console.log(" Connected to WebSocket");
  //     };

  //     ws.current.onmessage = (event) => {
  //       console.log("Received:", event.data);
  //       setMessages((prev) => [...prev, event.data]);
  //     };

  //     ws.current.onerror = (error) => {
  //       console.error("WebSocket Error:", error);
  //       Alert.alert("Lỗi Kết Nối", "Không thể kết nối đến máy chủ chat.");
  //     };

  //     ws.current.onclose = () => {
  //       console.log("WebSocket Disconnected, attempting to reconnect...");
  //       reconnectTimeout = setTimeout(connectWebSocket, 5000);
  //     };
  //   };

  //   connectWebSocket();

  //   return () => {
  //     clearTimeout(reconnectTimeout);
  //     ws.current?.close();
  //   };
  // }, []);

  useEffect(() => {
    startConnection(); // Kết nối SignalR khi component mount

    receiveMessage("ReceiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      stopConnection(); // Ngắt kết nối khi component unmount
    };
  }, []);

  // const sendMessages = async () => {
  //   const payload = ["giaduc0123@gmail.com", `${inputMessage}`];
  //   console.log("chjeck payload", payload);
  //   await sendMessage("SendMessage", payload);
  //   setInputMessage("");
  // };

  const handleSendMessages = async () => {
    if (inputMessage.trim() === "") return;
    await sendMessage("SendMessage", "giaduc0123@gmail.com", `${inputMessage}`);
    setInputMessage("");
  };

  // const sendMessage = (text?: string) => {
  //   const message = text || input;
  //   if (!message.trim()) return;
  //   console.log("check ", message);
  //   const sendPayload = {
  //     arguments: ["giaducdang@gmail.com", `${message}`],
  //     target: "SendMessage",
  //     type: 1,
  //   };
  //   console.log("check sendPayload", sendPayload);

  //   if (ws.current?.readyState === WebSocket.OPEN) {

  //     ws.current.send(sendPayload as any);
  //     setMessages((prev) => [...prev, sendPayload] as any);
  //     setInput("");
  //   } else {
  //     console.log("err send");
  //     Alert.alert("Lỗi", "Kết nối WebSocket chưa sẵn sàng.");
  //   }
  // };

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
      sendMessages: handleSendMessages,
      setInputMessage,
    },
  };
};

export default useChatBotScreen;
