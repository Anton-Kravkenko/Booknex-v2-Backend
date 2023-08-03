"use strict";
var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var jwt_1 = require("@nestjs/jwt");
var jwt_config_1 = require("../config/jwt.config");
var prisma_service_1 = require("../utils/prisma.service");
var users_service_1 = require("../users/users.service");
var auth_controller_1 = require("./auth.controller");
var auth_service_1 = require("./auth.service");
var jwt_stategy_1 = require("./strategy/jwt.stategy");
var AuthModule = /** @class */ (function() {
  function AuthModule() {
  }
  
  AuthModule = __decorate([
    (0, common_1.Module)({
      controllers: [auth_controller_1.AuthController],
      providers: [auth_service_1.AuthService, prisma_service_1.PrismaService, jwt_stategy_1.JwtStrategy, users_service_1.UsersService],
      imports: [
        config_1.ConfigModule,
        jwt_1.JwtModule.registerAsync({
          imports: [config_1.ConfigModule],
          inject: [config_1.ConfigService],
          useFactory: jwt_config_1.getJwtConfig
        })
      ]
    })
  ], AuthModule);
  return AuthModule;
}());
exports.AuthModule = AuthModule;
