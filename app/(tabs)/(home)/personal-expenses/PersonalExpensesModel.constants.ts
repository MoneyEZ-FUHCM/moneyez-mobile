import { AntDesign } from "@expo/vector-icons";
import React from "react";
const MODELS = [
  {
    name: "JARs",
    description:
      "Phương pháp chia thu nhập thành 6 hũ để dễ dàng quản lý chi tiêu và đạt được mục tiêu lâu dài. 55% - Chi tiêu cần thiết: Tiền dành cho các nhu cầu cơ bản như ăn uống, nhà ở, hóa đơn. 10% - Đầu tư: Dành để tạo ra nguồn thu nhập thụ động hoặc tăng tài sản. 10% - Học tập: Dùng cho việc nâng cao kiến thức và kỹ năng (khóa học, sách). 10% - Tận hưởng: Chi tiêu cho các sở thích cá nhân như du lịch, giải trí. 10% - Tiết kiệm dài hạn: Chuẩn bị cho các mục tiêu lớn như mua nhà, xe. 5% - Từ thiện: Giúp đỡ người khác, lan tỏa giá trị.",
  },
  {
    name: "80-20",
    description:
      "Phương pháp chia thu nhập thành chia thành 3 phần chính: 50% - Nhu cầu thiết yếu: Chi tiêu cho các mục cơ bản như tiền nhà, hóa đơn, thực phẩm. 30% - Mong muốn: Phục vụ các sở thích như mua sắm, ăn ngoài, giải trí. 20% - Tiết kiệm và trả nợ: Để dành cho tiết kiệm, đầu tư hoặc trả nợ.",
  },
  {
    name: "50-20-30",
    description:
      "Phương pháp chia thu nhập thành chia thành 2 phần chính: 80% - Chi tiêu: Dành cho mọi chi phí hàng ngày và các nhu cầu khác. 20% - Tiết kiệm: Để dành cho tương lai hoặc đầu tư.",
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
export const TIME_OPTIONS = ["1 tuần", "1 tháng", "3 tháng", "6 tháng"];

const PERSONAL_EXPENSES_MODEL_CONSTANTS = { MODELS, STEPS, TIME_OPTIONS };

export default PERSONAL_EXPENSES_MODEL_CONSTANTS;
