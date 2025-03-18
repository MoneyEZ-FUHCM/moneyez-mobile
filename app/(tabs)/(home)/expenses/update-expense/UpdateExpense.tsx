import React, { useState } from "react";
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
import TEXT_TRANSLATE_EXPENSE_DETAIL from "../expense-detail/ExpenseDetail.translate";

const EditBudgetScreen = () => {
  const [budget, setBudget] = useState("400.000đ");

  return (
    <SafeAreaViewCustom rootClassName="relative">
      {/* HEADER */}
      <SectionComponent rootClassName="h-14 bg-white justify-center mb-2">
        <View className="flex-row items-center justify-between px-5">
          <Pressable onPress={router.back}>
            <MaterialIcons name="arrow-back" size={24} color="#609084" />
          </Pressable>
          <Text className="text-lg font-bold text-black">
            {TEXT_TRANSLATE_EXPENSE_DETAIL.headerTitle}
          </Text>
          <Text></Text>
        </View>
      </SectionComponent>
      <View className="rounded-xl bg-white p-5">
        {/* Thiết lập hạn mức */}
        <View className="mb-4">
          <Text className="text-lg font-semibold">Thiết lập hạn mức</Text>
          <Text className="text-sm text-gray-500">
            Dựa theo mô hình sử dụng bạn đang chọn MoneyEz sẽ đưa ra mức ngân
            sách tối đa khác nhau
          </Text>
        </View>

        {/* Danh mục ngân sách */}
        <View className="rounded-lg bg-gray-100 p-4">
          <View className="mb-2 flex-row items-center">
            <View className="rounded-lg bg-superlight p-2">
              <Ionicons name="car-outline" size={24} color="#4F8C8C" />
            </View>
            <Text className="ml-2 text-base font-semibold">Danh mục</Text>
          </View>
          <Text className="mb-1 text-lg font-bold">Đi lại</Text>
          <Text className="text-base">
            Số tiền tối đa có thể đặt mục tiêu cho danh mục này là{" "}
            <Text className="font-bold text-primary">500.000</Text>
          </Text>

          {/* Ô nhập số tiền */}
          <TextInput
            className="border-green-600 mt-3 rounded-lg border p-3 text-xl font-bold text-gray-700"
            value={budget}
            onChangeText={setBudget}
            keyboardType="numeric"
          />
        </View>
      </View>
      <SectionComponent rootClassName="flex-row flex-1 absolute bottom-5 mx-4">
        <SpaceComponent width={15} />
        <TouchableOpacity className="mr-2 mt-10 w-1/2 flex-1 items-center rounded-lg border border-primary bg-white p-3">
          <Text className="text-base font-semibold text-primary">Huỷ</Text>
        </TouchableOpacity>
        <TouchableOpacity className="mt-10 w-1/2 flex-1 items-center rounded-lg bg-primary p-3">
          <Text className="text-base font-semibold text-white">Chỉnh sửa</Text>
        </TouchableOpacity>
      </SectionComponent>
    </SafeAreaViewCustom>
  );
};

export default EditBudgetScreen;
