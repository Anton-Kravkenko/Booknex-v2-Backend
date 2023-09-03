"use strict";
exports.__esModule = true;
exports.Auth = void 0;
var common_1 = require("@nestjs/common");
var passport_1 = require("@nestjs/passport");
var Auth = function () { return (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')); };
exports.Auth = Auth;
