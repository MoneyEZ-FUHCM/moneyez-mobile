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
  TOTAL = "TOTAL",
  EXPENSE = "EXPENSE",
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
  PENDING = "PENDING",
  REJECTED = "REJECTED",
}

export enum CHATBOT_CONNECTION {
  CONNECTING = "CONNECTING",
  CONNECTED = "CONNECTED",
  DISCONNECTED = "DISCONNECTED",
}
