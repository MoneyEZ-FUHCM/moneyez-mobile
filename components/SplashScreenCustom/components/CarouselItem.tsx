import React from "react";
import { Image, View } from "react-native";

interface CarouselItemProps {
  item: {
    id: number;
    uri: any;
    title: string;
    description: string;
  };
}

const CarouselItem: React.FC<CarouselItemProps> = React.memo(({ item }) => (
  <View className="mt-20 flex-1 items-center justify-center">
    <Image source={item.uri} className="w-[95%] flex-1" resizeMode="contain" />
  </View>
));

export { CarouselItem };
