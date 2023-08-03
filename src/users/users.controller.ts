import { Body, Controller, Get, HttpCode, Param, Patch, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { returnAlbumObject } from "../album/utils/return-album.object";
import { returnArtistObject } from "../artist/utils/return-artist.object";
import { Auth } from "../auth/decorator/auth.decorator";
import { CurrentUser } from "../auth/decorator/user.decorator";
import { returnPlaylistObject } from "../playlist/utils/return-playlist.object";
import { varieties } from "../types/varieties";
import { returnSongObject } from "../utils/return-song.object";
import { UserUpdateDto } from "./dto/user.update.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }
  
  @HttpCode(200)
  @Auth()
  @Get("/get-profile")
  async getProfile(@CurrentUser("id") id: number) {
    return this.usersService.getById(id, {
      email: true,
      favoritePlayLists: {
        select: returnPlaylistObject
      },
      favoritesAlbum: {
        select: returnAlbumObject
      },
      favoritesArtist: {
        select: returnArtistObject
      },
      favoritesSong: {
        select: returnSongObject
      }
    });
  }
  
  @HttpCode(200)
  @Auth()
  @Patch("/toggle-favorite/:type/:id")
  async toggleFavorite(
    @CurrentUser("id") userId: number,
    @Param("type") type: varieties,
    @Param("id") id: number
  ) {
    return this.usersService.toggleFavorite(userId, id, type);
  }
  
  @HttpCode(200)
  @Auth()
  @UsePipes(new ValidationPipe())
  @Post("/update-user")
  async updateUser(@CurrentUser("id") id, @Body() dto: UserUpdateDto) {
    return this.usersService.updateUser(id, dto);
  }
}
