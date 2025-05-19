export interface Recipe {
  id: string
  title: string
  description: string
  image: string
  time: number
  difficulty: string
  category: string
  rating: number
  isFavorite: boolean
  ingredients: string[]
  instructions: string[]
}