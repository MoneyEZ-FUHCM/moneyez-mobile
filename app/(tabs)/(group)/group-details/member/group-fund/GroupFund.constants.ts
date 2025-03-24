const CHART_DATA = {
  labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
  datasets: [
    {
      data: [50, 80, 150, 100, 120, 180, 70],
    },
  ],
};

const EXPENSES = [
  {
    id: 1,
    name: "Tiêu dùng",
    atb: "đ29.99",
    value: 34,
    amount: "2843.98",
  },
  { id: 2, name: "Giáo dục", atb: "đ49.99", value: 13, amount: "1084.11" },
  {
    id: 3,
    name: "Thiết yếu",
    atb: "đ10.99",
    value: 49,
    amount: "5000.00",
  },
];

const GROUP_FUND_CONSTANTS = { CHART_DATA, EXPENSES };

export default GROUP_FUND_CONSTANTS;
