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
    CREATE_GROUP_STEP_2: "create-group/CreateGroupStep2",
  },
  BOT: {
    CHATBOT: "chatbot/ChatBot",
  },
  HOME: {
    HOME_DEFAULT: "home-screen/HomeScreen",
    INVIDUAL_HOME: "invidual-home/InvidualHome",
    ADD_TRANSACTION: "add-transaction/AddTransaction",
    TRANSACTION_HISTORY: "transaction-history/TransactionHistory",
    PERIOD_HISTORY: "period-history/PeriodHistory",
    PERIOD_HISTORY_DETAIL: "period-history/PeriodHistoryDetail",
    PERSONAL_EXPENSES_MODEL: "personal-expenses/PersonalExpensesModel",
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
    INVITE_MEMBER: "group-details/member/inivite-member/InviteMember",
    INVITE_MEMBER_BY_EMAIL:
      "group-details/member/inivite-member/InviteMemberbyEmail",
  },
};

export { PATH_NAME };
