export const getDateForTimeZone = (timeZone) =>
  new Date(new Date().toLocaleString("en-US", { timeZone }));

export const parseJob = (job) => {
  const [company, role] = job.title.split(/ is hiring | is looking for /i);
  return {
    id: job.id,
    title: job.title,
    company,
    role: `Is hiring${role ? ` ${role}` : ""}`,
    date: new Date(job.time * 1000).toLocaleDateString(),
    url: job.url ?? `https://news.ycombinator.com/item?id=${job.id}`
  };
};
