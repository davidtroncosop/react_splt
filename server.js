import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import receiptRouter from './routes/receipt.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api', receiptRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});