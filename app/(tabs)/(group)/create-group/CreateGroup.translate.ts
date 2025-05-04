const TEXT_TRANSLATE_CREATE_GROUP = {
  // Title
  TITLE: {
    CREATE_NEW_GROUP: "Tạo nhóm mới",
    UPDATE_GROUP: "Chỉnh sửa thông tin nhóm",
    GROUP_FUNDS: "Quỹ của nhóm",
  },

  // Steps
  STEPS: {
    INFORMATION: "Thông tin",
  },

  // Button
  BUTTON: {
    NEXT: "Xác nhận",
    CONTRIBUTE: "Góp quỹ",
    WITHDRAW: "Rút quỹ",
    ACTIVATE: "Kích hoạt",
    VIEW_ALL: "Xem tất cả",
    UPDATE: "Cập nhật"
  },

  // Placeholder
  PLACEHOLDER: {
    ENTER_GROUP_NAME: "Nhập tên nhóm",
    ENTER_DESCRIPTION: "Nhập mô tả",
    ENTER_CURRENT_BALANCE: "Nhập số dư hiện tại",
    ENTER_ACCOUNT_BANKING: "Nhập số tài khoản",
  },

  // Text
  TEXT: {
    GROUP_NAME: "Tên nhóm",
    DESCRIPTION: "Mô tả",
    CURRENT_BALANCE: "Số dư hiện tại",
    ACCOUNT_BANKING: "Số tài khoản",
    FUND_OVERVIEW: "🌿 Tích lũy cho tương lai",
    FUND_AMOUNT: "10.000đ",
    FUND_GOAL: "Tạo mục tiêu và hiện thực ước mơ nhé",
    AUTO_SAVE: "Sinh lời tự động mỗi ngày",
    ONLY_FROM: "Chỉ từ 20.000đ",
    IN_FUND: "trong quỹ",
    EARN_UP_TO: "Sinh lời đến",
    PER_YEAR: "4%/năm",
    FLEXIBLE_PAYMENT: "Thanh toán linh hoạt",
    REMIND_CONTRIBUTE: "Nhắc góp quỹ",
    QR_CONTRIBUTE: "QR góp quỹ",
    STATISTICS: "Thống kê",
    RECENT_ACTIVITIES: "Hoạt động gần đây",
    NEW: "Mới",
  },
  // Validation Messages
  MESSAGE_VALIDATE: {
    GROUP_NAME_REQUIRED: "Tên nhóm không được để trống",
    DESCRIPTION_REQUIRED: "Mô tả không được để trống",
    ACCOUNT_BANKING_REQUIRED: "Số tài khoản không được để trống",
    CURRENT_BALANCE_REQUIRED: "Số dư hiện tại không được để trống",
    CURRENT_BALANCE_INVALID: "Số dư hiện tại phải là một số hợp lệ",
    ALL_FIELDS_REQUIRED: "Vui lòng điền đầy đủ và chính xác tất cả các trường.",
    ACCOUNT_NUMBER_CANNOT_CHANGED: "Không thể thay đổi tài khoản ngân hàng khi chỉnh sửa nhóm",
  },
  // Error Messages
  ERROR_MESSAGES: {
    GROUP_CREATION_FAILED: "Tạo nhóm thất bại, vui lòng thử lại sau",
    NETWORK_ERROR: "Lỗi mạng, vui lòng kiểm tra kết nối của bạn",
    UNKNOWN_ERROR: "Đã xảy ra lỗi, vui lòng thử lại",
  },

  SUCCESS_MESSAGES: {
    GROUP_CREATED_SUCCESSFULLY: "Nhóm đã được tạo thành công",
    GROUP_UPDATED_SUCCESSFULLY: "Nhóm đã được cập nhật thành công",
    CONTRIBUTION_SUCCESSFUL: "Góp quỹ thành công",
    WITHDRAWAL_SUCCESSFUL: "Rút quỹ thành công",
  },
};

export default TEXT_TRANSLATE_CREATE_GROUP;
