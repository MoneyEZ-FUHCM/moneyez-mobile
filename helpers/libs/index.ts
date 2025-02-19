import moment from "moment";

export const formatFromNow = (date: moment.MomentInput) => {
  if (!date) return "N/A";
  return moment(date).fromNow();
};

export function convertDate(dateStr: any) {
  // Parse the date string into a Date object
  const dateObj = new Date(dateStr);
  // Get the day, month, and year from the Date object
  const day = String(dateObj.getUTCDate()).padStart(2, "0");
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = dateObj.getUTCFullYear();
  // Format the date as dd/mm/yyyy
  return `${day}/${month}/${year}`;
}
