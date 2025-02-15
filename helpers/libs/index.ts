import * as signalR from "@microsoft/signalr";
import moment from "moment";

export const formatFromNow = (date: moment.MomentInput) => {
  if (!date) return "N/A";
  return moment(date).fromNow();
};

// const SIGNALR_URL: string = " https://easymoney.anttravel.online/chatHub";

// let connection: signalR.HubConnection | null = null;

// export const startConnection = async (): Promise<void> => {
//   try {
//     connection = new signalR.HubConnectionBuilder()
//       .withUrl(SIGNALR_URL)
//       .configureLogging(signalR.LogLevel.Information)
//       .withAutomaticReconnect([0, 2000, 10000, 30000])
//       .build();

//     console.log("check connection 123", JSON.stringify(connection));
//     connection.onclose(async (error) => {
//       console.warn("⚠️ SignalR bị đóng kết nối. Lý do:", error);
//       await reconnect();
//     });

//     await connection.start();
//     console.log("SignalR Connected!");
//   } catch (err) {
//     console.error("SignalR Connection Error:", err);
//   }
// };

// const reconnect = async () => {
//   console.log("🔄 Đang thử kết nối lại SignalR...");
//   await startConnection();
// };

// export const sendMessage = async (
//   methodName: string,
//   message: any,
// ): Promise<void> => {
//   console.log("check connection", connection?.state);
//   console.log("check signalR", signalR);

//   if (connection && connection.state === signalR.HubConnectionState.Connected) {
//     try {
//       await connection.invoke(methodName, message);
//     } catch (err) {
//       console.error("Error sending message:", err);
//     }
//   } else {
//     console.warn(
//       "Connection is not established yet or not in 'Connected' state.",
//     );
//   }
// };

// export const receiveMessage = (
//   methodName: string,
//   callback: (...args: any[]) => void,
// ): void => {
//   if (connection) {
//     connection.on(methodName, callback);
//   }
// };

// export const stopConnection = async (): Promise<void> => {
//   if (connection) {
//     await connection.stop();
//     console.log("SignalR Disconnected");
//   }
// };

import { Alert } from "react-native";

const SIGNALR_URL = "https://easymoney.anttravel.online/chatHub";

let connection: signalR.HubConnection | null = null;

/**
 * Khởi động kết nối SignalR
 */
export const startConnection = async (): Promise<void> => {
  try {
    connection = new signalR.HubConnectionBuilder()
      .withUrl(SIGNALR_URL, {
        withCredentials: false,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    console.log("🔄 Đang khởi động SignalR...");

    connection.onclose(async (error) => {
      console.warn("⚠️ SignalR bị đóng kết nối:", error);
      await reconnect();
    });

    await connection.start();
    console.log("✅ SignalR Connected!");
  } catch (err) {
    console.error("🚨 Lỗi kết nối SignalR:", err);
  }
};

/**
 * Thử kết nối lại khi bị mất kết nối
 */
const reconnect = async () => {
  console.log("🔄 Đang thử kết nối lại SignalR...");
  await startConnection();
};

/**
 * Gửi tin nhắn đến server SignalR
 */
export const sendMessage = async (
  methodName: string,
  user: string,
  message: string,
): Promise<void> => {
  console.log("check conecction", connection);
  if (connection) {
    try {
      await connection.invoke(methodName, user, message);
    } catch (err) {
      console.error("🚨 Lỗi gửi tin nhắn:", err);
      Alert.alert("Lỗi", "Không thể gửi tin nhắn, vui lòng thử lại.");
    }
  } else {
    console.warn("⚠️ Chưa kết nối đến SignalR.");
  }
};

/**
 * Nhận tin nhắn từ server SignalR
 */
export const receiveMessage = (
  methodName: string,
  callback: (...args: any[]) => void,
): void => {
  if (connection) {
    connection.on(methodName, callback);
  } else {
    console.warn("⚠️ Chưa kết nối đến SignalR.");
  }
};

/**
 * Ngắt kết nối SignalR
 */
export const stopConnection = async (): Promise<void> => {
  if (connection) {
    await connection.stop();
    console.log("🛑 SignalR Disconnected");
  }
};
