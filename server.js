import app from './app.js';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

await connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});