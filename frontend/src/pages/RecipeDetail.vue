<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecipeStore } from '../stores/recipeStore'

const route = useRoute()
const router = useRouter()
const recipeStore = useRecipeStore()
const isLoading = ref(true)
const activeTab = ref('ingredients')

const recipeId = computed(() => route.params.id as string)

const recipe = computed(() => {
  return recipeStore.getRecipeById(recipeId.value)
})

const difficultyColor = computed(() => {
  if (!recipe.value) return 'bg-gray-100 text-gray-800'
  
  switch (recipe.value.difficulty.toLowerCase()) {
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

const toggleFavorite = () => {
  if (recipe.value) {
    recipeStore.toggleFavorite(recipe.value.id)
  }
}

onMounted(async () => {
  if (recipeStore.recipes.length === 0) {
    await recipeStore.fetchRecipes()
  }
  
  // If recipe doesn't exist, redirect to home
  setTimeout(() => {
    if (!recipe.value) {
      router.push('/')
    }
    isLoading.value = false
  }, 500)
})
</script>

<template>
  <div class="min-h-[80vh]">
    <div v-if="isLoading" class="flex justify-center items-center min-h-[60vh]">
      <div class="loader">
        <svg class="animate-spin h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>
    
    <div v-else-if="recipe" class="container mx-auto px-4 py-8">
      <!-- Recipe Header -->
      <div class="mb-8">
        <div class="flex flex-wrap items-center justify-between mb-4">
          <h1 class="text-3xl md:text-4xl font-display font-bold">{{ recipe.title }}</h1>
          <button @click="toggleFavorite" class="flex items-center mt-2 md:mt-0">
            <svg xmlns="http://www.w3.org/2000/svg" :class="['h-6 w-6', recipe.isFavorite ? 'text-primary fill-primary' : 'text-gray-400']" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span class="ml-2">{{ recipe.isFavorite ? 'Saved to Favorites' : 'Add to Favorites' }}</span>
          </button>
        </div>
        
        <div class="flex flex-wrap items-center text-sm text-gray-600 mb-6 gap-4">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ recipe.time }} mins</span>
          </div>
          <div :class="['px-3 py-1 rounded-full text-sm font-medium', difficultyColor]">
            {{ recipe.difficulty }}
          </div>
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{{ recipe.rating.toFixed(1) }} ({{ Math.floor(recipe.rating * 12) }} reviews)</span>
          </div>
          <div class="text-primary-dark font-medium">
            {{ recipe.category }}
          </div>
        </div>
      </div>
      
      <!-- Recipe Image -->
      <div class="mb-8 overflow-hidden rounded-xl">
        <img :src="recipe.image" :alt="recipe.title" class="w-full h-auto object-cover max-h-[500px]">
      </div>
      
      <!-- Recipe Description -->
      <div class="mb-8">
        <p class="text-gray-700 leading-relaxed">{{ recipe.description }}</p>
      </div>
      
      <!-- Recipe Content Tabs -->
      <div class="mb-8">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button 
              @click="activeTab = 'ingredients'" 
              :class="[
                'py-4 px-6 text-center border-b-2 font-medium text-sm',
                activeTab === 'ingredients' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Ingredients
            </button>
            <button 
              @click="activeTab = 'instructions'" 
              :class="[
                'py-4 px-6 text-center border-b-2 font-medium text-sm',
                activeTab === 'instructions' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              Instructions
            </button>
          </nav>
        </div>
        
        <div class="py-6">
          <!-- Ingredients Tab -->
          <div v-if="activeTab === 'ingredients'" class="space-y-4">
            <h2 class="text-2xl font-display font-bold">Ingredients</h2>
            <ul class="space-y-3">
              <li v-for="(ingredient, index) in recipe.ingredients" :key="index" class="flex items-start">
                <span class="inline-block w-5 h-5 bg-primary rounded-full flex-shrink-0 mr-3 mt-1"></span>
                <span>{{ ingredient }}</span>
              </li>
            </ul>
          </div>
          
          <!-- Instructions Tab -->
          <div v-if="activeTab === 'instructions'" class="space-y-4">
            <h2 class="text-2xl font-display font-bold">Instructions</h2>
            <ol class="space-y-6">
              <li v-for="(step, index) in recipe.instructions" :key="index" class="flex">
                <span class="flex-shrink-0 w-8 h-8 rounded-full bg-primary-light text-white flex items-center justify-center mr-4 font-semibold">{{ index + 1 }}</span>
                <div class="flex-1">
                  <p class="text-gray-700">{{ step }}</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>