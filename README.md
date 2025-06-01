# Application de Recettes de Cuisine

## lancer le projet
Pour lancer le projet, suivez les étapes ci-dessous :

1. **Clonez le dépôt** :
   ```bash
   git clone https://github.com/nohan-lebreton/strapi-recipe-app.git
   ```
2. **Installez les dépendances** :
   - Pour le backend (Strapi) :
     ```bash
     cd backend
     npm install
     ```
   - Pour le frontend (Vue.js) :
     ```bash
     cd frontend
     npm install
     ```
3. **Démarrez le backend** :
   ```bash
   cd backend
   npm run develop
   ```
4. **Démarrez le frontend** :
   ```bash
   cd frontend
   npm run serve
   ```
5. **Mettre à jour les droits d'accès** :
    Sans export de la base de données, vous devez configurer les permissions manuellement dans Strapi :
   - Accédez à l'interface d'administration de Strapi (généralement à `http://localhost:1337/admin`). L'url est fournit par Strapi lors du démarrage.
   - Créez un utilisateur administrateur si ce n'est pas déjà fait.
   - Allez dans "Settings" > "Roles & Permissions".
   - Sélectionnez le rôle "Public" et "Authenticated".
   - Activez toutes les permissions nécessaires pour les recettes (CRUD). Et les uploads.

6. **Accédez à l'application** :
    - Ouvrez votre navigateur et allez à l'URL spécifiée pour le frontend lors du lancement.

## Documentation Utilisateurs

![Capture d'écran de la page d'accueil](./doc/image/home.png)

*Page d'accueil de l'application SavoryBites : recherche, navigation par catégories, et accès rapide aux recettes populaires.*

![Capture d'écran du formulaire de création de recette](./doc/image/create.png)

*Formulaire de création d'une nouvelle recette : saisie des informations, ajout d'ingrédients, d'instructions et gestion de l'image.*

![Capture d'écran du formulaire de création de recette](./doc/image/card.png)

*Carte d'un recette.*
- Si on clique (en bas à droite de la carte) sur view recipe on peut voir les details de la recette.
- Si on clique sur l'icon poubelle on suprrime la recette (pas simplement front mais directement en bdd)
- Si on clique sur l'icon crayon on ouvre une fenetre d'edition de la recette.
- Si on clique sur l'icon de coeur on met la recette en favoris. Ce qui permet de la voir dans l'onglet "favorites".

## Spécifications Générales

### Schéma Relationnel

```mermaid
erDiagram
    Recipe {
        int id PK
        string title
        string description
        int time
        string difficulty
        string category
        int rating
        boolean isFavorite
        string ingredients
        string instructions
        datetime createdAt
        datetime updatedAt
        datetime publishedAt
    }
    
    Upload {
        int id PK
        string name
        string alternativeText
        string caption
        int width
        int height
        json formats
        string hash
        string ext
        string mime
        float size
        string url
        string previewUrl
        string provider
        datetime createdAt
        datetime updatedAt
    }

    Recipe ||--o{ Upload : "has"
```

### Diagramme UML

#### Diagramme de Classes

```mermaid
classDiagram
    class Recipe {
        +int id
        +string title
        +string description
        +int time
        +string difficulty
        +string category
        +int rating
        +boolean isFavorite
        +string[] ingredients
        +string[] instructions
        +string image
        +create()
        +update()
        +delete()
        +toggleFavorite()
    }

    class RecipeStore {
        +Recipe[] recipes
        +boolean isLoading
        +string error
        +fetchRecipes()
        +getRecipeById()
        +toggleFavorite()
    }

    class Upload {
        +int id
        +string name
        +string url
        +string mime
        +float size
        +upload()
        +delete()
    }

    RecipeStore --> Recipe : manages
    Recipe --> Upload : has
```

#### Diagramme de Cas d'Utilisation

```mermaid
graph TD
    A[Utilisateur] --> B[Consulter les recettes]
    A --> C[Créer une recette]
    A --> D[Modifier une recette]
    A --> E[Supprimer une recette]
    A --> F[Marquer comme favori]
    A --> G[Uploader une image]
    A --> H[Rechercher des recettes]
    A --> I[Filtrer par catégorie]
    A --> J[Filtrer par difficulté]
```

#### Diagramme de Séquence - Création d'une Recette

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant F as Frontend
    participant S as Strapi
    participant DB as Base de données

    U->>F: Remplit le formulaire
    U->>F: Soumet le formulaire
    F->>S: Upload de l'image
    S->>DB: Sauvegarde l'image
    S-->>F: Retourne l'ID de l'image
    F->>S: Crée la recette avec l'ID de l'image
    S->>DB: Sauvegarde la recette
    S-->>F: Retourne la recette créée
    F-->>U: Affiche la confirmation
```

### Routes API

#### Backend (Strapi)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/recipes` | Récupérer toutes les recettes |
| GET | `/api/recipes/:id` | Récupérer une recette spécifique |
| POST | `/api/recipes` | Créer une nouvelle recette |
| PUT | `/api/recipes/:id` | Mettre à jour une recette |
| DELETE | `/api/recipes/:id` | Supprimer une recette |
| POST | `/api/upload` | Uploader une image |

#### Frontend (Vue.js)

| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | `HomePage.vue` | Page d'accueil avec la liste des recettes |
| `/create` | `CreateRecipe.vue` | Formulaire de création de recette |
| `/recipe/:id` | `RecipeDetail.vue` | Détails d'une recette spécifique |

### Structure des Données

#### Recipe
```