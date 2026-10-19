import { useState } from "react";

const YEARS = Array.from({ length: 26 }, (_, i) => 2015 - i);
const CONDITIONS = [
  { label: "Poor", value: 1.5 },
  { label: "Fair", value: 2.5 },
  { label: "Good", value: 3.5 },
  { label: "Very good", value: 4.2 },
  { label: "Excellent", value: 4.8 },
];

const capitalize = (s) => String(s).replace(/\b\w/g, (c) => c.toUpperCase());

function Select({
  label,
  value,
  items,
  onChange,
  format = capitalize,
  notSure = false,
}) {
  const list = notSure
    ? ["unknown", ...items.filter((i) => i !== "unknown")]
    : items;
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {list.map((item) => (
          <option key={item} value={item}>
            {item === "unknown" ? "Not sure" : format(item)}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function CarForm({ options, car, setCar, onSubmit, loading }) {
  const [showMore, setShowMore] = useState(false);

  const makes = Object.keys(options.makes).sort();
  const models = Object.keys(options.makes[car.make] || {}).sort();
  const trims = options.makes[car.make]?.[car.model] || [];

  function changeMake(make) {
    const firstModel = Object.keys(options.makes[make]).sort()[0];
    setCar({ ...car, make, model: firstModel, trim: "unknown" });
  }

  function changeModel(model) {
    setCar({ ...car, model, trim: "unknown" });
  }

  function update(field, value) {
    setCar({ ...car, [field]: value });
  }

  const canSubmit = car.odometer !== "" && !loading;

  return (
    <form
      className="card form"
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit();
      }}
    >
      <div className="row">
        <Select
          label="Brand"
          value={car.make}
          items={makes}
          onChange={changeMake}
        />
        <Select
          label="Model"
          value={car.model}
          items={models}
          onChange={changeModel}
        />
      </div>

      <div className="row">
        <Select
          label="Year"
          value={car.year}
          items={YEARS}
          format={(y) => y}
          onChange={(v) => update("year", Number(v))}
        />
        <label className="field">
          <span>Mileage</span>
          <div className="input-suffix">
            <input
              type="number"
              inputMode="numeric"
              min="0"
              max="300000"
              placeholder="e.g. 60000"
              value={car.odometer}
              onChange={(e) =>
                update(
                  "odometer",
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
            />
            <span>miles</span>
          </div>
        </label>
      </div>

      <div className="field">
        <span>Condition</span>
        <div className="pills">
          {CONDITIONS.map((c) => (
            <button
              key={c.label}
              type="button"
              className={`pill ${car.condition === c.value ? "active" : ""}`}
              onClick={() => update("condition", c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="link"
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? "− Fewer details" : "+ More details (optional)"}
      </button>

      {showMore && (
        <div className="more">
          <div className="row">
            <Select
              label="Version"
              value={car.trim}
              items={trims}
              notSure
              onChange={(v) => update("trim", v)}
            />
            <Select
              label="Body type"
              value={car.body}
              items={options.body}
              notSure
              onChange={(v) => update("body", v)}
            />
          </div>
          <div className="row">
            <Select
              label="Gearbox"
              value={car.transmission}
              items={options.transmission}
              notSure
              onChange={(v) => update("transmission", v)}
            />
            <Select
              label="US state"
              value={car.state}
              items={options.state}
              notSure
              format={(s) => s.toUpperCase()}
              onChange={(v) => update("state", v)}
            />
          </div>
        </div>
      )}

      <button type="submit" className="primary" disabled={!canSubmit}>
        {loading ? "Estimating…" : "Get my estimate"}
      </button>
    </form>
  );
}
