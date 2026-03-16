const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const syncRoutes = require('./routes/sync');
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
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sync', syncRoutes);
setupSwaggerDocs(app)
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
