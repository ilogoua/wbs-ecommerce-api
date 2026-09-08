import { connectToDatabase } from './db/index.ts';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ?? 3000;

app.get('/', (_req, res) => {
  res.json({ message: 'eCommerce API is running' });
});

await connectToDatabase();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});