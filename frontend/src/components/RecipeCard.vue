<script setup lang="ts">
import { computed } from 'vue'
import type { Recipe } from '../types'
import { useRouter } from 'vue-router'
import { useRecipeStore } from '../stores/recipeStore'

const props = defineProps<{
  recipe: Recipe
}>()

const router = useRouter()
const recipeStore = useRecipeStore()

const difficultyColor = computed(() => {
  switch (props.recipe.difficulty.toLowerCase()) {
    case 'easy':
      return 'bg-green-100 text-green-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'hard':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})

const handleEdit = () => {
  console.log('Editing recipe with documentId:', props.recipe.documentId)
  router.push({
    name: 'edit-recipe',
    params: { documentId: props.recipe.documentId }
  })
}

const handleDelete = async () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette recette ?')) {
    try {
      console.log(props.recipe.documentId)
      await recipeStore.deleteRecipe(props.recipe.documentId)
      // La suppression a réussi, la carte sera automatiquement retirée du store
    } catch (error: any) {
      console.error('Error deleting recipe:', error)
    }
  }
}

const toggleFavorite = async () => {
  try {
    await recipeStore.toggleFavorite(props.recipe.documentId)
    // Mettre à jour le store local
    const index = recipeStore.recipes.findIndex(r => r.documentId === props.recipe.documentId)
    if (index !== -1) {
      recipeStore.recipes[index] = {
        ...recipeStore.recipes[index],
        isFavorite: !recipeStore.recipes[index].isFavorite
      }
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
    alert('Une erreur est survenue lors de la mise à jour des favoris')
  }
}
</script>

<template>
  <div class="recipe-card group">
    <div class="relative overflow-hidden aspect-video">
      <img 
        :src="recipe.image" 
        :alt="recipe.title" 
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      >
      <div class="absolute top-2 right-2 flex gap-2">
        <button
          @click="toggleFavorite"
          class="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" :class="['h-5 w-5', recipe.isFavorite ? 'text-primary fill-primary' : 'text-gray-600']" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <button
          @click="handleEdit"
          class="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button
          @click="handleDelete"
          class="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
    
    <div class="p-4">
      <div class="flex justify-between items-start">
        <h3 class="font-display font-bold text-lg mb-2 group-hover:text-primary-dark transition-colors">{{ recipe.title }}</h3>
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span class="ml-1 text-sm font-medium">{{ recipe.rating.toFixed(1) }}</span>
        </div>
      </div>
      
      <div class="flex items-center text-sm text-gray-600 mb-3 space-x-4">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ recipe.time }} mins</span>
        </div>
        <div :class="['px-2 py-1 rounded-full text-xs font-medium', difficultyColor]">
          {{ recipe.difficulty }}
        </div>
      </div>
      
      <p class="text-gray-600 text-sm line-clamp-2 mb-3">{{ recipe.description }}</p>
      
      <div class="flex justify-between items-center">
        <span class="text-sm font-medium text-primary-dark">{{ recipe.category }}</span>
        <router-link :to="`/recipe/${recipe.documentId}`" class="btn-outline text-sm py-1 px-3 inline-block">
          View Recipe
        </router-link>
      </div>
    </div>
  </div>
</template>