import * as signalR from "@microsoft/signalr";
import moment from "moment";

export const formatFromNow = (date: moment.MomentInput) => {
  if (!date) return "N/A";
  return moment(date).fromNow();
};

const SIGNALR_URL = "https://easymoney.anttravel.online/chatHub";

let connection: signalR.HubConnection | null = null;

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

    connection.onclose(async (error) => {
      await reconnect();
    });

    await connection.start();
  } catch (err) {}
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
