import app from './app.js';
import sequelize from './src/config/database.js';

const PORT = process.env.PORT || 8000;


app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});