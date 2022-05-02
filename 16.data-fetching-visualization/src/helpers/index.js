export const getCeil = (data) => {
  const max = Math.max(...data);
  const ceil = Math.ceil(max / 10) * 10;
  return ceil;
};

export const getYLabels = (ceil, chartHeight) =>
  Array.from({ length: ceil / 10 + 1 })
    .map((_, i) => {
      const num = i * 10;
      return {
        num,
        top: ((ceil - num) / ceil) * chartHeight
      };
    })
    .reverse();

export const getBars = (data, ceil, chartHeight) =>
  data.map((n, i) => {
    const num = i + 1;
    return {
      num,
      height: (n / ceil) * chartHeight
    };
  });
