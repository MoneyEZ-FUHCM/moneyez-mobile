export enum VALID_ROLE {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum VALID_ROLE_REQUEST {
  ADMIN,
  USER,
}

export enum GENDER {
  MALE,
  FEMALE,
  OTHER,
}

export enum GENDER_INFO {
  MALE = "Nam",
  FEMALE = "Nữ",
  OTHER = "Khác",
}

export enum PAYMENT {
  VIETQR,
}
export enum TRANSACTION_TYPE {
  INCOME,
  EXPENSE,
}
export enum TRANSACTION_TYPE_TEXT {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
  TOTAL = "TOTAL",
}

export enum PAYMENT_STATUS {
  PAID = "PAID",
  FAILED = "FAILED",
  PENDING = "PENDING",
}

export enum TOAST_STATUS {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

export enum PERIOD_UNIT {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  YEAR = "YEAR",
}

export enum TRANSACTION_STATUS {
  APPROVED = "APPROVED",
  CONFIRMED = "confirmed",
  PENDING = "PENDING",
  REJECTED = "REJECTED",
}

export enum CHATBOT_CONNECTION {
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
  DISCONNECTED = "DISCONNECTED",
}

export enum GROUP_MEMBER_STATUS {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum GROUP_ROLE {
  MEMBER = "MEMBER",
  LEADER = "LEADER",
}

export enum CHAT_ROLE {
  BOT,
  USER,
  ADMIN,
}

export enum GROUP_STATUS {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
}

export enum GROUP_FINANCIAL_GOAL_STATUS {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
  COMPLETED = "COMPLETED",
}
