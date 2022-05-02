import { useEffect, useRef, useState } from "react";

// Carousel component
const Carousel = ({
  images = [],
  initialIndex = 0,
  autoplay = false,
  interval = 3000
}) => {
  const [index, setIndex] = useState(
    initialIndex < 0 || initialIndex >= images.length ? 0 : initialIndex
  );

  const timeIdRef = useRef(null);
  useEffect(() => {
    if (autoplay === false) return;
    startInterval();
    return () => stopInterval();
  }, [autoplay, interval]);

  const startInterval = () => {
    stopInterval();
    timeIdRef.current = setInterval(() => {
      handleSlide("next", false);
    }, interval);
  };

  const stopInterval = () => {
    if (timeIdRef.current) clearInterval(timeIdRef.current);
  };

  const handleSlide = (dir, isUserAction = true) => {
    if (!images.length) return;
    if (isUserAction) stopInterval();
    if (dir === "prev") {
      setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
    } else {
      setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
    }
    if (isUserAction) startInterval();
  };

  return (
    <section data-carousel>
      <ul>
        {images.map((img, i) => (
          <li data-active={index === i}>
            <img
              loading={i > 0 ? "lazy" : undefined}
              key={img.src}
              src={img.src}
              alt={img.alt}
            />
          </li>
        ))}
      </ul>
      {images.length > 0 && (
        <>
          <button className="nav-btn" onClick={handleSlide.bind(null, "prev")}>
            &#10218;
          </button>
          <button className="nav-btn" onClick={handleSlide.bind(null, "next")}>
            &#10219;
          </button>
        </>
      )}
    </section>
  );
};

export default Carousel;
