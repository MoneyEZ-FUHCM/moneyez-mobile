import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  SafeAreaViewCustom,
  SectionComponent,
  SpaceComponent,
} from "@/components";
import { router } from "expo-router";
import TEXT_TRANSLATE_UPDATE_EXPENSE from "./UpdateExpense.translate";
import UPDATE_EXPENSE_CONSTANTS from "./UpdateExpense.const";
import useUpdateExpense from "./hooks/useUpdateExpense";

const EditBudgetScreen = () => {
  const { state, handler } = useUpdateExpense();
  const { budget } = state;
  const { setBudget, handleEdit } = handler;

  return (
    <SafeAreaViewCustom rootClassName="relative">
      {/* HEADER */}
      <SectionComponent rootClassName="h-14 bg-white justify-center mb-2">
        <View className="flex-row items-center justify-between px-5">
          <Pressable onPress={router.back}>
            <MaterialIcons name="arrow-back" size={24} color="#609084" />
          </Pressable>
          <Text className="text-lg font-bold text-black">
            {TEXT_TRANSLATE_UPDATE_EXPENSE.HEADER_TITLE}
          </Text>
          <Text></Text>
        </View>
      </SectionComponent>

      <View className="mb-2 rounded-xl bg-white px-5 pt-2">
        {/* Thiết lập hạn mức */}
        <View className="mb-4">
          <Text className="text-lg font-semibold">
            {TEXT_TRANSLATE_UPDATE_EXPENSE.SETUP_LIMIT}
          </Text>
          <Text className="text-sm text-gray-500">
            {TEXT_TRANSLATE_UPDATE_EXPENSE.SETUP_LIMIT_DESCRIPTION}
          </Text>
        </View>
      </View>
      {/* Danh mục ngân sách */}
      <View className="mx-2 rounded-lg bg-white p-4">
        <View className="mb-2 flex-row items-center">
          <View className="rounded-lg bg-superlight p-2">
            <Ionicons name="car-outline" size={24} color="#4F8C8C" />
          </View>
          <View>
            <Text className="ml-2 text-xs font-normal text-gray-600">
              {TEXT_TRANSLATE_UPDATE_EXPENSE.CATEGORY}
            </Text>
            <Text className="ml-2 text-base font-bold">
              {TEXT_TRANSLATE_UPDATE_EXPENSE.CATEGORY_NAME}
            </Text>
          </View>
        </View>

        <Text className="text-base">
          {TEXT_TRANSLATE_UPDATE_EXPENSE.MAX_BUDGET}{" "}
          <Text className="font-bold text-primary">
            {UPDATE_EXPENSE_CONSTANTS.MAX_BUDGET}
          </Text>
        </Text>

        {/* Ô nhập số tiền */}
        <TextInput
          className="mt-3 rounded-lg border border-primary p-3 text-xl font-bold text-gray-500"
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
        />
      </View>

      <SectionComponent rootClassName="flex-row flex-1 absolute bottom-5 mx-4">
        <SpaceComponent width={15} />

        <TouchableOpacity
          className="mt-10 w-1/2 flex-1 items-center rounded-lg bg-primary p-3"
          onPress={handleEdit}
        >
          <Text className="text-base font-semibold text-white">
            {TEXT_TRANSLATE_UPDATE_EXPENSE.EDIT}
          </Text>
        </TouchableOpacity>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
};

export default EditBudgetScreen;
