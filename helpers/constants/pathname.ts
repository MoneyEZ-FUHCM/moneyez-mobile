const PATH_NAME = {
  COMMON: {
    ERROR_PAGE: "+not-found",
  },
  SPLASH: {
    SPLASH_SCREEN: "index",
  },
  TABS: {
    TABS_NAVIGATOR: "(tabs)",
  },
  AUTH: {
    AUTH_NAVIGATOR: "(auth)",
    LOGIN: "login/Login",
    REGISTER: "register/Register",
    INPUT_OTP: "forgot-password/InputOtp",
    CONFIRM_EMAIL: "forgot-password/ConfirmEmail",
    SET_NEW_PASSWORD: "forgot-password/SetNewPassword",
  },
  GROUP: {
    GROUP_NAVIGATOR: "(group)",
    GROUP_LIST: "Group",
    GROUP_FUND: "group-fund/GroupFund",
    GROUP_DETAIL: ":id",
    STATISTICS: "dashboard-group/GroupManangement",
    CREATE_GROUP_STEP_1: "create-group/CreateGroup",
    CREATE_FUND_CONTRIBUTION_REQUEST:
      "fund-contribution-request/FundContributionRequest",
    CREATE_FUNCTION_BANK_ACCOUNT:
      "create-group/function-bank-account/FunctionBankAccount",
    BANK_ACCOUNT_LIST: "create-group/bank-account-list/BankAccount",
  },
  BOT: {
    CHATBOT: "chatbot/ChatBot",
  },
  HOME: {
    HOME_NAVIGATOR: "(home)",
    HOME_DEFAULT: "home-screen/HomeScreen",
    INDIVIDUAL_HOME: "individual-home/IndividualHome",
    ADD_TRANSACTION: "add-transaction/AddTransaction",
    SPENDING_MODEL_HISTORY: "spending-model-history/SpendingModelHistory",
    PERIOD_HISTORY: "period-history/PeriodHistory",
    PERIOD_HISTORY_DETAIL: "period-history/PeriodHistoryDetail",
    PERSONAL_EXPENSES_MODEL: "personal-expenses/PersonalExpensesModel",
    NOTIFICATION: "notification/NotificationList",
    SPENDING_BUDGET_LIST: "spending-budget-list/SpendingBudgetList",
    TRANSACTION_DETAIL: "transaction-detail/TransactionDetail",
    ADD_SPENDING_BUDGET_STEP_1: "add-spending-budget/CreateSpendingBudgetStep1",
    ADD_SPENDING_BUDGET_STEP_2: "add-spending-budget/CreateSpendingBudgetStep2",
    EXPENSES_DETAIL: "expenses/expense-detail/ExpenseDetail",
    UPDATE_EXPENSE: "expenses/update-expense/UpdateExpense",
    STATISTICAL: "statistical/Statistical",
    QUIZ: "quiz/QuizScreen",
  },
  ACCOUNT: {
    ACCOUNT_SETTING: "setting/AccountSetting",
    UPDATE_INFO: "update-info/UpdateUserInfo",
    BANK_ACCOUNT: "bank-account/bank-account-list/BankAccount",
    FUNCTION_BANK_ACCOUNT:
      "bank-account/function-bank-account/FunctionBankAccount",
  },

  // Group-detail
  GROUP_HOME: {
    GROUP_HOME_DEFAULT:
      "group-details/group-home/group-home-default/GroupHomeDefault",
    CREATE_FUND_REQUEST:
      "group-details/group-home/create-fund-request/CreateFundRequest",
    FUND_REQUEST_INFO:
      "group-details/group-home/fund-request-info/FundRequestInfo",
    WITHDRAW_FUND_REQUEST:
      "group-details/group-home/withdraw-fund-request/WithdrawFundRequest",
    GROUP_FUND_REMIND:
      "group-details/group-home/group-fund-remind/GroupFundRemind",
    GROUP_STATISTIC:
      "group-details/group-home/group-statistic/GroupStatistic",
    EDIT_LOG_HISTORY:
      "group-details/group-home/edit-log-history/EditLogHistory",
    ACTION_LOG_HISTORY:
      "group-details/group-home/action-log-history/ActionLogHistory",
  },
  GROUP_SETTING: {
    GROUP_SETTING_DEFAULT:
      "group-details/group-setting/group-setting-default/GroupSettingDefault",
    GROUP_RATIO_MEMBER:
      "group-details/group-setting/group-ratio-member/GroupRatioMember",
  },
  MEMBER: {
    GROUP_MEMBER: "group-details/member/group-member/GroupMember",
    INVITE_MEMBER: "group-details/member/inivite-member/InviteMember",
    INVITE_MEMBER_BY_EMAIL:
      "group-details/member/inivite-member/invite-member-by-email/InviteMemberbyEmail",
    INVITE_MEMBER_BY_QR_CODE:
      "group-details/member/inivite-member/invite-member-by-QR-code/InviteMemberByQRCode",
  },
};

export { PATH_NAME };
