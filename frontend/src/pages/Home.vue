<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import RecipeList from '../components/RecipeList.vue'
import HeroSection from '../components/HeroSection.vue'
import { useRecipeStore } from '../stores/recipeStore'

const route = useRoute()
const recipeStore = useRecipeStore()

// Get search query from URL if present
const searchQuery = computed(() => route.query.search as string || '')

// Get category from URL if present
const category = computed(() => route.params.category as string || '')

const title = computed(() => {
  if (searchQuery.value) {
    return `Search results for "${searchQuery.value}"`
  } else if (category.value) {
    return `${category.value.charAt(0).toUpperCase() + category.value.slice(1)} Recipes`
  }
  return 'Discover Delicious Recipes'
})
</script>

<template>
  <div>
    <!-- Show hero only on main page without search or category filter -->
    <HeroSection v-if="!searchQuery && !category" />
    
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl md:text-4xl font-display font-bold mb-6">{{ title }}</h1>
      
      <RecipeList 
        :search-query="searchQuery"
        :category="category"
      />
    </div>
  </div>
</template>