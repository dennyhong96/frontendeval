import { useEffect, useState } from "react";

import styles from "./index.module.css";

export function Clock({ getDate = () => new Date() }) {
  const [rotations, setRotations] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    let animationId;
    const run = () => {
      animationId = requestAnimationFrame(() => {
        const date = getDate();
        setRotations({
          hours: (360 / 24) * date.getHours(),
          minutes: (360 / 60) * date.getMinutes(),
          seconds: (360 / 60) * date.getSeconds()
        });
        run();
      });
    };
    run();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [getDate]);

  return (
    <div className={styles.clock}>
      <div style={{ "--rotation": rotations.hours }} />
      <div style={{ "--rotation": rotations.minutes }} />
      <div style={{ "--rotation": rotations.seconds }} />
    </div>
  );
}
