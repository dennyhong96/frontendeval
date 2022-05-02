export const getImages = async () => {
  const res = await fetch(`https://www.reddit.com/r/aww/top/.json?t=all`);
  const data = await res.json();
  return data.data.children
    .map((child) => ({
      src: child.data.url_overridden_by_dest,
      alt: child.data.title
    }))
    .filter((img) => img.src.endsWith(".jpg"));
};
