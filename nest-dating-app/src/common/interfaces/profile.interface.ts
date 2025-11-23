/**
 * Interface pour représenter un profil utilisateur
 */
export interface Profile {
  id: number;
  username: string;
  name: string;
  age: number;
  bio?: string | null;
  interests?: string[] | null;
  likes: number;
  created_at: string;
}

