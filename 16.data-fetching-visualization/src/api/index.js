const API_URL =
  "https://www.random.org/integers/?num=200&min=1&max=15&col=1&base=10&format=plain&rnd=new";

export const fetchData = async () => {
  const res = await fetch(API_URL);
  const text = await res.text();
  const nums = text.split("\n").filter((n) => n !== "");
  const data = nums.reduce((acc, cur) => {
    const index = Number(cur) - 1;
    acc[index] = (acc[index] ?? 0) + 1;
    return acc;
  }, []);
  return data;
};
