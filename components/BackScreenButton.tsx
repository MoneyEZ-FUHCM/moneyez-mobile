import React from "react";
import { ArrowLeft2 } from "iconsax-react-native";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface IBackScreenButton {
  onPress: any;
}

const BackScreenButton = (props: IBackScreenButton) => {
  return (
    <SafeAreaView className="relative bg-white">
      <TouchableOpacity onPress={props.onPress} className="absolute bg-white">
        <View className="h-11 w-11 items-center justify-center rounded-full bg-[#ECECEC]">
          <ArrowLeft2 size="30" color="black" />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export { BackScreenButton };
