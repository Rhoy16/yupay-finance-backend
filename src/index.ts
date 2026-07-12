import app from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Servidor de Yupay Finance iniciado con éxito en el puerto ${env.PORT}`);
  logger.info(`Entorno activo: ${env.NODE_ENV}`);
});

// Manejo de apagado gracioso (Graceful Shutdown)
process.on('SIGTERM', () => {
  logger.warn('Recibida señal SIGTERM. Apagando servidor de forma controlada...');
  server.close(() => {
    logger.info('Servidor HTTP cerrado correctamente.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.warn('Recibida señal SIGINT (Ctrl+C). Apagando servidor...');
  server.close(() => {
    logger.info('Servidor HTTP cerrado correctamente.');
    process.exit(0);
  });
});
