export const formatCurrencyCompact = (amount: number | undefined | null) => {
  console.log("check amount", amount);
  if (amount === undefined || amount === null || amount === 0) {
    return "0";
  }
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K`;
  }
  return amount.toString();
};
