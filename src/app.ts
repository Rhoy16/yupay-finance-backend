import express from 'express';
import cors from 'cors';
import { createUserRouter } from './modules/identity/interfaces/user.routes.js';
import { createFinanceRouter } from './modules/finance/interfaces/finance.routes.js';
import { errorHandler } from './shared/middlewares/error-handler.js';
import { logger } from './config/logger.js';

const app = express();

// Middlewares globales
app.use(cors({
  origin: '*', // Habilitar CORS para permitir solicitudes del frontend interactivo
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Interceptar y loggear peticiones HTTP
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.url}`);
  next();
});

// Registrar Rutas de los Bounded Contexts
app.use('/api/auth', createUserRouter());
app.use('/api', createFinanceRouter());

// Health Check base
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Middleware de manejo de errores global (debe ir al final)
app.use(errorHandler);

export default app;
