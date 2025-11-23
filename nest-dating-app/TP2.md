# TP2 – NestJS Dating App

> ⏱️ **Durée cible** : 45 à 60 minutes  
> 🎯 **Objectif** : implémenter les endpoints REST d’une mini application de rencontre étudiante en NestJS.  
> 🧱 **Backend fourni** : structure NestJS + intégration Supabase + frontend HTML/CSS/JS déjà prêts.

---

## 0. Pré-requis

1. **Installation**
   ```bash
   npm install
   ```
2. **Supabase déjà configuré**
   - Les tables `profiles` et `likes` sont fournies.
   - Les requêtes SQL ont déjà été exécutées (pas besoin de les refaire).
3. **Frontend inclus**
   - Disponible sur `http://localhost:3000`
   - Gère inscription, connexion, affichage des profils et boutons “Like”.
4. **Helpers déjà fournis**
   - Ce sont des méthodes privées dans les services NestJS
   - Elles encapsulent les appels Supabase et la logique technique
   - Votre mission : orchestrer ces helpers via les méthodes publiques (controllers/services)

---

## 1. Comprendre le squelette (5 min)

```
src/
├── controllers/       # Contrôleurs à compléter
├── services/          # Logique métier (helpers Supabase déjà codés)
├── dtos/              # DTO + validation
├── modules/           # Assemblage NestJS
├── supabase/          # Client Supabase préconfiguré
└── main.ts            # Bootstrap NestJS
```

### Tout est prêt sauf…
- Les méthodes des **controllers** et des **services** publics ont été vidées et annotées `TODO`.
- Les **helpers Supabase** (méthodes privées dans les services) sont déjà implémentés : vous les utilisez, vous ne les réécrivez pas.
- Les DTO (`create-profile.dto.ts`, `login.dto.ts`) contiennent déjà les règles de validation.

---

## 2. Étapes du TP

Chaque étape valide une fonctionnalité complète avant de passer à la suivante.  

### Étape 1 – Endpoint `GET /profiles`

**Objectif métier**  
Afficher la liste des profils pour que chaque étudiant voit instantanément les personnes disponibles.  
Si l’utilisateur est connecté, chaque profil doit indiquer s’il a déjà été liké (`isLiked: true/false`). Simplement car un utilisateur ne peut liker qu'une seule fois un profil.

**Méthodes à implémenter**
- Service :  
  ```ts
  // src/services/profiles.service.ts
  async findAll(currentUserId?: number): Promise<(Profile & { isLiked?: boolean })[]> { ... }
  ```

**Aides**
Dans le service, enchaîner :

   - `getAllProfiles()` pour récupérer tous les profils.
   - Si `currentUserId` existe, appeler `getLikedProfileIds(currentUserId)` pour connaître les likes.
   - Utiliser le helper `mapProfilesWithLikedFlag(profiles, likedProfileIds)` pour ajouter `isLiked`.  
   
PS : n'oubliez pas d'utiliser `await` car toutes ces méthodes retournent des Promises Supabase.

