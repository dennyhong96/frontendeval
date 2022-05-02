export const getDateForTimeZone = (timeZone) =>
  new Date(new Date().toLocaleString("en-US", { timeZone }));
