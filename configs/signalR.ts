import { CHATBOT_CONNECTION } from "@/enums/globals";
import { COMMON_CONSTANT } from "@/helpers/constants/common";
import { setConnectionStatus } from "@/redux/slices/systemSlice";
import { store } from "@/redux/store";
import * as signalR from "@microsoft/signalr";
import { ToastAndroid } from "react-native";

const SIGNALR_URL = process.env.EXPO_PUBLIC_SIGNALR_URL as string;

let connection: signalR.HubConnection | null = null;
const { CHATBOT_CONNECTION_TRANSLATE } = COMMON_CONSTANT;

export const startConnection = async (): Promise<void> => {
  try {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(SIGNALR_URL, {
        withCredentials: false,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.None)
      .build();

    connection.serverTimeoutInMilliseconds = 60000;
    connection.keepAliveIntervalInMilliseconds = 15000;

    connection.onclose(async (error) => {
      store.dispatch(setConnectionStatus(CHATBOT_CONNECTION.CONNECTING));
      ToastAndroid.show(
        CHATBOT_CONNECTION_TRANSLATE.RECONNECT,
        ToastAndroid.SHORT,
      );
      await reconnect();
    });

    // connection.onreconnecting(() => {
    //   store.dispatch(setConnectionStatus(CHATBOT_CONNECTION.CONNECTING));
    //   ToastAndroid.show(
    //     CHATBOT_CONNECTION_TRANSLATE.CONNECTING,
    //     ToastAndroid.SHORT,
    //   );
    // });

    // connection.onreconnected(() => {
    //   store.dispatch(setConnectionStatus(CHATBOT_CONNECTION.CONNECTED));
    //   ToastAndroid.show(
    //     CHATBOT_CONNECTION_TRANSLATE.CONNECTED,
    //     ToastAndroid.SHORT,
    //   );
    // });

    await connection.start();
    store.dispatch(setConnectionStatus(CHATBOT_CONNECTION.CONNECTED));
    ToastAndroid.show(
      CHATBOT_CONNECTION_TRANSLATE.CONNECTED,
      ToastAndroid.SHORT,
    );
  } catch (err) {
    store.dispatch(setConnectionStatus(CHATBOT_CONNECTION.DISCONNECTED));
    ToastAndroid.show(
      CHATBOT_CONNECTION_TRANSLATE.SYSTEM_ERROR,
      ToastAndroid.LONG,
    );
  }
};

const reconnect = async () => {
  await startConnection();
};

export const sendMessage = async (
  methodName: string,
  user: string,
  message: string,
): Promise<void> => {
  if (connection) {
    try {
      await connection.invoke(methodName, user, message);
    } catch (err) {}
  }
};

export const receiveMessage = (
  methodName: string,
  callback: (...args: any[]) => void,
): void => {
  if (connection) {
    connection.on(methodName, callback);
  }
};

export const stopConnection = async (): Promise<void> => {
  if (connection) {
    await connection.stop();
  }
};
