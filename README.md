# my-forecaster

final project TK &amp;&amp; AllWomen Bootcamp

## Main functionalities

- :white_check_mark: Display information about MyForecaster (how it works? what can it do for you?) & Fetch & render decorative images from Unsplash API.
- :white_check_mark: Display a dropdown with products and forecast horizon options for user to choose from. Visualize the data with the options selected.
- :white_check_mark: Users can add/remove graphs from their personal Dashboard
- :white_check_mark: Users can upload their own data (in a csv format) get an analysis of the last and forecast variables of that data
- :hourglass_flowing_sand: Display a Login && Registration Pop-up on the Home screen.
- :hourglass_flowing_sand: Registration/Login flow (with email - password verification)

## Installation

Frontend:
Execute `npm install` from inside your app directory to download the dependencies.
Make sure to add the .env file on your local machine one the code is cloned from this repo.
</br>
Backend: `pip install -r requirements.txt`
</br>
Please also add `ssl_ca_certs=certifi.where()` into the MongoClient before running the backend.

## Running the project

Frontend: `npm start`
</br>
Backend: `python -m uvicorn main:app --reload`

## Testing MFE with external data

If you want to test the MFE with an external data (not the one preloaded to the MongoDB), you can use the csv file from the `test-data` folder.
</br>
Once you have selected the `food_sales.csv` in the `Explore & Forecast` screen, you will have to specify the following details in the pop-up form:

- The target variable name: "quantity"
- The date/timestamp variable name: "saleDate"
- The data frequency: "daily"
- The name for your file: _you can choose any name you want_

## API

| Method | Endpoint                               | Functionality                                                  | Private access?        |
| ------ | -------------------------------------- | -------------------------------------------------------------- | ---------------------- |
| GET    | /explore/collection/id                 | Get the product names from the Database                        | :unlock:               |
| GET    | /forecasts                             | Display all saved Graphs                                       | :closed_lock_with_key: |
| GET    | /prediction/product/time/collection/id | Get uploaded by the user data by id and run the forecast on it | :closed_lock_with_key: |
| POST   | /prediction/save                       | Save a new forecast to the Database                            | :closed_lock_with_key: |
| POST   | /message/                              | Save a new user message to the Database                        | :unlock:               |
| POST   | /uploadfile                            | Saves data uploaded by the user to the Database                | :closed_lock_with_key: |
| PUT    | /prediction/id                         | Update the name/info of the saved forecast                     | :unlock:               |
| DELETE | /dashboard/delete                      | Delete a graph from my Dashboard                               | :closed_lock_with_key: |
