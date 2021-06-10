# TshirtStore-MernStack

> E  Commerce platform built with the MERN stack

## Features

- Full featured shopping cart
- User profile with orders
- Admin product management
- Admin user management
- Admin Order details page
- Checkout process (shipping, payment method, etc)
- Payment integration

## Usage

### ES Modules in Node

We us ECMAScript Modules in the backend in this project. Be sure to have at least Node v14.6+ or you will need to add the "--experimental-modules" flag.

Also, when importing a file (not a package), be sure to add .js at the end or you will get a "module not found" error

You can also install and setup Babel if you would like

### Env Variables

Create a .env file in then root and add the following

```
NODE_ENV = development
PORT = 5000
MONGO_URI = Your MongoDB Uri
JWT_SECRET = 'sample'
PAYPAL_CLIENT_ID = Your Paypal Client ID
```

### Install Dependencies (frontend & backend)

```
npm install
cd frontend
npm install
```

### Run

```
# Run frontend (:3000) & backend (:5000)
npm run dev

# Run backend only
npm run server
```

## Build

```
# Create frontend prod build
cd frontend
npm run build
```
