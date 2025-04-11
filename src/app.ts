import express, { Application, Request, Response, NextFunction, Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import verifyRoutes from './routes/verify.routes';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './configs/swagger';
import { errorHandler } from './middlewares/error.middleware';
import { requestLogger } from './middlewares/logging.middleware';
import { NotFoundError } from './utils/error.class';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.route';
// import connectDB from './server';
// import dotenv from 'dotenv';



dotenv.config();
const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation route
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Truth Checker API Docs',
  }));

// Routes
 app.use('/api/users', userRoutes);
 app.use('/api/auth', authRoutes);
app.use('/api/verify', verifyRoutes);

 
// Handle undefined routes
app.all('', (req: Request, res: Response, next: NextFunction) => {
    next(new NotFoundError(`Cannot find ${req.originalUrl} on this server`));
  });
  

// Request logger
app.use(requestLogger);

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export default app;

// connectDB();
// app.listen(PORT, () => {
// console.log(`server is running on HTTPS://localhost:${PORT}`);
// });