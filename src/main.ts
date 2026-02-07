import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });
  // Usar body-parser manualmente para aumentar el límite
  let bodyParser;
  try {
    bodyParser = require('body-parser');
  } catch (error) {
    console.error('Error loading body-parser:', error);
    throw error;
  }

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.enableCors();
  const port = Number(process.env.PORT) || 3001; // use env or default to 3001
  await app.listen(port, '0.0.0.0');
}
bootstrap();