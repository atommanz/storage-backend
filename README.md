# storage-backend

# Getting started 
To get the Node server running locally:

- Clone this repo
- npm install to install all required dependencies
- npm start to start the local server port 3001

# Code Overview

## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [moment](https://github.com/moment/moment/) - JavaScript date library for parsing, validating, manipulating, and formatting dates
- [firebase](https://github.com/firebase/firebase-js-sdk) - For stroage data of product to database (clound firestore)

## Application Structure

- `app.js` - The entry point to application. This file defines express server and Creates and initializes a Firebase. It also requires the routes that we'll be using in the application.
- `routes/` - This folder contains the route definitions for API and services.
- `routes/product` - This folder is route to create new product to storage, get list product in storage, get product detail in storage, checkout product in storage, get price product is active in storage, get bussiness profits all product is checkout from storage

## Functional

- Able to import product (Box) => Yes, box unit is cm^3
- Able to export product (Box) => Yes, box unit is cm^3
- Able to calculate price => Yes
- Able to see detail all products in storage => Yes 
- Able to see the business profits => Yes 