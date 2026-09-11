# WBS eCommerce API

Backend project for the WBS Coding School Wochenprojekt.

Built with:

- Node.js
- TypeScript
- Express
- MongoDB
- Mongoose
- Zod
- Swagger

## Features

The API provides CRUD operations for:

- Users
- Categories
- Products
- Orders

Additional features:

- MongoDB Atlas connection
- Zod request validation
- Product to Category relation
- Order to User and Products relations
- Server-side order total calculation
- Duplicate email handling
- Invalid ObjectId handling
- Centralized error handling
- Fallback 404 handler
- Swagger API documentation

## API Routes

### Users

- GET `/users`
- POST `/users`
- GET `/users/:id`
- PUT `/users/:id`
- DELETE `/users/:id`

### Categories

- GET `/categories`
- POST `/categories`
- GET `/categories/:id`
- PUT `/categories/:id`
- DELETE `/categories/:id`

### Products

- GET `/products`
- POST `/products`
- GET `/products/:id`
- PUT `/products/:id`
- DELETE `/products/:id`

Products can also be filtered by category:

`GET /products?categoryId=<id>`

### Orders

- GET `/orders`
- POST `/orders`
- GET `/orders/:id`
- PUT `/orders/:id`
- DELETE `/orders/:id`

Order totals are calculated on the server using the current product prices.

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Server:

```text
http://localhost:3000
```

Swagger UI:

```text
http://localhost:3000/api-docs
```

## Build

```bash
npm run build
```