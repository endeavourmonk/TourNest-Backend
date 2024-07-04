const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const app = require('./app');

app.use(cors());

const DB = process.env.DB.replace('<password>', process.env.DB_PASSWORD);

async function connectDB() {
  try {
    await mongoose.connect(DB);
    console.log('✔ connected to database ⛁');
  } catch (err) {
    console.log('❌ failed connection', +err);
  }
}

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`💻 App running on PORT: ${PORT} 🏃`);
});
