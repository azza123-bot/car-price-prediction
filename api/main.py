import json, joblib
import numpy as np, pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

SALE_YEAR = 2015
bundle = joblib.load("artifacts/model.joblib")
options = json.load(open("artifacts/options.json"))
err_by_age = {int(k): v for k, v in json.load(open("artifacts/error_by_age.json")).items()}

app = FastAPI(title="Used Car Price API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

class Car(BaseModel):
    year: int = Field(ge=1990, le=2015)
    make: str
    model: str
    trim: str = "unknown"
    body: str = "unknown"
    transmission: str = "unknown"
    state: str = "ca"
    color: str = "unknown"
    interior: str = "unknown"
    odometer: float = Field(ge=0, le=500000)
    condition: float = Field(ge=1, le=5)

def predict_one(car: dict) -> float:
    age = max(SALE_YEAR - car["year"], 0)
    row = {**car, "age": age, "km_per_year": car["odometer"] / max(age, 1)}
    X = pd.DataFrame([row])[bundle["features"]]
    X[bundle["cats"]] = bundle["encoder"].transform(X[bundle["cats"]])
    return float(np.expm1(bundle["model"].predict(X)[0]))

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/options")
def get_options():
    return options

@app.post("/predict")
def predict(car: Car):
    c = car.model_dump()
    price = predict_one(c)
    age = max(SALE_YEAR - c["year"], 0)
    pct = err_by_age.get(age, 40.0) / 100
    return {"price": round(price), "low": round(price * (1 - pct)),
            "high": round(price * (1 + pct)), "expected_error_pct": pct * 100}

@app.post("/curve")
def curve(car: Car):
    """Price of this car at different mileages, for the demo chart."""
    c = car.model_dump()
    return [{"odometer": km, "price": round(predict_one({**c, "odometer": km}))}
            for km in range(0, 200001, 20000)]