import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { hash } from "argon2";
import { varieties } from "../types/varieties";
import { PrismaService } from "../utils/prisma.service";
import { UserUpdateDto } from "./dto/user.update.dto";
import { returnUserObject } from "./utils/return-user.object";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {
  }
  
  async getById(id: number, selectObject: Prisma.UserSelect = {}) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        ...returnUserObject,
        ...selectObject
      }
    });
    if (!user) throw new BadRequestException("User not found");
    return user;
  }
  
  async updateUser(userId: number, dto: UserUpdateDto) {
    const isSameUser = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });
    
    if (!isSameUser) throw new BadRequestException("User not found");
    
    
    if (isSameUser && isSameUser.id !== userId)
      throw new BadRequestException("User with this email already exists");
    
    const user = await this.getById(userId, {
      password: false
    });
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: dto.email ? dto.email : user.email,
        password: dto.password ? await hash(dto.password) : user.password
      }
    });
    return this.getById(userId);
  }
  
  async toggleFavorite(userId: number, id: number, type: varieties) {
    const user = await this.getById(+userId, {
      favoritesSong: true,
      favoritesAlbum: true,
      favoritesArtist: true,
      favoritePlayLists: true
    });
    if (!user) return new BadRequestException("User not found");
    const favoriteType =
      type === "song"
        ? "favoritesSong"
        : type === "album"
          ? "favoritesAlbum"
          : type === "artist"
            ? "favoritesArtist"
            : "favoritePlayLists";
    const isFavorite = user[favoriteType].some(item => item.id === +id);
    await this.prisma.user.update({
      where: { id: +userId },
      data: {
        [favoriteType]: {
          [isFavorite ? "disconnect" : "connect"]: { id: +id }
        }
      }
    });
    return {
      type: type,
      id: id,
      isFavorite: `${!isFavorite}`
    };
  }
}
