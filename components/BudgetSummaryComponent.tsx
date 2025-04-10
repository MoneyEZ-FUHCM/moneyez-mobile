import Admin from "@/assets/images/logo/avatar_admin.jpg";
import { Image, Pressable, Text, View } from "react-native";
import { SectionComponent } from "./SectionComponent";
import { SpaceComponent } from "./SpaceComponent";

interface BudgetSummaryProps {
  summaryText: React.ReactNode;
  button1Text: string;
  button2Text: string;
  onPressButton1: () => void;
  onPressButton2: () => void;
  isButton?: boolean;
}

const BudgetSummaryComponent = ({
  summaryText,
  button1Text,
  button2Text,
  onPressButton1,
  onPressButton2,
  isButton = false,
}: BudgetSummaryProps) => {
  return (
    <SectionComponent rootClassName="mb-5 justify-center rounded-xl border border-primary bg-thirdly p-4">
      <View className="flex-row items-center gap-x-2">
        <Image
          source={Admin}
          className="h-9 w-9 rounded-full"
          resizeMode="cover"
        />
        <Text className="font-medium">MewMo</Text>
      </View>
      <SpaceComponent height={17} />
      <View className="max-w-[90%] rounded-b-xl rounded-tr-xl bg-white p-2">
        <Text>{summaryText}</Text>
      </View>
      <View className="h-[10px]" />
      {isButton && (
        <View className="flex-row">
          <Pressable
            className="w-1/2 flex-1 rounded-lg border border-primary bg-white p-2"
            onPress={onPressButton1}
          >
            <Text>{button1Text}</Text>
          </Pressable>
          <View className="w-[17px]" />
          <Pressable
            className="w-1/2 flex-1 rounded-lg border border-primary bg-white p-2"
            onPress={onPressButton2}
          >
            <Text>{button2Text}</Text>
          </Pressable>
        </View>
      )}
    </SectionComponent>
  );
};

export { BudgetSummaryComponent };
