const express = require('express');
const cors = require('cors');
const quoteRoutes = require('./routes/quoteRoutes');
const quotetypeRoutes = require('./routes/QuoteTypeRoutes');
const connectDB = require('./db/index');
const setupSwaggerDocs = require('./swagger');

const app = express();

connectDB();
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));


app.use('/api/quote', quoteRoutes);
app.use('/api/quote-type', quotetypeRoutes);
setupSwaggerDocs(app);
const PORT = process.env.PORT || 4002;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
