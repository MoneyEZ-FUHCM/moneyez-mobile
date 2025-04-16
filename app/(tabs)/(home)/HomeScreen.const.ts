import LogoDeer from "@/assets/images/logo/logo_deer.png";
import { PATH_NAME } from "@/helpers/constants/pathname";
import {
  Bookmark,
  Category,
  Coin1,
  Eye,
  EyeSlash,
  WalletAdd1,
  Activity,
  Graph,
  Calendar,
  TrendUp,
  CalendarEdit,
} from "iconsax-react-native";

const { HOME } = PATH_NAME;

const HOME_SCREEN_CONSTANTS = {
  ERROR_CODE: {},
  MENU_ITEMS: [
    { label: "Thêm chi tiêu", icon: WalletAdd1, url: HOME.ADD_TRANSACTION },
    {
      label: "Mô hình chi tiêu",
      icon: Coin1,
      url: HOME.SPENDING_MODEL_HISTORY,
    },
    {
      label: "Thống kê",
      icon: Activity,
      url: HOME.STATISTIC_OVERVIEW,
    },
    // { label: "Thống kê", icon: Activity, url: HOME.STATISTICAL },
    // { label: "Báo cáo số dư", icon: Graph, url: HOME.BALANCE_REPORT },
    // {
    //   label: "Danh mục theo năm",
    //   icon: Bookmark,
    //   url: HOME.CATEGORY_YEAR_REPORT,
    // },
    // {
    //   label: "Tổng quan danh mục",
    //   icon: Category,
    //   url: HOME.CATEGORY_ALL_TIME,
    // },
    // { label: "Báo cáo theo năm", icon: TrendUp, url: HOME.YEAR_REPORT },
    // {
    //   label: "Lịch giao dịch định kỳ",
    //   icon: CalendarEdit,
    //   url: HOME.RECURRING_TRANSACTIONS_CALENDAR,
    // },
  ],
  POST_DATAS: [
    {
      id: "1",
      title: "Quản lý tài chính đúng cách",
      time: "2 giờ trước",
      image: LogoDeer,
    },
    {
      id: "2",
      title: "Học cách tiết kiệm thông minh",
      time: "3 giờ trước",
      image: LogoDeer,
    },
    {
      id: "3",
      title: "Đầu tư sinh lời",
      time: "1 giờ trước",
      image: LogoDeer,
    },
    {
      id: "4",
      title: "Chi tiêu hợp lý",
      time: "4 giờ trước",
      image: LogoDeer,
    },
    {
      id: "5",
      title: "Quản lý thu chi hiệu quả",
      time: "5 giờ trước",
      image: LogoDeer,
    },
  ],

  GROUP_DATAS: [
    {
      id: "1",
      title: "Quỹ retake đồ án",
      amount: "12.000.000đ",
      Icon: true ? Eye : EyeSlash,
    },
    {
      id: "2",
      title: "Quỹ cho tương lai",
      amount: "12.000.000đ",
      Icon: true ? Eye : EyeSlash,
    },
  ],
};

export default HOME_SCREEN_CONSTANTS;
