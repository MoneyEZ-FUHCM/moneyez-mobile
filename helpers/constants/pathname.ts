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

    GROUP_DETAIL: ":id",
    STATISTICS: "dashboard-group/GroupManangement",
    CREATE_GROUP_STEP_1: "create-group/CreateGroup",
    CREATE_FUND_CONTRIBUTION_REQUEST:
      "group-details/group-home/fund-contribution-request/FundContributionRequest",
  },
  BOT: {
    CHATBOT: "chatbot/ChatBot",
  },
  HOME: {
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
  },
  ACCOUNT: {
    ACCOUNT_SETTING: "setting/AccountSetting",
    UPDATE_INFO: "update-info/UpdateUserInfo",
  },

  // Group-detail
  GROUP_HOME: {
    GROUP_HOME_DEFAULT:
      "group-details/group-home/group-home-default/GroupHomeDefault",
    CREATE_FUND: "group-details/group-home/create-fund/CreateFund",
  },
  MEMBER: {
    GROUP_MEMBER: "group-details/member/group-member/GroupMember",
    GROUP_FUND: "group-details/member/group-member/group-fund/GroupFund",
    INVITE_MEMBER: "group-details/member/inivite-member/InviteMember",
    INVITE_MEMBER_BY_EMAIL:
      "group-details/member/inivite-member/invite-member-by-email/InviteMemberbyEmail",
    INVITE_MEMBER_BY_QR_CODE:
      "group-details/member/inivite-member/invite-member-by-QR-code/InviteMemberByQRCode",
  },
};

export { PATH_NAME };
