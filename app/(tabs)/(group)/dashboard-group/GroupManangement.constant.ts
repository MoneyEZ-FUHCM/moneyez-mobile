export const BAR_DATA = [
  { month: "Jan", values: [50, 30] },
  { month: "Feb", values: [20, 40] },
  { month: "Mar", values: [30, 50] },
  { month: "Apr", values: [40, 20] },
  { month: "May", values: [60, 30] },
  { month: "Jun", values: [70, 40] },
  { month: "Jul", values: [50, 60] },
  { month: "Aug", values: [30, 70] },
];

export const LINE_CHART_DATA = {
  labels: ["30/4", "5/5", "10/5", "15/5", "20/5", "25/5", "30/5"],
  datasets: [
    {
      data: [20, 50, 30, 60, 40, 70, 50],
      color: (opacity = 1) => `rgba(96, 144, 132, ${opacity})`, // optional
      strokeWidth: 2, // optional
    },
    {
      data: [10, 30, 20, 40, 25, 50, 35],
      color: (opacity = 1) => `rgba(225, 234, 205, ${opacity})`, // optional
      strokeWidth: 2, // optional
    },
  ],
};

export const DONUT_DATA = [
  { value: 60, svg: { fill: "#6B8E79" }, key: "darkGreen" },
  { value: 40, svg: { fill: "#DDE5D6" }, key: "lightGreen" },
];
