import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateProfileDto } from '../dtos/create-profile.dto';
import { LoginDto } from '../dtos/login.dto';

/**
 * TODO:
 * - Créer les endpoints POST /auth/register et POST /auth/login
 * - register() : créer un profil (authentification)
 * - login() : se connecter avec son email
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  async register(@Body() createProfileDto: CreateProfileDto) {
    // TODO: appeler authService.register() avec le DTO validé
    // 1. Deleguer au service pour créer le profil et retourner la session
    // 2. Propager la réponse JSON vers le frontend
    throw new Error('TODO: implémenter POST /auth/register');
  }

  @Post('login')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  async login(@Body() loginDto: LoginDto) {
    // TODO: appeler authService.login() avec les identifiants fournis
    // 1. Utiliser le service pour vérifier username + password
    // 2. Retourner la session en cas de succès (ou laisser propager les erreurs)
    throw new Error('TODO: implémenter POST /auth/login');
  }
}

