require('dotenv').config();
const  mongoose  = require('mongoose');
const app = require('./app');

const DB = process.env.DATABASE_URL.replace(
  '<DATABASE_PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log('DB connected successfully');
}).catch((err) => {
  console.log('DB connection failed', err);
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
