import styles from "./index.module.css";

export function JobCard({ job }) {
  return (
    <a
      className={styles["card-container"]}
      href={job.url}
      title={job.title}
      target="_blank"
      rel="noreferrer noopener"
    >
      <article className={styles.card} key={job.id}>
        <h2>{job.company}</h2>
        <h3>{job.role}</h3>
        <p>{job.date}</p>
      </article>
    </a>
  );
}

JobCard.Placeholder = () => <article className={styles.card} />;
