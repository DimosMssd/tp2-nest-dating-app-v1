import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateProfileDto } from '../dtos/create-profile.dto';
import { LoginDto } from '../dtos/login.dto';
import { Session } from '../common/interfaces';

/**
 * Service d'authentification basé sur les profils
 * - register() : créer un profil (vérifie l'unicité du username)
 * - login() : authentifier un utilisateur (vérifie username + password)
 */
@Injectable()
export class AuthService {
  private readonly tableName = 'profiles';

  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Vérifie si un username existe déjà dans la base de données
   * Utilise Supabase pour chercher un profil avec ce username
   */
  private async checkUsernameExists(username: string): Promise<boolean> {
    const { data: existingProfile } = await this.supabase.client
      .from(this.tableName)
      .select('id')
      .eq('username', username)
      .maybeSingle();

    return !!existingProfile;
  }

  /**
   * Crée un nouveau profil dans Supabase
   * Insère les données et retourne les infos essentielles (id, username, name)
   */
  private async createProfile(
    createProfileDto: CreateProfileDto,
  ): Promise<{ id: number; username: string; name: string }> {
    const { data: newProfile, error } = await this.supabase.client
      .from(this.tableName)
      .insert(createProfileDto)
      .select('id, username, name')
      .single();

    if (error) {
      throw new ConflictException(error.message);
    }

    return newProfile;
  }

  /**
   * Inscription : crée un nouveau profil utilisateur
   * 1. Vérifie que le username n'existe pas déjà
   * 2. Si existe, lève une exception
   * 3. Crée le profil
   * 4. Retourne une session avec les infos du profil
   */
  async register(createProfileDto: CreateProfileDto): Promise<Session> {
    // TODO:
    // 1. Vérifier si le username existe déjà (checkUsernameExists)
    // 2. Lever une ConflictException si nécessaire
    // 3. Créer le profil (createProfile)
    // 4. Retourner un objet Session contenant id + username + name
    throw new Error('TODO: implémenter AuthService.register');
  }

  /**
   * Trouve un profil par son username
   * Récupère les infos nécessaires pour l'authentification (y compris le password)
   */
  private async findProfileByUsername(username: string): Promise<{
    id: number;
    username: string;
    name: string;
    password: string;
  }> {
    const { data: profile, error } = await this.supabase.client
      .from(this.tableName)
      .select('id, username, name, password')
      .eq('username', username)
      .maybeSingle();

    if (error || !profile) {
      throw new NotFoundException(
        `Aucun profil trouvé avec le username "${username}"`,
      );
    }

    return profile;
  }

  /**
   * Vérifie que le mot de passe saisi correspond au mot de passe stocké
   * Si différent, lève une exception UnauthorizedException
   */
  private verifyPassword(profilePassword: string, loginPassword: string): void {
    if (profilePassword !== loginPassword) {
      throw new UnauthorizedException('Mot de passe incorrect');
    }
  }

  /**
   * Connexion : authentifie un utilisateur
   * 1. Trouve le profil par username
   * 2. Vérifie que le mot de passe correspond
   * 3. Retourne une session (sans le password pour la sécurité)
   */
  async login(loginDto: LoginDto): Promise<Session> {
    // TODO:
    // 1. Récupérer le profil via findProfileByUsername(loginDto.username)
    // 2. Vérifier le mot de passe avec verifyPassword
    // 3. Retourner la session (id + username + name)
    throw new Error('TODO: implémenter AuthService.login');
  }
}

