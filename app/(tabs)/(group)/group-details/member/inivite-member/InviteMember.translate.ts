const TEXT_TRANSLATE_INVITE_MEMBER = {
  HEADER: "Mời thành viên",
  INVITE_BY_EMAIL: "Mời bạn bè qua Email",
  INVITE_BY_QR_CODE: "QR tham gia nhóm",
  MEMBER_LIST: (count: number) => `Danh sách thành viên (${count})`,
  OWNER: "Người lập quỹ (Bạn)",
  CONTRIBUTION: "Đã góp quỹ",
};

const TEXT_TRANSLATE_INVITE_MEMBER_BY_EMAIL = {
  HEADER: "Chọn người",
  SEARCH_PLACEHOLDER: "Tìm kiếm...",
  INVITE_MESSAGE_TITLE: "Chọn lời mời vào quỹ",
  INVITE_MESSAGE_NOTE:
    "sẽ giận nếu bạn không đồng ý tham gia quỹ cùng. Tham gia ngay!",
  NO_RESULTS: "Không tìm thấy kết quả",
};

const INVITE_MEMBER_TEXT_TRANSLATE = {
  INVITE_MEMBER: TEXT_TRANSLATE_INVITE_MEMBER,
  INVITE_MEMBER_BY_EMAIL: TEXT_TRANSLATE_INVITE_MEMBER_BY_EMAIL,
};

export default INVITE_MEMBER_TEXT_TRANSLATE;
