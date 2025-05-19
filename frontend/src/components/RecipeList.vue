<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import RecipeCard from './RecipeCard.vue'
import { useRecipeStore } from '../stores/recipeStore'
import type { Recipe } from '../types'

const props = defineProps<{
  category?: string
  searchQuery?: string
  favorites?: boolean
}>()

const recipeStore = useRecipeStore()
const isLoading = ref(true)

onMounted(async () => {
  if (recipeStore.recipes.length === 0) {
    await recipeStore.fetchRecipes()
  }
  isLoading.value = false
})

const filteredRecipes = computed(() => {
  let recipes = [...recipeStore.recipes]
  
  // Filter by category if specified
  if (props.category) {
    recipes = recipes.filter(recipe => 
      recipe.category.toLowerCase() === props.category?.toLowerCase()
    )
  }
  
  // Filter by search query if specified
  if (props.searchQuery) {
    const query = props.searchQuery.toLowerCase()
    recipes = recipes.filter(recipe => 
      recipe.title.toLowerCase().includes(query) || 
      recipe.description.toLowerCase().includes(query) ||
      recipe.ingredients.some(ing => ing.toLowerCase().includes(query))
    )
  }
  
  // Filter favorites if specified
  if (props.favorites) {
    recipes = recipes.filter(recipe => recipe.isFavorite)
  }
  
  return recipes
})

// Watch for store changes to update UI
watch(() => recipeStore.recipes, () => {
  // Handle any UI updates needed when recipes change
}, { deep: true })
</script>

<template>
  <div>
    <div v-if="isLoading" class="flex justify-center my-12">
      <div class="loader">
        <svg class="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>
    
    <div v-else-if="filteredRecipes.length === 0" class="text-center my-12">
      <img src="https://images.pexels.com/photos/4110238/pexels-photo-4110238.jpeg?auto=compress&cs=tinysrgb&w=600" alt="No recipes found" class="w-40 h-40 mx-auto mb-4 object-cover rounded-full">
      <h3 class="text-xl font-display font-bold text-gray-700">No recipes found</h3>
      <p class="text-gray-500 mt-2">Try adjusting your search or filters</p>
    </div>
    
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <RecipeCard 
        v-for="recipe in filteredRecipes" 
        :key="recipe.id" 
        :recipe="recipe" 
      />
    </div>
  </div>
</template>