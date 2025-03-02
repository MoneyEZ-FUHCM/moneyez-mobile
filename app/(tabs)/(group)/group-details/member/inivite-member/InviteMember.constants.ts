const MEMBERS = [
  {
    id: "1",
    name: "Đặng Phan Gia Đức",
    phone: "0384718905",
    contribution: "0đ",
    isOwner: true,
    avatar: "https://randomuser.me/api/portraits/men/1.jpg", // Thay thế bằng URL thật
  },
  {
    id: "2",
    name: "Lương Nguyễn Minh An",
    phone: "0921421727",
    contribution: "1.000đ",
    isOwner: false,
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
];

const USERS = [
  {
    id: 1,
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "https://randomuser.me/api/portraits/men/8.jpg",
  },
  // Add more users as needed
];

const INVITE_MESSAGES = ["Vui vẻ", "Trang trọng", "Lãng mạn", "Mặc định"];

const INVITE_MEMBER_CONSTANTS = {
  MEMBERS,
  USERS,
  INVITE_MESSAGES,
};

export default INVITE_MEMBER_CONSTANTS;
