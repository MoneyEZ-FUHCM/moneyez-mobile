const COMMON_CONSTANT = {
  // HTTP status
  HTTP_STATUS: {
    SUCCESS: {
      OK: 200,
      CREATED: 201,
    },
    CLIENT_ERROR: {
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
    },
    SERVER_ERROR: {
      INTERNAL_SERVER_ERROR: 500,
    },
  },

  // Role
  ROLE_PERMISSION_ADMIN: "ADMIN",
  ROLE_PERMISSION_USERS: "USER",

  // animation for navigate
  ANIMATION_NAVIGATE_STACK: {
    SLIDE_FROM_RIGHT: "slide_from_right" as StackAnimationTypes,
    SLIDE_FROM_LEFT: "slide_from_left" as StackAnimationTypes,
    SLIDE_FROM_BOTTOM: "slide_from_bottom" as StackAnimationTypes,
    FADE_FROM_BOTTOM: "fade_from_bottom" as StackAnimationTypes,
    FADE: "fade" as StackAnimationTypes,
  },

  ANIMATION_NAVIGATE_TAB: {
    SHIFT: "shift" as TabAnimationTypes,
    NONE: "none" as TabAnimationTypes,
    FADE: "fade" as TabAnimationTypes,
  },

  CONDITION: {
    TRUE: true,
    FALSE: false,
  },

  THEME_COLOR: {
    DARK: "dark" as ThemeColorTypes,
    LIGHT: "light" as ThemeColorTypes,
  },

  BOTTOM_TABLE_NAME: {
    HOME: "(home)",
    BOT: "(bot)",
    GROUP: "(group)",
    ACCOUNT: "(account)",
  },

  BOTTOM_TABLE_TRANSLATE: {
    HOME: "Trang chủ",
    BOT: "Trợ lý ảo",
    GROUP: "Nhóm",
    ACCOUNT: "Tài khoản",
  },
};

export { COMMON_CONSTANT };
