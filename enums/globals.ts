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
  EXPENSE,
  INCOME,
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
