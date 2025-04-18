
// import { Logger } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import * as compression from 'compression';
// import helmet from 'helmet';
// import { AllExceptionsFilter } from './common/dispatchers/all-exceptions.filter';
// import { swagger } from './swagger';
// import { ValidationPipe } from './validations/validation.pipe';
// import * as bodyParser from 'body-parser';
// import { join } from 'path';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import * as cluster from 'cluster';
// import * as os from 'os';
// const clusterModule = cluster as any;
 
//   async function bootstrap() {
//     const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
//     const port = process.env.NODE_PORT || 5000;
//     if ((process.env.NODE_ENV === 'production')) {
//       app.useStaticAssets(join(__dirname, 'uploaded'), {
//         index: false,
//         prefix: '/uploaded',
//       });
//     } else {
//       app.useStaticAssets(join(__dirname, '..', 'uploaded'), {
//         index: false,
//         prefix: '/uploaded',
//       });
//     }
//     const logger = new Logger('bootstrap');
//     app.use(compression());
//     app.use(bodyParser.json({ limit: '50mb' }));
//     app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
//     app.setGlobalPrefix('api');
//     swagger(app);
//     app.use(helmet());
//     app.useGlobalFilters(new AllExceptionsFilter());
//     app.useGlobalPipes(new ValidationPipe());
    
//     await app.listen(port);
//     logger.log(`Application start on port ${port} `);
//   }
//   bootstrap();


import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/dispatchers/all-exceptions.filter';
import { swagger } from './swagger';
import { ValidationPipe } from './validations/validation.pipe';
import * as bodyParser from 'body-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cluster from 'cluster';
import * as os from 'os';
// import * as heapdump from 'heapdump';
const clusterModule = cluster as any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
  const port = process.env.NODE_PORT || 5000;
  const logger = new Logger('bootstrap');

  // Static asset configuration for production and development
  if (process.env.NODE_ENV === 'production') {
    app.useStaticAssets(join(__dirname, 'uploaded'), {
      index: false,
      prefix: '/uploaded',
    });
  } else {
    app.useStaticAssets(join(__dirname, '..', 'uploaded'), {
      index: false,
      prefix: '/uploaded',
    });
  }

  // Middleware setup
  app.use(compression());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  
  // Global configurations
  app.setGlobalPrefix('api');
  swagger(app);
  app.use(helmet());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());

  // Trigger heapdump on SIGUSR2 signal
  // process.on('SIGUSR2', () => {
  //   const filename = join(__dirname, '..', 'heapdump_' + Date.now() + '.heapsnapshot');
  //   heapdump.writeSnapshot(filename, (err) => {
  //     if (err) {
  //       logger.error('Heapdump failed:', err);
  //     } else {
  //       logger.log('Heapdump written to ' + filename);
  //     }
  //   });
  // });

  // If you want to use cluster for multi-core utilization (for production)
  // if (clusterModule.isPrimary) {
  //   const numCPUs = os.cpus().length;
  //   logger.log(`Master cluster setting up ${numCPUs} workers...`);
  //   // Fork workers
  //   for (let i = 0; i < numCPUs; i++) {
  //     clusterModule.fork();
  //   }

  //   clusterModule.on('exit', (worker: any, code: any, signal: any) => {
  //     logger.error(`Worker ${worker.process.pid} died`);
  //   });
  // } else {
    await app.listen(port);
    logger.log(`Application started on port ${port}`);
  // }
}
bootstrap();
