import { useEffect, useLayoutEffect, useRef } from "react";

import useAsync from "./hooks/useAsync";
import { JobCard } from "./components/JobCard";
import * as api from "./api";
import * as helpers from "./helpers";

export default function App() {
  // states
  const { data, run } = useAsync({
    data: {
      jobIds: [],
      jobs: []
    }
  });
  const { jobIds, jobs } = data;

  // derived states
  const hasMore = jobs.length < jobIds.length;

  // effects
  useEffect(() => {
    run(
      (async () => {
        const jobIds = await api.getJobIds();
        const firstNineJobs = (await api.getJobs(jobIds.slice(0, 9))).map(
          helpers.parseJob
        );
        return {
          jobIds,
          jobs: firstNineJobs
        };
      })()
    );
  }, [run]);

  // effects
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight - container.clientHeight;
  }, [jobs]);

  // refs
  const containerRef = useRef(null);

  // handlers
  const handleLoadMore = async () => {
    run(
      (async () => {
        const nextSixJobIds = jobIds.slice(jobs.length, jobs.length + 6);
        const nextSixJobs = (await api.getJobs(nextSixJobIds)).map(
          helpers.parseJob
        );
        return {
          jobIds,
          jobs: [...jobs, ...nextSixJobs]
        };
      })()
    );
  };

  return (
    <div ref={containerRef} className="app">
      <h1>HN Jobs</h1>
      <section>
        {jobs.length === 0 &&
          Array(9)
            .fill(null)
            .map((i) => <JobCard.Placeholder key={i} />)}
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </section>
      {hasMore && (
        <div className="more-btn-container">
          <button onClick={handleLoadMore}>Load more</button>
        </div>
      )}
    </div>
  );
}
