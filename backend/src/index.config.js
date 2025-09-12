import app from './middlewares/index.middleware.js';
import FormRoutes from './routes/form.routes.js';
import UserRoutes from './routes/user.routes.js'
import dotenv from 'dotenv'

dotenv.config();
const PORT = process.env.PORT || 3000;

app.use('/api/v1/admin',FormRoutes);
app.use('/api/v1/admin',UserRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});