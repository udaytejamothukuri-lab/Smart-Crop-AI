import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

async function startServer() {
  // Connect to database if URI is present (non-fatal if disconnected, allows graceful offline mode)
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`🌾 SmartCrop AI Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🌱 Crops Metadata: http://localhost:${PORT}/api/crops`);
  });

  // Graceful shutdown handling
  const shutdown = () => {
    console.log('\nShutting down server gracefully...');
    server.close(() => {
      console.log('Server process terminated.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer();
