import { SafeAreaViewCustom, SectionComponent } from "@/components";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { LineChart, StackedBarChart, PieChart } from "react-native-chart-kit";
import { Icon } from "react-native-paper";
import { Circle, G } from "react-native-svg";
import TEXT_TRANSLATE_GROUP_STATISTIC from "./GroupManangement.translate";
import { LINE_CHART_DATA } from "./GroupManangement.constant";

const GroupStatistic = () => {
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    legend: ["Legend1", "Legend2"],
    data: [
      [50, 20],
      [30, 40],
      [60, 70],
      [50, 30],
      [20, 10],
      [40, 50],
      [30, 20],
      [60, 40],
    ],
    barColors: ["#609084", "#E1EACD"],
  };

  const donutData = [
    {
      name: "Spent",
      population: 60,
      color: "#6B8E79",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Remaining",
      population: 40,
      color: "#DDE5D6",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];
  return (
    <SafeAreaViewCustom>
      <SectionComponent rootClassName="flex-row justify-between items-center h-14 px-4">
        <TouchableOpacity onPress={router.back}>
          <AntDesign name="arrowleft" size={24} color="#000000" />
        </TouchableOpacity>
        <View className="flex-row items-center gap-1">
          <Text className="text-lg font-bold text-black">
            {TEXT_TRANSLATE_GROUP_STATISTIC.TITLE}
          </Text>
        </View>
        <TouchableOpacity>
          <Entypo size={24} color="#000000" />
        </TouchableOpacity>
      </SectionComponent>
      <View className="mx-2 rounded-lg bg-white p-4">
        <Text className="text-center text-lg font-bold">
          {TEXT_TRANSLATE_GROUP_STATISTIC.OVERVIEW_TITLE}
        </Text>
        <Text className="text-center text-gray-500">
          {TEXT_TRANSLATE_GROUP_STATISTIC.OVERVIEW_DATE}
        </Text>
        <LineChart
          data={LINE_CHART_DATA}
          width={Dimensions.get("window").width - 32} // from react-native
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
            propsForBackgroundLines: {
              strokeDasharray: "", // This will remove the dash lines
            },
            fillShadowGradient: "#609084", // First area color
            fillShadowGradientOpacity: 0.3,
            fillShadowGradientTo: "#3B6B58", // Second area color
            fillShadowGradientToOpacity: 0.3,
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
            opacity: 0.5,
            marginLeft: -16, // Move the chart to the left
          }}
        />
        <View className="mt-2 flex-row justify-center space-x-4">
          <View className="flex-row items-center">
            <View className="mr-2 h-3 w-3 rounded-full bg-[#609084]" />
            <Text className="text-gray-700">
              {TEXT_TRANSLATE_GROUP_STATISTIC.MEMBER_1}
            </Text>
          </View>
          <View className="flex-row items-center">
            <View className="mr-2 h-3 w-3 rounded-full bg-[#3B6B58]" />
            <Text className="text-gray-700">
              {TEXT_TRANSLATE_GROUP_STATISTIC.MEMBER_2}
            </Text>
          </View>
        </View>
      </View>
      <View className="mx-2 rounded-lg bg-white p-4">
        {/* Header with Navigation */}
        <View className="mx-2 rounded-lg bg-white p-4">
          {/* Stacked Bar Chart */}
          <Text className="text-center text-lg font-bold">
            Stacked Bar Chart
          </Text>
          <StackedBarChart
            data={barData}
            width={Dimensions.get("window").width - 32}
            height={220}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            hideLegend={false}
          />
          <View className="mt-2 flex-row justify-between">
            {barData.labels.map((label, index) => (
              <Text
                key={index}
                className={`text-xs ${label === "Aug" ? "font-bold text-black" : "text-gray-400"}`}
              >
                {label}
              </Text>
            ))}
          </View>
        </View>
        {/* Achievement Message */}
        <View className="mt-6 flex-row items-center rounded-lg bg-gray-100 p-4">
          <Entypo name="emoji-happy" size={24} color="#6B8E79" />
          <View className="ml-2">
            <Text className="font-bold">
              {TEXT_TRANSLATE_GROUP_STATISTIC.ACHIEVEMENT_MESSAGE_TITLE}
            </Text>
            <Text className="text-xs text-gray-500">
              {TEXT_TRANSLATE_GROUP_STATISTIC.ACHIEVEMENT_MESSAGE_SUBTITLE}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaViewCustom>
  );
};

export default GroupStatistic;
