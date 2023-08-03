"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RefreshDto = exports.AuthDto = void 0;
var class_validator_1 = require("class-validator");
var AuthDto = /** @class */ (function () {
    function AuthDto() {
    }
    __decorate([
        (0, class_validator_1.IsEmail)()
    ], AuthDto.prototype, "email");
    __decorate([
        (0, class_validator_1.MinLength)(8, {
            message: "Password is too short. Minimal length is 8"
        }),
        (0, class_validator_1.IsString)()
    ], AuthDto.prototype, "password");
    return AuthDto;
}());
exports.AuthDto = AuthDto;
var RefreshDto = /** @class */ (function () {
    function RefreshDto() {
    }
    __decorate([
        (0, class_validator_1.IsString)()
    ], RefreshDto.prototype, "refresh_token");
    return RefreshDto;
}());
exports.RefreshDto = RefreshDto;
