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
  documentId: string
  title: string
  description: any
  time: number
  difficulty: string
  category: string
  rating: number
  isFavorite: boolean
  ingredients: string[]
  instructions: string[]
  image: StrapiImage[]
  createdAt: string
  updatedAt: string
  publishedAt: string
}

// Image par défaut
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=1000&auto=format&fit=crop'

export const useRecipeStore = defineStore('recipe', {
  state: () => ({
    recipes: [] as Recipe[]
  }),
  actions: {
    async fetchRecipes() {
      try {
        const response = await axios.get('http://localhost:1337/api/recipes?populate=*')
        this.recipes = response.data.data.map((item: StrapiItem) => ({
          id: item.id.toString(),
          documentId: item.documentId,
          title: item.title,
          description: item.description || '',
          image: item.image && item.image[0]?.url ? `http://localhost:1337${item.image[0].url}` : DEFAULT_IMAGE,
          time: item.time,
          difficulty: item.difficulty,
          category: item.category,
          rating: item.rating,
          isFavorite: item.isFavorite,
          ingredients: item.ingredients || [],
          instructions: item.instructions || []
        }))
      } catch (error) {
        console.error('Error fetching recipes:', error)
      }
    },
    async deleteRecipe(documentId: string) {
      try {
        await axios.delete(`http://localhost:1337/api/recipes/${documentId}`)
        // Mettre à jour le store local
        this.recipes = this.recipes.filter(r => r.documentId !== documentId)
      } catch (error: any) {
        console.error('Error deleting recipe:', error.response || error)
        if (error.response?.status === 403) {
          throw new Error('Vous n\'avez pas les permissions nécessaires pour supprimer cette recette')
        } else if (error.response?.status === 404) {
          throw new Error('La recette n\'existe pas')
        } else {
          throw new Error('Une erreur est survenue lors de la suppression de la recette')
        }
      }
    },
    async updateRecipe(documentId: string, updatedRecipe: Partial<Recipe>) {
      try {
        const formData = new FormData()
        formData.append('data[title]', updatedRecipe.title || '')
        formData.append('data[description]', updatedRecipe.description || '')
        formData.append('data[time]', updatedRecipe.time?.toString() || '0')
        formData.append('data[difficulty]', updatedRecipe.difficulty || '')
        formData.append('data[category]', updatedRecipe.category || '')
        formData.append('data[rating]', updatedRecipe.rating?.toString() || '0')
        formData.append('data[isFavorite]', updatedRecipe.isFavorite?.toString() || 'false')
        formData.append('data[ingredients]', JSON.stringify(updatedRecipe.ingredients || []))
        formData.append('data[instructions]', JSON.stringify(updatedRecipe.instructions || []))

        await axios.put(`http://localhost:1337/api/recipes/${documentId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      } catch (error) {
        console.error('Error updating recipe:', error)
        throw error
      }
    },
    async toggleFavorite(documentId: string) {
      try {
        // Vérifier si la recette existe
        const checkResponse = await axios.get(`http://localhost:1337/api/recipes/${documentId}`)
        console.log(checkResponse)
        const recipeData = checkResponse.data.data
    
        if (!recipeData) {
          console.error('La recette n\'existe pas dans la base de données.')
          return
        }
    
        const currentFavoriteStatus = recipeData.isFavorite
    
        const requestData = {
          data: {
            isFavorite: !currentFavoriteStatus
          }
        }
    
        // Mise à jour du statut de favori
        await axios.put(`http://localhost:1337/api/recipes/${documentId}`, requestData, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
    
        console.log(`Recette ${documentId} mise à jour (isFavorite: ${!currentFavoriteStatus})`)
      } catch (error: any) {
        console.error('Erreur lors de la mise à jour du statut de favori :', error.response || error)
      }
    }
  }
})