import {
  BackScreenButton,
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { Colors } from "@/helpers/constants/color";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import TEXT_TRANSLATE_AUTH from "../AuthScreen.translate";
import useOtpScreen from "../hooks/useOtpScreen";

const InputOtp = () => {
  const NUMBER_OF_DIGITS_OTP = 5;
  const { handler } = useOtpScreen();
  const { TITLE } = TEXT_TRANSLATE_AUTH;

  return (
    <SafeAreaViewCustom rootClassName="justify-center px-10 items-center bg-white relative">
      <SectionComponent rootClassName="w-full mb-10">
        <BackScreenButton onPress={() => router.back()} />
      </SectionComponent>
      <SectionComponent rootClassName="w-full">
        <Text className="text-2xl font-semibold">{TITLE.CHECK_YOUR_EMAIL}</Text>
        <SpaceComponent height={12} />
        <Text className="text-[16px] font-normal text-text-gray">
          {TITLE.EMAIL_CONFIRMATION_SENT}
        </Text>
        <Text className="text-[16px] font-normal text-text-gray">
          {TITLE.ENTER_5_DIGITS_OTP}
        </Text>
      </SectionComponent>
      <SpaceComponent height={30} />
      <SectionComponent>
        <OtpInput
          numberOfDigits={NUMBER_OF_DIGITS_OTP}
          focusColor="green"
          focusStickBlinkingDuration={400}
          onTextChange={(text) => handler.setOtpCode(text)}
          theme={{
            containerStyle: {
              width: "100%",
              padding: 0,
            },
            pinCodeContainerStyle: {
              width: 60,
              borderColor: "#E1E1E1",
              borderWidth: 2,
            },
            pinCodeTextStyle: {
              color: Colors.colors.primary,
            },
            filledPinCodeContainerStyle: {
              borderColor: Colors.colors.primary,
              borderWidth: 2,
            },
          }}
        />
      </SectionComponent>
      <SpaceComponent height={30} />
      <TouchableOpacity
        className="w-full flex-row justify-center rounded-lg bg-primary p-3"
        onPress={() => handler.handleSubmitOtp()}
      >
        <Text className="text-lg font-bold text-superlight">
          {TITLE.CONFIRM}
        </Text>
      </TouchableOpacity>
      <SpaceComponent height={20} />
      <SectionComponent rootClassName="flex-row">
        <Text className="font-bold text-text-gray">
          {TITLE.DID_NOT_RECEIVE_OTP}
        </Text>
        <SpaceComponent width={5} />
        <TouchableOpacity onPress={handler.handleResendMail}>
          <Text className="text-primary">{TITLE.RESEND}</Text>
        </TouchableOpacity>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
};

export default InputOtp;
