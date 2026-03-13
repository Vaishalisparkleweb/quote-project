const express = require('express');
const cors = require('cors');
const categoryRoutes = require('./routes/categoryRoutes');
const subCategoryRoutes = require('./routes/SubCategoryRoutes');
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


app.use('/api/category', categoryRoutes);
app.use('/api/sub-category', subCategoryRoutes);
setupSwaggerDocs(app);
const PORT = process.env.PORT || 4001;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
