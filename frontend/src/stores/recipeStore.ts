import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Recipe } from '../types'
import axios from 'axios'

// Interface pour l'image retournée par Strapi
interface StrapiImage {
  id: number
  name: string
  alternativeText: string | null
  caption: string | null
  width: number
  height: number
  formats: {
    thumbnail: {
      url: string
    }
  }
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: string | null
  provider: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}

// Interface pour l'item retourné par Strapi
interface StrapiItem {
  id: number
  title: string
  description: any
  time: number
  difficulty: string
  category: string
  rating: number
  isFavorite: boolean
  ingredients: string
  instructions: string | null
  image: StrapiImage[]
  createdAt: string
  updatedAt: string
  publishedAt: string
}

// Image par défaut
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=1000&auto=format&fit=crop'

export const useRecipeStore = defineStore('recipe', () => {
  const recipes = ref<Recipe[]>([])
  const isLoading = ref(false)
  const error = ref('')

  // Fetch recipes from Strapi API
  const fetchRecipes = async () => {
    isLoading.value = true
    error.value = ''
    try {
      const response = await axios.get('http://localhost:1337/api/recipes?populate=*')
      console.log('Strapi response:', response.data)
      // Strapi retourne les données dans response.data.data
      recipes.value = response.data.data.map((item: StrapiItem) => {
        console.log('Recipe item:', item)
        console.log('Raw item:', JSON.stringify(item, null, 2))
        
        // Construire l'URL de l'image
        let imageUrl = DEFAULT_IMAGE
        if (item.image && item.image.length > 0) {
          const image = item.image[0]
          imageUrl = `http://localhost:1337${image.url}`
        }
        
        const recipe = {
          id: item.id.toString(),
          title: item.title || '',
          description: Array.isArray(item.description) 
            ? item.description
                .map((block: any) => block.children?.map((child: any) => child.text).join('') || '')
                .join('\n')
            : '',
          image: imageUrl,
          time: item.time || 0,
          difficulty: item.difficulty || 'Easy',
          category: item.category || 'Dinner',
          rating: item.rating || 0,
          isFavorite: item.isFavorite || false,
          ingredients: item.ingredients ? item.ingredients.split(',').map((ing: string) => ing.trim()) : [],
          instructions: item.instructions ? item.instructions.split(',').map((inst: string) => inst.trim()) : []
        }
        console.log('Processed recipe:', recipe)
        return recipe
      })
    } catch (err) {
      console.error('Error fetching recipes:', err)
      error.value = 'Failed to load recipes. Please try again later.'
    } finally {
      isLoading.value = false
    }
  }

  // Get a single recipe by ID
  const getRecipeById = (id: string) => {
    return recipes.value.find(recipe => recipe.id === id)
  }

  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    const recipe = recipes.value.find(r => r.id === id)
    if (recipe) {
      recipe.isFavorite = !recipe.isFavorite
    }
  }

  return {
    recipes,
    isLoading,
    error,
    fetchRecipes,
    getRecipeById,
    toggleFavorite
  }
})