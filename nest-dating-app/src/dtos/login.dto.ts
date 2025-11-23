import { IsString, MinLength } from 'class-validator';

/**
 * TODO:
 * - Créer un DTO pour la connexion avec username et password
 * - Le username sert d'identifiant unique
 */
export class LoginDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}

