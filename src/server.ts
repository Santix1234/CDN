import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Create and configure the Express application
 * @returns {Express} Configured Express application
 */
export function createApp(): Express {
  const app = express();

  // Basic middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Global error handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
      status: 'error',
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : err.message
    });
  });

  return app;
}

/**
 * Start the server
 * @param {number} [port] Optional port number, defaults to 3000
 */
export function startServer(port?: number): void {
  const app = createApp();
  const serverPort = port || parseInt(process.env.PORT || '3000', 10);

  const server = app.listen(serverPort, () => {
    console.log(`Server running on port ${serverPort}`);
  });

  return server;
}

// Only start server if this file is run directly (not imported)
if (require.main === module) {
  startServer();
}