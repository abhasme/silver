"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
let AllExceptionsFilter = class AllExceptionsFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
        }
        let firstErrorMessage;
        if (exception.response && exception.response.type && exception.response.type === 'validation') {
            const firstErrorObject = this.getFirstErrorObject(exception.response.message);
            firstErrorMessage = firstErrorObject[Object.keys(firstErrorObject)[0]];
        }
        return response.status(status).json({
            isError: true,
            message: firstErrorMessage || exception.message || 'Internal server error.',
        });
    }
    getFirstErrorObject(error) {
        if (error.constraints) {
            return error.constraints;
        }
        else {
            return this.getFirstErrorObject(error.children[0]);
        }
    }
};
AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
exports.AllExceptionsFilter = AllExceptionsFilter;
//# sourceMappingURL=all-exceptions.filter.js.map