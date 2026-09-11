import { connectToDatabase } from './db/index.ts';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'dotenv/config';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import usersRouter from './routes/users.ts';
import categoriesRouter from './routes/categories.ts';
import productsRouter from './routes/products.ts';
import ordersRouter from './routes/orders.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerSpec = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../swagger.json'), 'utf-8')
);

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ?? 3000;

app.get('/', (_req, res) => {
  res.json({ message: 'eCommerce API is running' });
});

app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

await connectToDatabase();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});