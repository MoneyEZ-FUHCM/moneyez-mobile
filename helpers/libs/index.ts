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
