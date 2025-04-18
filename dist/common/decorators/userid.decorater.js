"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestedUser = void 0;
const common_1 = require("@nestjs/common");
exports.RequestedUser = (0, common_1.createParamDecorator)((_data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
//# sourceMappingURL=userid.decorater.js.map