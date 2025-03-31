import { AntDesign } from "@expo/vector-icons";
import React from "react";
const MODELS = [
  {
    name: "JARs",
    description:
      "Phương pháp chia thu nhập thành 6 hũ để dễ dàng quản lý chi tiêu và đạt được mục tiêu lâu dài:\n" +
      "  • 55% - Chi tiêu cần thiết: Tiền dành cho các nhu cầu cơ bản như ăn uống, nhà ở, hóa đơn.\n" +
      "  • 10% - Đầu tư: Dành để tạo ra nguồn thu nhập thụ động hoặc tăng tài sản.\n" +
      "  • 10% - Học tập: Dùng cho việc nâng cao kiến thức và kỹ năng (khóa học, sách).\n" +
      "  • 10% - Tận hưởng: Chi tiêu cho các sở thích cá nhân như du lịch, giải trí.\n" +
      "  • 10% - Tiết kiệm dài hạn: Chuẩn bị cho các mục tiêu lớn như mua nhà, xe.\n" +
      "  • 5% - Từ thiện: Giúp đỡ người khác, lan tỏa giá trị.",
  },
  {
    name: "80-20",
    description:
      "Phương pháp chia thu nhập thành 3 phần chính:\n" +
      "  • 50% - Nhu cầu thiết yếu: Chi tiêu cho các mục cơ bản như tiền nhà, hóa đơn, thực phẩm.\n" +
      "  • 30% - Mong muốn: Phục vụ các sở thích như mua sắm, ăn ngoài, giải trí.\n" +
      "  • 20% - Tiết kiệm và trả nợ: Để dành cho tiết kiệm, đầu tư hoặc trả nợ.",
  },
  {
    name: "50-20-30",
    description:
      "Phương pháp chia thu nhập thành 2 phần chính:\n" +
      "  • 80% - Chi tiêu: Dành cho mọi chi phí hàng ngày và các nhu cầu khác.\n" +
      "  • 20% - Tiết kiệm: Để dành cho tương lai hoặc đầu tư.",
  },
  { name: "Tùy chọn" },
];

const STEPS = [
  {
    label: "Mô hình",
    icon: React.createElement(AntDesign, {
      name: "appstore-o",
      size: 20,
      color: "#fff",
    }),
    isActive: true,
  },
  {
    label: "Thời gian",
    icon: React.createElement(AntDesign, {
      name: "clockcircleo",
      size: 20,
      color: "#fff",
    }),
    isActive: false,
  },
  {
    label: "Xác nhận",
    icon: React.createElement(AntDesign, {
      name: "checkcircleo",
      size: 20,
      color: "#fff",
    }),
    isActive: false,
  },
];

export enum PeriodUnit {
  DAY = 0,
  WEEK = 1,
  MONTH = 2,
  YEAR = 3,
}

export const TIME_OPTIONS = [
  { label: "1 tuần", unit: PeriodUnit.WEEK, value: 1 },
  { label: "1 tháng", unit: PeriodUnit.MONTH, value: 1 },
  { label: "3 tháng", unit: PeriodUnit.MONTH, value: 3 },
  { label: "6 tháng", unit: PeriodUnit.MONTH, value: 6 },
];

const ERROR_CODE= {
  ALREADY_HAS_ACTIVE_MODEL: "UserAlreadyHasActiveSpendingModel",
}

const PERSONAL_EXPENSES_MODEL_CONSTANTS = { MODELS, STEPS, TIME_OPTIONS , ERROR_CODE};

export default PERSONAL_EXPENSES_MODEL_CONSTANTS;
