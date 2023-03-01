# my-forecaster

final project TK &amp;&amp; AllWomen Bootcamp

## Main functionalities

- :hourglass_flowing_sand: Display information about MyForecaster (how it works? what can it do for you?) & Display some graphs from Unsplash API.
- :hourglass_flowing_sand: Display a Login && Registration Pop-up on the Home screen.
- :hourglass_flowing_sand: Registration/Login flow (with email - password verification)
- :hourglass_flowing_sand: Display a dropdown with products and forecast horizon options for user to choose from. Visualize the data with the options selected.
- :hourglass_flowing_sand: Users can add/remove graphs from their personal Dashboard

## Installation

Execute `npm install` from inside your app directory to download the dependencies.
Make sure to add the .env file on your local machine one the code is cloned from this repo.

## Running the project

Frontend: `npm start`
</br>
Backend: `python -m uvicorn main:app --reload`

## API

| Method | Endpoint            | Functionality                                               | Private access?        |
| ------ | ------------------- | ----------------------------------------------------------- | ---------------------- |
| POST   | /auth/register      | Register a user. Email and password are need it (AutoLogin) | :unlock:               |
| POST   | /auth/login         | Login with email & password                                 | :unlock:               |
| GET    | /auth/logout        |                                                             | :unlock:               |
| GET    | /                   | Display Forecasting Engine info & images                    | :unlock:               |
| GET    | /start              | Select product and the forecast horizon to predict          | :closed_lock_with_key: |
| GET    | /user/dashboard     | Display all my Graphs                                       | :closed_lock_with_key: |
| GET    | /:id                | Get graph by id                                             | :closed_lock_with_key: |
| POST   | /user/dashboard     | Add graph to my Dashboard                                   | :closed_lock_with_key: |
| DELETE | /user/dashboard/:id | Delete a graph from my Dashboard                            | :closed_lock_with_key: |
