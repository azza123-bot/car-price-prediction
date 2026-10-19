const API = import.meta.env.VITE_API_URL;

async function post(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Request to ${path} failed`);
  return res.json();
}

export async function getOptions() {
  const res = await fetch(`${API}/options`);
  if (!res.ok) throw new Error("Could not load options");
  return res.json();
}

export const predictPrice = (car) => post("/predict", car);
export const getCurve = (car) => post("/curve", car);
