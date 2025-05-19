<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRecipeStore } from '../stores/recipeStore'
import axios from 'axios'

const router = useRouter()
const recipeStore = useRecipeStore()

const difficultyOptions = [
  { value: 'Facile', label: 'Facile' },
  { value: 'Moyen', label: 'Moyen' },
  { value: 'Difficile', label: 'Difficile' }
]

const categoryOptions = [
  { value: 'Dinner', label: 'Dinner' },
  { value: 'Lunch', label: 'Lunch' },
  { value: 'Breakfast', label: 'Breakfast' },
  { value: 'Dessert', label: 'Dessert' }
]

const recipe = ref({
  title: '',
  description: '',
  time: 0,
  difficulty: 'Facile',
  category: 'Dinner',
  rating: 0,
  isFavorite: false,
  ingredients: [''],
  instructions: [''],
  image: null as File | null
})

const imageUrl = ref('')
const imageFile = ref<File | null>(null)

const addIngredient = () => {
  recipe.value.ingredients.push('')
}

const removeIngredient = (index: number) => {
  recipe.value.ingredients.splice(index, 1)
}

const addInstruction = () => {
  recipe.value.instructions.push('')
}

const removeInstruction = (index: number) => {
  recipe.value.instructions.splice(index, 1)
}

const handleImageChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    imageFile.value = target.files[0]
  }
}

const handleSubmit = async () => {
  try {
    console.log('Starting recipe creation with data:', recipe.value)
    
    let imageId = null
    if (imageFile.value) {
      console.log('Uploading image:', imageFile.value)
      const formData = new FormData()
      formData.append('files', imageFile.value)
      
      const uploadResponse = await axios.post('http://localhost:1337/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log('Image upload response:', uploadResponse.data)
      imageId = uploadResponse.data[0].id
    }

    const recipeData = {
      data: {
        title: recipe.value.title,
        description: recipe.value.description,
        time: recipe.value.time,
        difficulty: recipe.value.difficulty,
        category: recipe.value.category,
        rating: recipe.value.rating,
        isFavorite: recipe.value.isFavorite,
        ingredients: recipe.value.ingredients.join(','),
        instructions: recipe.value.instructions.join(','),
        image: imageId ? [imageId] : []
      }
    }

    console.log('Sending recipe data to Strapi:', recipeData)
    const response = await axios.post('http://localhost:1337/api/recipes', recipeData)
    console.log('Strapi response:', response.data)

    const newRecipe = {
      id: response.data.data.id.toString(),
      title: response.data.data.attributes.title,
      description: response.data.data.attributes.description,
      image: imageId ? `http://localhost:1337${response.data.data.attributes.image.data.attributes.url}` : DEFAULT_IMAGE,
      time: response.data.data.attributes.time,
      difficulty: response.data.data.attributes.difficulty,
      category: response.data.data.attributes.category,
      rating: response.data.data.attributes.rating,
      isFavorite: response.data.data.attributes.isFavorite,
      ingredients: response.data.data.attributes.ingredients.split(','),
      instructions: response.data.data.attributes.instructions.split(',')
    }

    console.log('Adding new recipe to store:', newRecipe)
    recipeStore.recipes.push(newRecipe)
    router.push('/')
  } catch (error) {
    console.error('Error creating recipe:', error)
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl md:text-4xl font-display font-bold mb-8">Create New Recipe</h1>
    
    <form @submit.prevent="handleSubmit" class="max-w-2xl mx-auto">
      <!-- Basic Information -->
      <div class="space-y-6 mb-8">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Recipe Title</label>
          <input
            id="title"
            v-model="recipe.title"
            type="text"
            required
            class="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary"
            placeholder="Enter recipe title"
          >
        </div>
        
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="description"
            v-model="recipe.description"
            rows="3"
            required
            class="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary"
            placeholder="Describe your recipe"
          ></textarea>
        </div>
        
        <div>
          <label for="image" class="block text-sm font-medium text-gray-700 mb-1">Image</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            @change="handleImageChange"
            class="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary"
          >
          <p class="text-sm text-gray-500 mt-1">Ou entrez une URL d'image</p>
          <input
            type="url"
            v-model="imageUrl"
            placeholder="URL de l'image"
            class="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary mt-2"
          >
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="time" class="block text-sm font-medium text-gray-700 mb-1">Cooking Time (minutes)</label>
            <input
              id="time"
              v-model="recipe.time"
              type="number"
              required
              min="1"
              class="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary"
            >
          </div>
          
          <div>
            <label for="difficulty" class="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select
              id="difficulty"
              v-model="recipe.difficulty"
              class="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary"
            >
              <option v-for="option in difficultyOptions" :value="option.value">{{ option.label }}</option>
            </select>
          </div>
        </div>
        
        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            id="category"
            v-model="recipe.category"
            class="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary"
          >
            <option v-for="option in categoryOptions" :value="option.value">{{ option.label }}</option>
          </select>
        </div>
      </div>
      
      <!-- Ingredients -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-display font-bold">Ingredients</h2>
          <button
            type="button"
            @click="addIngredient"
            class="text-primary hover:text-primary-dark"
          >
            + Add Ingredient
          </button>
        </div>
        
        <div class="space-y-3">
          <div
            v-for="(ingredient, index) in recipe.ingredients"
            :key="index"
            class="flex gap-2"
          >
            <input
              v-model="recipe.ingredients[index]"
              type="text"
              required
              class="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary"
              placeholder="Enter ingredient"
            >
            <button
              type="button"
              @click="removeIngredient(index)"
              class="text-red-500 hover:text-red-700"
              :disabled="recipe.ingredients.length === 1"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
      
      <!-- Instructions -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-display font-bold">Instructions</h2>
          <button
            type="button"
            @click="addInstruction"
            class="text-primary hover:text-primary-dark"
          >
            + Add Step
          </button>
        </div>
        
        <div class="space-y-3">
          <div
            v-for="(instruction, index) in recipe.instructions"
            :key="index"
            class="flex gap-2"
          >
            <textarea
              v-model="recipe.instructions[index]"
              rows="2"
              required
              class="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:ring-primary focus:border-primary"
              :placeholder="`Step ${index + 1}`"
            ></textarea>
            <button
              type="button"
              @click="removeInstruction(index)"
              class="text-red-500 hover:text-red-700"
              :disabled="recipe.instructions.length === 1"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
      
      <!-- Submit Button -->
      <div class="flex justify-end">
        <button
          type="submit"
          class="btn btn-primary"
        >
          Create Recipe
        </button>
      </div>
    </form>
  </div>
</template>