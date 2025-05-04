import moment from "moment";

export const formatFromNow = (date: moment.MomentInput) => {
  if (!date) return "N/A";
  return moment(date).fromNow();
};

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  })
    .format(value)
    .replace(/\s₫/, "đ");

export const formatCurrencyInput = (value: string) => {
  return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const formatIntervalInput = (value: string): string => {
  if (!value) return "";
  const digitsOnly = value.replace(/[^\d]/g, "");
  const withoutLeadingZeros = digitsOnly.replace(/^0+/, "");
  const numericValue = parseInt(withoutLeadingZeros, 10);

  return isNaN(numericValue) ? "1" : numericValue.toString();
};

export const parseCurrency = (formattedValue: string): number => {
  return Number(formattedValue.replace(/\./g, ""));
};

export const formatDate = (
  date: moment.MomentInput,
  pattern: string = "DD/MM/YYYY",
): string => {
  if (!date) return "N/A";
  return moment.utc(date).format(pattern);
};

export const formatDateMonth = (
  date: moment.MomentInput,
  pattern: string = "DD.MM",
): string => {
  if (!date) return "N/A";
  return moment(date).format(pattern);
};

export const formatDateMonthYear = (
  date: moment.MomentInput,
  pattern: string = "DD.MM.YYYY",
): string => {
  if (!date) return "N/A";
  return moment(date).format(pattern);
};

export const formatDateTime = (
  date: moment.MomentInput,
  pattern: string = "HH:mm",
): string => {
  if (!date) return "N/A";
  return moment.utc(date).format(pattern);
};

export const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const formatTime = (date: moment.MomentInput) => {
  if (!date) return "N/A";
  return moment(date).format("HH:mm");
};

export function convertUTCToVietnamTime(utcDate: Date): Date {
  const vietnamOffsetInMs = 7 * 60 * 60 * 1000;
  return new Date(utcDate.getTime() + vietnamOffsetInMs);
}

export const calculateRemainingDays = (endDate: string | Date): number => {
  if (!endDate) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(endDate);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);
};

export const parseMarkdown = (markdown: string) => {
  if (!markdown) return "";

  // Xử lý tiêu đề
  markdown = markdown.replace(/^### (.*$)/gm, "$1\n");
  markdown = markdown.replace(/^## (.*$)/gm, "$1\n");
  markdown = markdown.replace(/^# (.*$)/gm, "$1\n");

  // Xử lý chữ đậm và nghiêng
  markdown = markdown.replace(/\*\*([^\*]+)\*\*/g, "$1"); // **bold** -> bold
  markdown = markdown.replace(/\*([^\*]+)\*/g, "$1"); // *italic* -> italic

  // Xử lý danh sách
  markdown = markdown.replace(/\n- (.*)/g, "- $1");

  // Xử lý link
  markdown = markdown.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, "$1 ($2)");

  // Xử lý xuống dòng
  markdown = markdown.replace(/\n{2,}/g, "\n\n");

  return markdown.trim();
};

export const isValidGUID = (token: string) => {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    token,
  );
};

export const formatPercentage = (value: number) => {
  const multiplied = value * 100;
  const decimalPart = multiplied.toString().split(".")[1];

  if (!decimalPart) {
    return multiplied.toFixed(0);
  } else if (decimalPart.length === 1) {
    return multiplied.toFixed(1);
  } else {
    return multiplied.toFixed(2);
  }
};
