import { getBars, getCeil, getYLabels } from "../helpers";

const Chart = ({ data, chartHeight = 400, barWidth = 40 }) => {
  // Derived state
  const ceil = getCeil(data);

  return (
    <section
      data-bar-chart
      style={{
        "--chart-height": `${chartHeight}px`,
        "--bar-width": `${barWidth}px`
      }}
    >
      <div className="y-labels">
        {getYLabels(ceil, chartHeight).map((yLabel) => (
          <span
            className="y-label"
            key={yLabel.num}
            style={{ top: yLabel.top }}
          >
            {yLabel.num}
          </span>
        ))}
      </div>
      <div className="bars">
        {getBars(data, ceil, chartHeight).map((bar) => (
          <div key={bar.num} className="bar" style={{ height: bar.height }}>
            <span className="x-label">{bar.num}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Chart;
