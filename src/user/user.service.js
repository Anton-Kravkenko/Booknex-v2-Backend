"use strict";
var __assign = (this && this.__assign) || function() {
  __assign = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
        t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = (this && this.__generator) || function(thisArg, body) {
  var _ = {
    label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: []
  }, f, y, t, g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  
  function verb(n) {
    return function(v) {
      return step([n, v]);
    };
  }
  
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return { value: op[1], done: false };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
};
exports.__esModule = true;
exports.UsersService = void 0;
var common_1 = require("@nestjs/common");
var argon2_1 = require("argon2");
var return_user_object_1 = require("./utils/return-user.object");
var UserService = /** @class */ (function() {
  function UsersService(prisma) {
    this.prisma = prisma;
  }
  
  UsersService.prototype.getById = function(id, selectObject) {
    if (selectObject === void 0) {
      selectObject = {};
    }
    return __awaiter(this, void 0, void 0, function() {
      var user;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.prisma.user.findUnique({
              where: { id: id },
              select: __assign(__assign({}, return_user_object_1.returnUserObject), selectObject)
            })];
          case 1:
            user = _a.sent();
            if (!user)
              throw new common_1.BadRequestException("User not found");
            return [2 /*return*/, user];
        }
      });
    });
  };
  UsersService.prototype.updateUser = function(userId, dto) {
    return __awaiter(this, void 0, void 0, function() {
      var isSameUser, user, _a, _b, _c;
      var _d, _e;
      return __generator(this, function(_f) {
        switch (_f.label) {
          case 0:
            return [4 /*yield*/, this.prisma.user.findUnique({
              where: { email: dto.email }
            })];
          case 1:
            isSameUser = _f.sent();
            if (!isSameUser)
              throw new common_1.BadRequestException("User not found");
            if (isSameUser && isSameUser.id !== userId)
              throw new common_1.BadRequestException("User with this email already exists");
            return [4 /*yield*/, this.getById(userId, {
              password: false
            })];
          case 2:
            user = _f.sent();
            _b = (_a = this.prisma.user).update;
            _d = {
              where: { id: userId }
            };
            _e = {
              email: dto.email ? dto.email : user.email
            };
            if (!dto.password) return [3 /*break*/, 4];
            return [4 /*yield*/, (0, argon2_1.hash)(dto.password)];
          case 3:
            _c = _f.sent();
            return [3 /*break*/, 5];
          case 4:
            _c = user.password;
            _f.label = 5;
          case 5:
            return [4 /*yield*/, _b.apply(_a, [(_d.data = (_e.password = _c,
              _e.name = dto.name ? dto.name : user.name,
              _e),
              _d)])];
          case 6:
            _f.sent();
            return [2 /*return*/, this.getById(userId)];
        }
      });
    });
  };
  UsersService.prototype.toggleFavorite = function(userId, id, type) {
    return __awaiter(this, void 0, void 0, function() {
      var user, favoriteType, isFavorite;
      var _a, _b;
      return __generator(this, function(_c) {
        switch (_c.label) {
          case 0:
            return [4 /*yield*/, this.getById(+userId)];
          case 1:
            user = _c.sent();
            if (!user)
              return [2 /*return*/, new common_1.BadRequestException("User not found")];
            favoriteType = type === "song"
              ? "favoritesSong"
              : type === "album"
                ? "favoritesAlbum"
                : type === "artist"
                  ? "favoritesArtist"
                  : "favoritesPlaylist";
            isFavorite = user[favoriteType].some(function(item) {
              return item.id === +id;
            });
            return [4 /*yield*/, this.prisma.user.update({
              where: { id: +userId },
              data: (_a = {},
                _a[favoriteType] = (_b = {},
                  _b[isFavorite ? "disconnect" : "connect"] = { id: +id },
                  _b),
                _a)
            })];
          case 2:
            _c.sent();
            return [2 /*return*/, this.getById(+userId)];
        }
      });
    });
  };
  UsersService = __decorate([
    (0, common_1.Injectable)()
  ], UsersService);
  return UsersService;
}());
exports.UsersService = UserService;