**Résultat attendu**  
Après avoir implémenté la méthode, lancez `npm run start:dev` et ouvrez `http://localhost:3000`.  
Vous devriez voir dans la section "Profils disponibles" quelques profils de base qui ont été créés au préalable dans Supabase. Chaque profil affiche son nom, âge, bio, intérêts et le nombre de likes. Si vous n'êtes pas connecté, les profils s'affichent normalement. Si vous êtes connecté (après l'étape 2), les profils que vous avez déjà likés auront le bouton "Like" grisé avec le texte "Déjà liké ✓".

---

### Étape 2 – Authentification (inscription + connexion)

**Objectif métier**  
Permettre à chaque étudiant de créer son profil puis de se connecter grâce à un username/password (pas d’email).

**Méthodes à implémenter**
- Controllers :  
  ```ts
  // src/controllers/auth.controller.ts
  @Post('register') register(@Body() createProfileDto: CreateProfileDto) { ... }
  @Post('login') login(@Body() loginDto: LoginDto) { ... }
  ```
- Services :  
  ```ts
  // src/services/auth.service.ts
  async register(createProfileDto: CreateProfileDto): Promise<Session> { ... }
  async login(loginDto: LoginDto): Promise<Session> { ... }
  ```

**Aides**
1. Controller : déléguer au service.
2. Service `register` :
   - `checkUsernameExists(username)` → si true, lever `ConflictException`.
   - `createProfile(dto)` → récupère `id/username/name`.
   - Retourner l’objet `Session` de la forme `{ profileId, username, name }`.
3. Service `login` :
   - `findProfileByUsername(username)` → récupère aussi le `password`.
   - `verifyPassword(profile.password, loginDto.password)` → lève `UnauthorizedException` si différent.
   - Retourner la session sans le password.

**Résultat attendu**  
Après avoir implémenté les méthodes, testez sur `http://localhost:3000` :

- **Inscription** : Remplissez le formulaire "Créer un compte" avec un username unique, un mot de passe, votre nom, âge, etc. Après validation, vous devriez voir un message vert de succès "✅ Profil créé avec succès !" et être automatiquement connecté. La section "Inscription/Connexion" disparaît et est remplacée par "Connecté en tant que : [votre username]".

- **Connexion** : Si vous vous déconnectez (bouton "Déconnexion"), vous pouvez vous reconnecter via l'onglet "Connexion" avec votre username et mot de passe. Un message vert "✅ Connexion réussie !" confirme le succès. Si le mot de passe est incorrect, un message d'erreur rouge s'affiche.

---

### Étape 3 – Endpoint `POST /profiles/:id/like`

**Objectif métier**  
Permettre à un étudiant de “liker” les autres (effet social) tout en empêchant les doublons et l’auto-like.

**Méthodes à implémenter**
- Controller :  
  ```ts
  // src/controllers/profiles.controller.ts
  @Post(':id/like')
  like(@Param('id', ParseIntPipe) id: number, @Headers('x-user-id') userIdHeader: string) { ... }
  ```
- Service :  
  ```ts
  // src/services/profiles.service.ts
  async like(profileId: number, currentUserId: number): Promise<Profile> { ... }
  ```

**Aides**
1. Controller :
   - Vérifier que `userIdHeader` est présent → sinon `UnauthorizedException`.
   - Convertir le header en nombre avec `parseInt(userIdHeader, 10)` et vérifier avec `isNaN()` → si invalide, lever `UnauthorizedException`.
   - Appeler `profilesService.like(id, currentUserId)`.
2. Service :
   - Si `profileId === currentUserId`, lever une erreur (pas de like sur soi).
   - Vérifier les doublons via `hasAlreadyLiked(user, profile)`.
   - Enchaîner `addLike()` puis `incrementLikes(profileId)` pour retourner le profil mis à jour.  

PS : n'oubliez pas d'utiliser `await` car toutes ces méthodes retournent des Promises Supabase.

**Résultat attendu**  
Après avoir implémenté la méthode, testez sur `http://localhost:3000` :

1. **Connectez-vous** (si ce n'est pas déjà fait) pour activer les boutons "Like".
2. **Cliquez sur le bouton "Like"** d'un profil que vous n'avez pas encore liké.
3. Vous devriez voir :
   - Une notification verte "Vous avez liké [nom du profil] !"
   - Le compteur de likes du profil s'incrémenter (ex: "❤️ 0" devient "❤️ 1")
   - Le bouton "Like" devenir gris avec le texte "Déjà liké ✓" et être désactivé
4. **Essayez de liker à nouveau le même profil** : vous devriez voir un message d'erreur indiquant que vous avez déjà liké ce profil.
5. **Essayez de liker votre propre profil** (si vous voyez votre profil dans la liste) : vous devriez voir un message d'erreur indiquant que vous ne pouvez pas liker votre propre profil.

---

### Étape 4 – Vérification finale sur le frontend

1. `npm run start:dev`
2. Ouvrir `http://localhost:3000`
3. Vérifier :
   - Inscription + connexion fonctionnent (message vert)
   - Les profils s’affichent (avec interests, bio, likes…)
   - Le bouton “Like” s’active uniquement quand on est connecté
   - Après un like réussi, le compteur se met à jour et le bouton devient “Déjà liké ✓”
---

Bon TP ✨ et amusez-vous avec NestJS !

