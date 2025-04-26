import { TRANSACTION_STATUS } from "@/helpers/enums/globals";

const ACTION_LOG_HISTORY_CONSTANT = {
  TABS: [
    { label: "Danh sách giao dịch", type: TRANSACTION_STATUS.CONFIRMED },
    { label: "Đang chờ duyệt", type: TRANSACTION_STATUS.PENDING },
  ],
};

export default ACTION_LOG_HISTORY_CONSTANT;
