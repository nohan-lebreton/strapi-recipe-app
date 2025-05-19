<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-gray-800 text-white py-8 mt-12">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-xl font-display font-bold mb-4">Savory<span class="text-accent">Bites</span></h3>
          <p class="text-gray-300">Discover delicious recipes from around the world. Cook with confidence and enjoy amazing meals with your loved ones.</p>
        </div>
        
        <div>
          <h4 class="text-lg font-bold mb-4">Quick Links</h4>
          <ul class="space-y-2">
            <li><router-link to="/" class="text-gray-300 hover:text-white transition">Home</router-link></li>
            <li><router-link to="/categories" class="text-gray-300 hover:text-white transition">Categories</router-link></li>
            <li><router-link to="/favorites" class="text-gray-300 hover:text-white transition">Favorites</router-link></li>
          </ul>
        </div>
        
        <div>
          <h4 class="text-lg font-bold mb-4">Popular Categories</h4>
          <ul class="space-y-2">
            <li><router-link to="/categories/breakfast" class="text-gray-300 hover:text-white transition">Breakfast</router-link></li>
            <li><router-link to="/categories/dinner" class="text-gray-300 hover:text-white transition">Dinner</router-link></li>
            <li><router-link to="/categories/desserts" class="text-gray-300 hover:text-white transition">Desserts</router-link></li>
            <li><router-link to="/categories/vegetarian" class="text-gray-300 hover:text-white transition">Vegetarian</router-link></li>
          </ul>
        </div>
      </div>
      
      <div class="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; {{ currentYear }} SavoryBites. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>