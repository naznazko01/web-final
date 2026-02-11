require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");


connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      // Server started successfully
    });
  })
  .catch(err => {
    process.exit(1);
  });
