// import { View } from "react-native";
// import { BarChart } from "react-native-gifted-charts";

// const StackedBarChartExample = () => {
//   const jsonData = [
//     {
//       actualPercentage: 26.67,
//       // categoryName: "Nhu cầu thiết yếu",
//       plannedPercentage: 55 - 26.67,
//     },
//     {
//       actualPercentage: 6.67,
//       // categoryName: "Tiết kiệm",
//       plannedPercentage: 10 - 6.67,
//     },
//     {
//       actualPercentage: 0,
//       // categoryName: "Đầu tư",
//       plannedPercentage: 10 - 0,
//     },
//     {
//       actualPercentage: 0,
//       // categoryName: "Giải trí",
//       plannedPercentage: 10 - 0,
//     },
//     {
//       actualPercentage: 0,
//       // categoryName: "Giáo dục",
//       plannedPercentage: 10 - 0,
//     },
//     {
//       actualPercentage: 0,
//       // categoryName: "Từ thiện",
//       plannedPercentage: 5 - 0,
//     },
//   ];

//   // Chuyển đổi JSON thành stackData
//   const stackData = jsonData.map((item) => ({
//     label: item.categoryName,
//     stacks: [
//       { value: item.actualPercentage, color: "#609084" },
//       { value: item.plannedPercentage, color: "#BAD8B6" },
//     ],
//   }));

//   return (
//     <View>
//       <BarChart
//         width={340}
//         height={200}
//         hideRules={true}
//         rotateLabel
//         stackData={stackData}
//         barWidth={30} // Điều chỉnh độ rộng của các cột
//         xAxisLabelTextStyle={{ fontSize: 12 }} // Điều chỉnh kiểu chữ của nhãn trục X
//         yAxisTextStyle={{ fontSize: 12 }} // Chỉnh cỡ chữ trục Y
//       />
//     </View>
//   );
// };

// export default StackedBarChartExample;
