import { useEffect, useRef, useState } from "react";
import { getOptions, predictPrice, getCurve } from "./api";
import CarForm from "./components/CarForm";
import ResultCard from "./components/ResultCard";
import "./App.css";

export default function App() {
  const [options, setOptions] = useState(null);
  const [car, setCar] = useState({
    year: 2012,
    make: "toyota",
    model: "camry",
    trim: "unknown",
    body: "unknown",
    transmission: "unknown",
    state: "unknown",
    color: "unknown",
    interior: "unknown",
    odometer: 60000,
    condition: 3.5,
  });
  const [result, setResult] = useState(null);
  const [curve, setCurve] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const resultRef = useRef(null);

  useEffect(() => {
    getOptions()
      .then(setOptions)
      .catch(() =>
        setError(
          "The service is not available right now. Please try again later.",
        ),
      );
  }, []);

  async function handleEstimate() {
    setLoading(true);
    setError("");
    try {
      const [prediction, points] = await Promise.all([
        predictPrice(car),
        getCurve(car),
      ]);
      setResult(prediction);
      setCurve(points);
      setTimeout(
        () =>
          resultRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        50,
      );
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <header className="header">
        <h1>Car Price Estimator</h1>
        <p>Find out what a used car is worth in seconds.</p>
      </header>

      {error && <div className="error">{error}</div>}
      {!options && !error && <p className="muted center">Loading…</p>}

      {options && (
        <>
          <CarForm
            options={options}
            car={car}
            setCar={setCar}
            onSubmit={handleEstimate}
            loading={loading}
          />

          <div ref={resultRef}>
            {result && (
              <ResultCard
                result={result}
                curve={curve}
                odometer={car.odometer}
              />
            )}
          </div>

          <details className="about">
            <summary>How accurate is this?</summary>
            <p>
              Estimates are based on 433,000 real used-car sales in the US
              (2014–2015). On average, they are within about 13% of the actual
              sale price, and they are most accurate for cars under 5 years old.
            </p>
          </details>
        </>
      )}

      <footer className="footer">Built by El Eza Ejiwen</footer>
    </div>
  );
}
