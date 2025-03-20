import { SafeAreaViewCustom, SectionComponent } from "@/components";
import { PATH_NAME } from "@/helpers/constants/pathname";
import { formatCurrency } from "@/helpers/libs";
import { setMainTabHidden } from "@/redux/slices/tabSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useDispatch } from "react-redux";

// Dummy data for budget categories
const budgetCategories = [
  { id: "1", name: "Ăn uống", amount: 3000000, icon: "restaurant" as keyof typeof MaterialIcons.glyphMap },
  { id: "2", name: "Giải trí", amount: 2000000, icon: "local-movies" as keyof typeof MaterialIcons.glyphMap },
  { id: "3", name: "Giáo dục", amount: 5000000, icon: "school" as keyof typeof MaterialIcons.glyphMap },
];

const { HOME } = PATH_NAME

const SpendingBudgetComponent = () => {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  
  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-white p-4">
      {/* Header */}
      <SectionComponent rootClassName="mb-4">
        <Pressable
          className="flex-row items-center justify-between p-2"
          onPress={() => {
            dispatch(setMainTabHidden(true));
            router.push(HOME.SPENDING_BUDGET_LIST as any)
          }}
        >
          <View className="flex-row items-center space-x-2">
            <Text className="text-lg font-semibold text-black">
              Ngân sách chi tiêu
            </Text>
            <Pressable onPress={toggleVisibility}>
              <MaterialIcons 
                name={isVisible ? "visibility" : "visibility-off"} 
                size={20} 
                color="#000" 
              />
            </Pressable>
          </View>
          <MaterialIcons name="arrow-forward-ios" size={20} color="#000" />
        </Pressable>
      </SectionComponent>

      {/* Budget category list */}
      {budgetCategories.map((item) => (
        <SectionComponent key={item.id} rootClassName="mb-3">
          <Pressable
            className="flex-row items-center justify-between p-2 border border-[#bad8b6] rounded-lg"
            onPress={() => { }}
          >
            <View className="flex-row items-center space-x-3">
              <MaterialIcons name={item.icon} size={30} color="#609084" />
              <View>
                <Text className="text-base font-medium text-black">
                  {item.name}
                </Text>
                <Text className="text-sm text-black">
                  {isVisible ? formatCurrency(item.amount) : "••••••"}
                </Text>
              </View>
            </View>
            {/* A simple progress bar indicator */}
            <View className="w-1/3 h-2 bg-[#ebefd6] rounded-full relative">
              <View
                className="absolute left-0 top-0 h-full bg-[#609084] rounded-full"
                style={{ width: "60%" }} // Adjust width as needed
              />
            </View>
          </Pressable>
        </SectionComponent>
      ))}
    </SafeAreaViewCustom>
  );
};

export default SpendingBudgetComponent;
