"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const compression = require("compression");
const helmet_1 = require("helmet");
const all_exceptions_filter_1 = require("./common/dispatchers/all-exceptions.filter");
const swagger_1 = require("./swagger");
const validation_pipe_1 = require("./validations/validation.pipe");
const bodyParser = require("body-parser");
const path_1 = require("path");
const cluster = require("cluster");
const clusterModule = cluster;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    const port = process.env.NODE_PORT || 5000;
    const logger = new common_1.Logger('bootstrap');
    if (process.env.NODE_ENV === 'production') {
        app.useStaticAssets((0, path_1.join)(__dirname, 'uploaded'), {
            index: false,
            prefix: '/uploaded',
        });
    }
    else {
        app.useStaticAssets((0, path_1.join)(__dirname, '..', 'uploaded'), {
            index: false,
            prefix: '/uploaded',
        });
    }
    app.use(compression());
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.setGlobalPrefix('api');
    (0, swagger_1.swagger)(app);
    app.use((0, helmet_1.default)());
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    app.useGlobalPipes(new validation_pipe_1.ValidationPipe());
    await app.listen(port);
    logger.log(`Application started on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map