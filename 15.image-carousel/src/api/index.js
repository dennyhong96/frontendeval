export const fetchData = async () => {
  const res = await fetch("https://www.reddit.com/r/aww/top/.json?t=all");
  const data = await res.json();
  // Massage data into good shape
  return data.data.children
    .filter((c) => c.data.url_overridden_by_dest?.endsWith(".jpg"))
    .map((c) => ({ src: c.data.url_overridden_by_dest, alt: c.data.title }));
};
