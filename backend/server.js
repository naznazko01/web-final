require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const requiredEnv = ["MONGO_URI", "TMDB_API_KEY", "JWT_SECRET"];
requiredEnv.forEach(name => {
  if (!process.env[name]) {
    console.error(`❌ Missing required environment variable: ${name}`);
  }
});
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🏠 Website: http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });
