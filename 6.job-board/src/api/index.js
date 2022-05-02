import * as utils from "../utils";

export const getJobIds = async () => {
  const res = await fetch(
    `https://hacker-news.firebaseio.com/v0/jobstories.json`
  );
  return await res.json();
};

const getJob = async (jobId) => {
  const res = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${jobId}.json`
  );
  return await res.json();
};
const getJobWithCache = utils.withMemo(getJob);

export const getJobs = async (jobIds) => {
  return await Promise.all(jobIds.map((jobId) => getJobWithCache(jobId)));
};
