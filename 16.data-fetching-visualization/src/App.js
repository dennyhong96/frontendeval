/*
 * https://frontendeval.com/questions/data-fetching
 *
 * Build a histogram chart from a list of randomly-generated numbers
 */

import { fetchData } from "./api";
import Chart from "./components/Chart";

const { useEffect, useState } = require("react");

const App = () => {
  // State
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData()
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  return <Chart data={data} chartHeight={500} barWidth={50} />;
};

export default App;
