require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const { startWeeklyAutoScan } = require('./src/services/autoScanService');

// Connect to MongoDB
connectDB();

// Start weekly auto scan cron job
startWeeklyAutoScan();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`DIGIVERA backend running on port ${PORT}`);
});
