import { useState, useEffect } from "react";
import Carousel from "./components/Carousel";
import * as api from "./api";

export default function App() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    api
      .fetchData()
      .then((images) => setImages(images))
      .catch((err) => console.error(err));
  }, []);

  return images.length > 0 ? <Carousel images={images} autoplay /> : null;
}
