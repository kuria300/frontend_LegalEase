// format a number into KES currency string
export const formatCurrency = (amount) =>
  `KSh ${Number(amount).toLocaleString()}`;