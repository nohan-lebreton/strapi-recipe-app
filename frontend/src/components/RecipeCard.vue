<script setup lang="ts">
import { computed } from 'vue'
import type { Recipe } from '../types'

const props = defineProps<{
  recipe: Recipe
}>()

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
</script>

<template>
  <div class="recipe-card group">
    <div class="relative overflow-hidden aspect-video">
      <img 
        :src="recipe.image" 
        :alt="recipe.title" 
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      >
      <div class="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md cursor-pointer hover:bg-primary-light transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
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
        <router-link :to="`/recipe/${recipe.id}`" class="btn-outline text-sm py-1 px-3 inline-block">
          View Recipe
        </router-link>
      </div>
    </div>
  </div>
</template>