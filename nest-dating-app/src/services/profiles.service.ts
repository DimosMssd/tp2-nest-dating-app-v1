import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateProfileDto } from '../dtos/create-profile.dto';
import { Profile } from '../common/interfaces';

/**
 * Service pour gérer les profils utilisateurs
 * - findAll() : liste tous les profils (avec indication si likés)
 * - findOne() : récupère un profil par ID
 * - create() : crée un nouveau profil
 * - like() : ajoute un like à un profil
 */
@Injectable()
export class ProfilesService {
  private readonly tableName = 'profiles';

  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Récupère tous les profils depuis Supabase
   * Trie par date de création (plus récents en premier)
   */
  private async getAllProfiles(): Promise<Profile[]> {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return (data as Profile[]) ?? [];
  }

  /**
   * Récupère les IDs des profils qu'un utilisateur a likés
   * Utilise la table 'likes' pour trouver tous les profils likés par userId
   * Retourne un Set pour une recherche rapide
   */
  private async getLikedProfileIds(userId: number): Promise<Set<number>> {
    const { data: likes } = await this.supabase.client
      .from('likes')
      .select('profile_id')
      .eq('user_id', userId);

    return new Set(likes?.map((like) => like.profile_id) || []);
  }

  /**
   * Ajoute le flag isLiked à chaque profil quand on connaît les likes de l'utilisateur
   */
  private mapProfilesWithLikedFlag(
    profiles: Profile[],
    likedProfileIds?: Set<number>,
  ): (Profile & { isLiked?: boolean })[] {
    if (!likedProfileIds) {
      return profiles;
    }

    return profiles.map((profile) => ({
      ...profile,
      isLiked: likedProfileIds.has(profile.id),
    }));
  }

  /**
   * Liste tous les profils avec indication si likés par l'utilisateur connecté
   * Si currentUserId est fourni, ajoute le champ isLiked à chaque profil
   */
  async findAll(
    currentUserId?: number,
  ): Promise<(Profile & { isLiked?: boolean })[]> {
    // TODO:
    // 1. Récupérer tous les profils via getAllProfiles()
    // 2. Si currentUserId est défini, appeler getLikedProfileIds()
    // 3. Ajouter un booléen isLiked à chaque profil concerné
    // 4. Retourner la liste finale
    throw new Error('TODO: implémenter ProfilesService.findAll');
  }

  /**
   * Récupère un profil par son ID
   * Si le profil n'existe pas, lève une NotFoundException
   */
  async findOne(id: number): Promise<Profile> {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    if (!data) {
      throw new NotFoundException(`Profil ${id} introuvable`);
    }

    return data as Profile;
  }

  /**
   * Crée un nouveau profil dans Supabase
   * Insère les données du DTO et retourne le profil créé
   */
  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .insert(createProfileDto)
      .select('*')
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as Profile;
  }

  /**
   * Vérifie si un utilisateur a déjà liké un profil
   * Cherche dans la table 'likes' si la combinaison user_id + profile_id existe
   */
  private async hasAlreadyLiked(
    userId: number,
    profileId: number,
  ): Promise<boolean> {
    const { data: existingLike } = await this.supabase.client
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq('profile_id', profileId)
      .maybeSingle();

    return !!existingLike;
  }

  /**
   * Ajoute un like dans la table de liaison 'likes'
   * Enregistre qui a liké quel profil
   */
  private async addLike(userId: number, profileId: number): Promise<void> {
    const { error } = await this.supabase.client.from('likes').insert({
      user_id: userId,
      profile_id: profileId,
    });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Incrémente le compteur de likes d'un profil
   * Récupère d'abord le profil pour connaître le nombre actuel de likes
   * Puis met à jour avec likes + 1
   */
  private async incrementLikes(profileId: number): Promise<Profile> {
    const profile = await this.findOne(profileId);

    const { data, error } = await this.supabase.client
      .from(this.tableName)
      .update({ likes: profile.likes + 1 })
      .eq('id', profileId)
      .select('*')
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data as Profile;
  }

  /**
   * Liker un profil
   * 1. Vérifie qu'on ne like pas son propre profil
   * 2. Vérifie qu'on n'a pas déjà liké ce profil
   * 3. Ajoute le like dans la table 'likes'
   * 4. Incrémente le compteur de likes du profil
   * 5. Retourne le profil mis à jour
   */
  async like(profileId: number, currentUserId: number): Promise<Profile> {
    // TODO:
    // 1. Empêcher un utilisateur de liker son propre profil
    // 2. Vérifier s'il a déjà liké (hasAlreadyLiked)
    // 3. Ajouter le like (addLike) puis incrémenter le compteur (incrementLikes)
    // 4. Retourner le profil mis à jour
    throw new Error('TODO: implémenter ProfilesService.like');
  }
}

