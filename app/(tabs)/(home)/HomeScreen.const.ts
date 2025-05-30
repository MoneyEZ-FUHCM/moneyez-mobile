import LogoDeer from "@/assets/images/logo/logo_deer.png";
import { PATH_NAME } from "@/helpers/constants/pathname";
import {
  Activity,
  Calendar,
  Coin1,
  Eye,
  EyeSlash,
  WalletAdd1,
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
      label: "Thu chi định kì",
      icon: Calendar,
      url: HOME.RECURRING_TRANSACTION_LIST,
    },
    { label: "Thống kê", icon: Activity, url: HOME.STATISTIC_OVERVIEW },

    // { label: "Quiz", icon: Bookmark, url: HOME.QUIZ },
    // { label: "Tính năng 6", icon: Card },
    // { label: "Tính năng 7", icon: Category },
    // { label: "Tính năng 8", icon: Profile2User },
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
