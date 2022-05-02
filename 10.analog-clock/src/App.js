import { Clock } from "./components/Clock";
import * as helpers from "./helpers";

export default function App() {
  return (
    <div className="app">
      <div>
        <p>Local Time</p>
        <Clock />
      </div>
      <div>
        <p>New York Time</p>
        <Clock
          getDate={helpers.getDateForTimeZone.bind(null, "America/New_York")}
        />
      </div>
      <div>
        <p>London Time</p>
        <Clock
          getDate={helpers.getDateForTimeZone.bind(null, "Europe/London")}
        />
      </div>
    </div>
  );
}
