# Used Car Price Prediction

How much is a used car really worth? I wanted to answer that with data instead of guesswork, so I built a model that estimates the price of a used car from its listing details, and a small web app where you can try it.


## Why I built this

This is my end-to-end data science project. I didn't want to just call `.fit()` on a clean dataset, so I did every step myself: collecting, cleaning, feature engineering, training, and then putting the model behind an API with a real interface. The part I wanted to get good at was the messy middle. Real data is never ready to use, and knowing how to clean it is what lets you build a model on *any* topic later.

## The data

I used the Craigslist used-car listings dataset from Kaggle (hundreds of thousands of US listings). It's real data, which also means it's full of problems:

- prices of $0, $1 or $999,999 that are clearly not real
- cars with 0 miles that are 15 years old, or 2 million miles
- the same car posted several times
- missing values almost everywhere
- free-text fields written in a hundred different ways

Most of my time went into cleaning this. I removed duplicates and impossible values, handled outliers, filled or dropped missing data depending on the column, and turned the raw columns into features a model can actually learn from (for example, the car's age instead of its year).

## The model

<!-- Replace with your real details -->
- **Features used:** year/age, manufacturer, model, odometer, condition, fuel, transmission, ...
- **Models I compared:** linear regression, random forest, gradient boosting, ...
- **Best model:** ...

| Metric | Result |
|---|---|
| MAE (average error, in $) | ... |
| R² | ... |

In plain words: on cars the model has never seen, its estimate is off by about **$...** on average.

## What I learned

- Cleaning took far more time than training, and it mattered more. Removing bad listings improved the results more than switching models did.
- A model is only useful if the app gives it data in exactly the same format it was trained on. Keeping the preprocessing and the model together was an important lesson.
- Kaggle data is a good starting point, but I don't fully trust it: it's a snapshot, and some listings are clearly fake. That's why the next step is collecting my own data.

## The app

A simple form: you enter the car's details and get an estimated price.

- **Backend:** Python API that loads the trained model and returns a prediction
- **Frontend:** React

### Run it locally

<!-- Adjust folder names to match the repo -->

**Backend**
```bash
cd api
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

**Frontend**
```bash
cd frontend
npm install
npm start
```

Then open the address shown in the terminal.

## What's next

- Build my own data pipeline that collects fresh listings automatically instead of relying on a static Kaggle file
- Show a price *range* instead of a single number, because a car's price is never exact
- Explain each prediction: which details pushed the price up or down

---

Made by **El Eza Ejiwen**. Feedback is welcome!
[LinkedIn](https://www.linkedin.com/in/el-eza-ejiwen-25a470361/) · [GitHub](https://github.com/azza123-bot)
