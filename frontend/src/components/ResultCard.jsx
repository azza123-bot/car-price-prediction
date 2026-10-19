import PriceChart from "./PriceChart";

const money = (n) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

export default function ResultCard({ result, curve, odometer }) {
  const pct = result.expected_error_pct;
  const confidence = pct < 12 ? "High" : pct < 25 ? "Medium" : "Low";

  return (
    <div className="card result">
      <span className="muted">Estimated value</span>
      <div className="price">{money(result.price)}</div>

      <div className="range">
        Fair price:{" "}
        <strong>
          {money(result.low)} – {money(result.high)}
        </strong>
      </div>

      <span className={`confidence ${confidence.toLowerCase()}`}>
        {confidence} confidence
      </span>

      {curve.length > 0 && (
        <div className="chart-block">
          <h3>How mileage changes its value</h3>
          <PriceChart data={curve} odometer={odometer} />
        </div>
      )}
    </div>
  );
}
