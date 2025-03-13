import {
  FlatListCustom,
  SafeAreaViewCustom,
  SectionComponent,
} from "@/components";
import NoData from "@/assets/images/InviteMemberAssets/not-found-result.png";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ProgressBar } from "react-native-paper";
import { BarChart } from "react-native-chart-kit";
import {
  Dimensions,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

export default function ExpenseDetail() {
  const transactions = [
    {
      id: "1",
      name: "Haidilao",
      amount: -400000,
      date: "01/01/2025",
      time: "17:02",
    },
    {
      id: "2",
      name: "Haidilao",
      amount: -400000,
      date: "01/01/2025",
      time: "17:02",
    },
    {
      id: "3",
      name: "Haidilao",
      amount: -400000,
      date: "01/01/2025",
      time: "17:02",
    },
    {
      id: "4",
      name: "Haidilao",
      amount: -400000,
      date: "01/01/2025",
      time: "17:02",
    },
    {
      id: "5",
      name: "Haidilao",
      amount: -400000,
      date: "01/01/2025",
      time: "17:02",
    },
  ];

  const renderTransactionItem = ({ item }: any) => (
    <View className="flex-row items-center bg-white py-2">
      <Ionicons name="flash-outline" size={20} color="blue" />
      <View className="ml-2 flex-1">
        <Text className="text-base font-normal">{item.name}</Text>
        <Text className="text-sm text-gray-500">
          {item.date} • {item.time}
        </Text>
      </View>
      <Text className="text-base font-semibold text-primary">
        {item.amount.toLocaleString()}đ
      </Text>
    </View>
  );
  return (
    <SafeAreaViewCustom rootClassName="flex-1 bg-gray-100 p-2 relative">
      {/* HEADER */}
      <SectionComponent rootClassName="h-14 bg-white justify-center mb-2">
        <View className="flex-row items-center justify-between px-5">
          <Pressable onPress={router.back}>
            <MaterialIcons name="arrow-back" size={24} color="#609084" />
          </Pressable>
          <Text className="text-lg font-bold text-black">
            Chi tiết ngân sách
          </Text>
          <Text></Text>
        </View>
      </SectionComponent>
      <SectionComponent rootClassName="bg-white p-5 rounded-lg mb-2">
        <View className="mb-2 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="fast-food-outline" size={24} color="#609084" />
            <Text className="ml-2 text-lg font-bold">Ăn uống</Text>
          </View>
          <TouchableOpacity>
            <Ionicons
              name="ellipsis-vertical-outline"
              size={24}
              color="#609084"
            />
          </TouchableOpacity>
        </View>
        <Text className="text-sm text-gray-500">Chi tiêu cho 23 ngày nữa</Text>
        <Text className="mt-2 text-sm font-bold">
          Còn lại <Text className="text-green-500">2.000.000đ</Text>
        </Text>
        <Text className="mt-2 text-sm text-gray-500">
          Chi <Text className="text-green-500 font-bold">1.600.000đ</Text> /
          2.000.000đ
        </Text>
        <ProgressBar
          progress={1.6 / 2}
          color="#609084"
          className="mt-2 h-2 rounded-full"
        />
      </SectionComponent>

      {/* Xu hướng chi tiêu */}
      <SectionComponent rootClassName="bg-white p-5 rounded-lg mb-4">
        <View className="mb-2 flex-row">
          <TouchableOpacity className="mr-2 rounded-lg bg-primary p-2">
            <Text className="font-bold text-white">Theo tuần</Text>
          </TouchableOpacity>
          <TouchableOpacity className="rounded-lg p-2">
            <Text className="font-bold text-primary">Theo tháng</Text>
          </TouchableOpacity>
        </View>
        <BarChart
          data={{
            labels: ["1", "2", "3"],
            datasets: [{ data: [50, 180, 120] }],
          }}
          width={Dimensions.get("window").width - 40}
          height={180}
          yAxisLabel=""
          yAxisSuffix="đ"
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: () => "#609084",
            labelColor: () => "#000",
          }}
          style={{ borderRadius: 10 }}
        />
      </SectionComponent>

      {/* Danh sách giao dịch */}
      <SectionComponent rootClassName="bg-white p-5 pb-5 rounded-lg">
        <Text className="mb-2 text-lg font-bold">Danh sách giao dịch</Text>
        <FlatListCustom
          isBottomTab={true}
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.id.toString()}
          hasMore={transactions.length === 5}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => <Text>Loading more...</Text>}
          contentContainerStyle={{ paddingBottom: 500 }}
          onLoadMore={() => console.log("Load more data")}
          isLoading={false}
          ListEmptyComponent={() => (
            <View className="mt-36 items-center justify-center px-5">
              <Image
                source={NoData}
                className="h-[400px] w-full"
                resizeMode="contain"
              />
            </View>
          )}
        />
      </SectionComponent>
    </SafeAreaViewCustom>
  );
}
