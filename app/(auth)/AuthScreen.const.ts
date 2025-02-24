const AUTH_SCREEN_CONSTANTS = {
  // login
  FORM_NAME: {
    EMAIL: "email",
    FULLNAME: "fullName",
    PASSWORD: "password",
    PHONE_NUMBER: "phoneNumber",
    CONFIRM_PASSWORD: "confirmPassword",
  },

  ERROR_CODE: {
    ACCOUNT_NOT_EXIST: "AccountNotExist",
    INVALID_ACCOUNT: "PasswordIsIncorrect",
    ACCOUNT_NEED_CONFIRM_EMAIL: "AccountDoesNotVerifyEmail",
    WRONG_PASSWORD: "WRONG_PASSWORD",
    OLD_PASSWORD_INVALID: "OldPasswordInvalid",
    OTP_INVALID: "OtpInvalid",
    RESET_PASSWORD_FAILED: "CanNotResetPassword",
    ACCOUNT_EXISTED: "AccountAlreadyExisted",
    ACCOUNT_BLOCKED: "AccountWasBlocked",
    DUPLICATE_PHONE_NUMBER: "DuplicatePhoneNumber",
    OTP_HAS_SENT: "OtpHasSent",
  },
};

export default AUTH_SCREEN_CONSTANTS;
