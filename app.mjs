import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './Routes/donorRoute.mjs';
import connectDB from './Config/db.mjs';
import methodOverride from 'method-override';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'));

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));

// Middleware to override HTTP methods
app.use(methodOverride('_method'));

// Route for donors
app.use('/', router);

connectDB();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
