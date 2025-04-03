import { TRANSACTION_STATUS } from "@/enums/globals";

const ACTION_LOG_HISTORY_CONSTANT = {
  TABS: [
    { label: "Danh sách giao dịch", type: TRANSACTION_STATUS.APPROVED },
    { label: "Đang chờ duyệt", type: TRANSACTION_STATUS.PENDING },
  ],
};

export default ACTION_LOG_HISTORY_CONSTANT;
