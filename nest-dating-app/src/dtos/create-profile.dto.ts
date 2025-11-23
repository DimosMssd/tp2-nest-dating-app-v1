import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

/**
 * TODO:
 * - Ajouter un champ username unique pour identifier l'utilisateur
 * - Ajouter un champ password pour l'authentification
 * - Valider que le username est unique (vérification dans le service)
 * - Un utilisateur ne peut créer qu'un seul profil
 */
export class CreateProfileDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsInt()
  @Type(() => Number)
  @Min(18)
  @Max(99)
  age: number;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];
}

