export const displayCurrency = (amount) => {
  amount = (!isFinite(amount) ? Number(0) : amount).toFixed(2);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);
};
