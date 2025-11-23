import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProfilesService } from '../services/profiles.service';
import { CreateProfileDto } from '../dtos/create-profile.dto';

/**
 * TODO:
 * - Ajouter un header "X-User-Id" pour identifier l'utilisateur connecté
 * - Dans un vrai projet, utiliser des Guards et des JWT
 * - Pour ce TP, on passe simplement l'ID via header
 */
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  findAll(@Headers('x-user-id') userIdHeader?: string) {
    const currentUserId =
      userIdHeader && !Number.isNaN(Number(userIdHeader))
        ? Number(userIdHeader)
        : undefined;

    return this.profilesService.findAll(currentUserId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    // TODO:
    // 1. Utiliser ParseIntPipe (déjà appliqué) pour récupérer un nombre
    // 2. Appeler profilesService.findOne(id) et retourner le profil
    throw new Error('TODO: implémenter GET /profiles/:id');
  }

  @Post()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  create(@Body() createProfileDto: CreateProfileDto) {
    // TODO:
    // 1. Valider le DTO (ValidationPipe déjà appliqué)
    // 2. Appeler profilesService.create(dto) pour créer un profil
    // 3. Retourner le profil créé
    throw new Error('TODO: implémenter POST /profiles (optionnel)');
  }

  @Post(':id/like')
  like(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-user-id') userIdHeader: string,
  ) {
    // TODO:
    // 1. Vérifier la présence du header "X-User-Id" (sinon UnauthorizedException)
    // 2. Convertir sa valeur en nombre (identifier l'utilisateur courant)
    // 3. Appeler profilesService.like(profileId, currentUserId) et retourner le profil mis à jour
    throw new Error('TODO: implémenter POST /profiles/:id/like');
  }
}

