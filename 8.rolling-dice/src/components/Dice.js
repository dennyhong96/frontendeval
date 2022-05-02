const dotClasses = {
  1: ["center"],
  2: ["top-right", "bottom-left"],
  3: ["top-right", "bottom-left", "center"],
  4: ["top-left", "top-right", "bottom-left", "bottom-right"],
  5: ["top-left", "top-right", "bottom-left", "bottom-right", "center"],
  6: [
    "top-left",
    "top-right",
    "center-left",
    "center-right",
    "bottom-left",
    "bottom-right"
  ]
};

export function Dice({ number }) {
  return (
    <div className="dice">
      {dotClasses[number].map((dot) => (
        <div className={`dot ${dot}`} key={dot} />
      ))}
    </div>
  );
}
