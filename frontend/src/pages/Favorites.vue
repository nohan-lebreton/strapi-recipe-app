<script setup lang="ts">
import { ref, computed } from 'vue'
import RecipeList from '../components/RecipeList.vue'
import { useRecipeStore } from '../stores/recipeStore'

const recipeStore = useRecipeStore()

const hasFavorites = computed(() => {
  return recipeStore.recipes.some(recipe => recipe.isFavorite)
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl md:text-4xl font-display font-bold mb-2">My Favorite Recipes</h1>
    <p class="text-gray-600 mb-8">Find all your saved recipes in one place</p>
    
    <RecipeList :favorites="true" />
    
    <div v-if="!hasFavorites" class="text-center py-16">
      <img src="https://images.pexels.com/photos/6549166/pexels-photo-6549166.jpeg?auto=compress&cs=tinysrgb&w=600" alt="No favorites" class="w-40 h-40 mx-auto mb-4 object-cover rounded-full">
      <h3 class="text-xl font-display font-bold text-gray-700">No favorites yet</h3>
      <p class="text-gray-500 mt-2 mb-6">Start saving your favorite recipes to find them easily later</p>
      <router-link to="/" class="btn-primary">Discover Recipes</router-link>
    </div>
  </div>
</template>