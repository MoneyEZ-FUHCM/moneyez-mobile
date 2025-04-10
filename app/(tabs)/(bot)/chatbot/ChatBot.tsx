import {
  CustomModal,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import { CHATBOT_CONNECTION } from "@/enums/globals";
import { AntDesign, Entypo, Octicons } from "@expo/vector-icons";
import { ArrowCircleUp2 } from "iconsax-react-native";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import TEXT_TRANSLATE_BOT from "../BotScreen.translate";
import useChatBotScreen from "../hooks/useChatbotScreen";
import ChatMessages from "./ChatMessage";

const ChatBot: React.FC = () => {
  const { state, handler, signalR } = useChatBotScreen();

  return (
    <SafeAreaViewCustom>
      <SectionComponent rootClassName="flex-row justify-between items-center h-14 px-4 ">
        <TouchableOpacity onPress={handler.handleBack}>
          <AntDesign
            name="close"
            size={24}
            color="#609084"
            style={{
              textShadowColor: "#609084",
              textShadowRadius: 2,
              textShadowOffset: { width: 1, height: 1 },
            }}
          />
        </TouchableOpacity>
        <View className="flex-row items-center gap-1">
          <Text className="text-lg font-bold text-primary">
            {TEXT_TRANSLATE_BOT.TITLE.AI_NAME}
          </Text>
          <Octicons
            name="dot-fill"
            size={20}
            color={handler.getStatusColorConnection(signalR.connectionStatus)}
          />
        </View>
        <TouchableOpacity onPress={() => handler.setIsModalVisible(true)}>
          <Entypo name="info-with-circle" size={24} color="#609084" />
        </TouchableOpacity>
      </SectionComponent>
      <KeyboardAvoidingView
        className="flex-1 justify-end bg-gray-100"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        <ChatMessages messages={state.messages} />
        <SectionComponent rootClassName="mt-3">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {state.SUGGESTION.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="m-1 rounded-2xl bg-[#E6F2EF] px-3 py-2"
                onPress={() => handler.handleSendMessages(item)}
              >
                <Text className="text-[#609084]">{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View className="flex-row items-center px-4 pb-4 pt-2">
            <TextInput
              className="mr-2 max-h-[112px] flex-1 break-words rounded-2xl border border-[#609084] p-2 text-base"
              placeholder="Nhập câu hỏi"
              value={state.input}
              onChangeText={(text) => {
                handler.setInput(text);
              }}
              multiline
              textBreakStrategy="highQuality"
              scrollEnabled
            />
            <ArrowCircleUp2
              size={32}
              color={
                state.isSending ||
                signalR.connectionStatus !== CHATBOT_CONNECTION.CONNECTED ||
                !state.input.trim()
                  ? "#A0A0A0"
                  : "#609084"
              }
              onPress={
                !state.isSending
                  ? () => handler.handleSendMessages()
                  : undefined
              }
              variant="Bold"
            />
          </View>
        </SectionComponent>
      </KeyboardAvoidingView>
      <CustomModal
        visible={state.isModalVisible}
        title={TEXT_TRANSLATE_BOT.TITLE.TITLE_AI}
        content={TEXT_TRANSLATE_BOT.TITLE.DESCRIPTION_AI}
        onClose={() => handler.setIsModalVisible(false)}
      />
    </SafeAreaViewCustom>
  );
};

export default ChatBot;
