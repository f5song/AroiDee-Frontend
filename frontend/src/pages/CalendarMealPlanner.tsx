"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Plus, ChevronLeft, ChevronRight, Flame, Clock, X, Search, PlusCircle, Info } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { type Recipe, fetchRecipes } from "@/lib/recipes/api"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useUserProfile } from "@/contexts/UserProfileContext"

// Define types for our data structures
interface Meal {
  category_id: string
  id: number
  mealType: string
  recipe: Recipe
}

interface MealsByDate {
  [date: string]: Meal[]
}

interface UserProfile {
  fullName: string
  username: string
  email: string
  gender: string
  weight: number
  height: number
  birthdate: string
  activityLevel: string
  calorieGoal: number
  fitnessGoals: string[]
}

const API_URL =
  import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== ""
    ? import.meta.env.VITE_API_URL
    : "https://aroi-dee-backend.vercel.app"

// Replace the MEAL_TYPES object with a mapping to category IDs
const MEAL_TYPES = {
  BREAKFAST: 3,
  LUNCH: 2,
  DINNER: 1,
  SNACK: 4,
}

// Replace the getCaloriesFromRecipe function with this updated version
const getCaloriesFromRecipe = (recipe: any): number => {
  if (!recipe) return 0

  // First check if nutrition_facts array exists and has data
  if (recipe.nutrition_facts && Array.isArray(recipe.nutrition_facts) && recipe.nutrition_facts.length > 0) {
    const nutritionFacts = recipe.nutrition_facts[0]
    if (nutritionFacts && nutritionFacts.calories) {
      // Convert string calories to number
      const calories = Number(nutritionFacts.calories)
      if (!isNaN(calories)) return calories
    }
  }

  // Fallback to direct calories properties if nutrition_facts doesn't have the data
  if (typeof recipe.calories === "number" && recipe.calories > 0) return recipe.calories
  if (typeof recipe.calorie === "number" && recipe.calorie > 0) return recipe.calorie
  if (typeof recipe.kcal === "number" && recipe.kcal > 0) return recipe.kcal

  // Try parsing string values
  if (typeof recipe.calories === "string") {
    const parsed = Number.parseInt(recipe.calories, 10)
    if (!isNaN(parsed)) return parsed
  }
  if (typeof recipe.calorie === "string") {
    const parsed = Number.parseInt(recipe.calorie, 10)
    if (!isNaN(parsed)) return parsed
  }
  if (typeof recipe.kcal === "string") {
    const parsed = Number.parseInt(recipe.kcal, 10)
    if (!isNaN(parsed)) return parsed
  }

  return 0 // Default to 0 if no valid calories found
}

// Replace the existing addMeal function with this updated version
const addMeal = async (mealData: {
  recipe_id: number
  date: string // YYYY-MM-DD
  category_id: number
}) => {
  try {
    const token = localStorage.getItem("authToken")
    const res = await fetch(`${API_URL}/api/meals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(mealData),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Failed to add meal")

    return data
  } catch (err) {
    console.error("Add meal error:", err)
    throw err
  }
}

// Helper function to get the number of days in a month
const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate()
}

// Helper function to get the first day of the month (0 = Sunday, 1 = Monday, etc.)
const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay()
}

// Add a helper function to convert category IDs to readable names
const getCategoryName = (categoryId: number): string => {
  switch (categoryId) {
    case MEAL_TYPES.BREAKFAST:
      return "Breakfast"
    case MEAL_TYPES.LUNCH:
      return "Lunch"
    case MEAL_TYPES.DINNER:
      return "Dinner"
    case MEAL_TYPES.SNACK:
      return "Snack"
    default:
      return "Meal"
  }
}

const CalendarMealPlanner: React.FC = () => {
  const { userData } = useUserProfile()
  const calorieGoal = userData.calorieGoal
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [refreshMeals, setRefreshMeals] = useState(false)
  // Get calorie goal from user profile
  const [view, setView] = useState<"calendar" | "day">("calendar") // 'calendar' or 'day'
  const [meals, setMeals] = useState<MealsByDate>({})
  const [showRecipeDialog, setShowRecipeDialog] = useState<boolean>(false)
  const [selectedMealType, setSelectedMealType] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]) // ✅ เริ่มจาก array เปล่า
  // Add this after the other useState declarations
  const [isLoadingMeals, setIsLoadingMeals] = useState<boolean>(false)
  const [totalCalories, setTotalCalories] = useState<number>(0)

  // Calculate total calories whenever meals change
  useEffect(() => {
    if (meals[selectedDate]) {
      const total = meals[selectedDate].reduce((sum, meal) => sum + getCaloriesFromRecipe(meal.recipe), 0)
      setTotalCalories(total)
    } else {
      setTotalCalories(0)
    }
  }, [meals, selectedDate])

  // Update the fetchMeals function to log more detailed information
  const fetchMeals = async () => {
    try {
      setIsLoadingMeals(true)
      const token = localStorage.getItem("authToken")

      const res = await fetch(`${API_URL}/api/meals/users/me/meals?date=${selectedDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error("Failed to fetch meals")

      const mealsData = await res.json()
      console.log("Raw meals data from API:", mealsData) // Debug log

      // Transform the data to match our component's structure
      const mealsByDate: MealsByDate = {
        [selectedDate]: mealsData.map((meal: any) => {
          // Log detailed recipe structure for debugging
          console.log("Recipe structure:", {
            id: meal.recipe?.id,
            title: meal.recipe?.title,
            nutrition_facts: meal.recipe?.nutrition_facts,
            direct_calories: meal.recipe?.calories,
          })

          // Calculate calories using our helper function
          const calories = getCaloriesFromRecipe(meal.recipe)
          console.log(`Calculated calories for ${meal.recipe?.title}:`, calories)

          // Ensure recipe has calories field
          const recipeWithCalories = {
            ...meal.recipe,
            calories: calories,
          }

          return {
            id: meal.id,
            mealType: meal.category_id,
            category_id: meal.category_id,
            recipe: recipeWithCalories,
          }
        }),
      }

      console.log("Processed meals data:", mealsByDate[selectedDate]) // Debug log
      setMeals(mealsByDate)
    } catch (error) {
      console.error("Error fetching meals:", error)
    } finally {
      setIsLoadingMeals(false)
    }
  }

  // Add this useEffect to load meals when the date changes
  useEffect(() => {
    if (!selectedDate) return
    fetchMeals()
  }, [selectedDate, refreshMeals])

  // ดึงสูตรอาหารจาก API เมื่อ searchQuery เปลี่ยน
  useEffect(() => {
    const fetchFilteredRecipes = async () => {
      try {
        setIsLoading(true) // เริ่มการโหลด
        const { recipes } = await fetchRecipes({ search: searchQuery }) // ดึงข้อมูลจาก API

        // Ensure all recipes have a calories field
        const processedRecipes = recipes.map((recipe: any) => ({
          ...recipe,
          calories: getCaloriesFromRecipe(recipe),
        }))

        setFilteredRecipes(processedRecipes) // อัพเดต filteredRecipes
      } catch (error) {
        console.error("❌ Failed to fetch recipes:", error)
      } finally {
        setIsLoading(false) // สิ้นสุดการโหลด
      }
    }

    if (searchQuery.trim() !== "") {
      fetchFilteredRecipes() // ถ้ามีคำค้นหาก็จะดึงข้อมูลจาก API
    } else {
      setFilteredRecipes([]) // ถ้าไม่มีคำค้นหาก็จะไม่แสดงอะไร
    }
  }, [searchQuery]) // ใช้ searchQuery เป็น dependency

  // ดึงข้อมูลจาก API เมื่อเปิด Recipe Dialog
  useEffect(() => {
    const fetchFilteredRecipes = async () => {
      try {
        setIsLoading(true)
        const { recipes } = await fetchRecipes({ search: searchQuery })

        // Ensure all recipes have a calories field
        const processedRecipes = recipes.map((recipe: any) => ({
          ...recipe,
          calories: getCaloriesFromRecipe(recipe),
        }))

        setFilteredRecipes(processedRecipes)
      } catch (error) {
        console.error("❌ Failed to fetch recipes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (showRecipeDialog) {
      fetchFilteredRecipes() // ดึงข้อมูลเมื่อเปิด Recipe Dialog
    }
  }, [searchQuery, showRecipeDialog]) // เมื่อ searchQuery หรือ showRecipeDialog เปลี่ยน

  // Calendar navigation
  const prevMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Date selection
  const selectDate = (date: number): void => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), date).toISOString().split("T")[0]

    setSelectedDate(selected)
    setView("day")
  }

  // Add recipe to meal plan
  const openRecipeDialog = (mealType: string): void => {
    setSelectedMealType(mealType)
    setSearchQuery("")
    setFilteredRecipes([])
    setShowRecipeDialog(true)
  }

  // Replace the addRecipeToMealPlan function with this updated version
  const addRecipeToMealPlan = async (recipe: Recipe) => {
    try {
      // Ensure recipe has calories
      const recipeWithCalories = {
        ...recipe,
        calories: getCaloriesFromRecipe(recipe),
      }

      const result = await addMeal({
        recipe_id: recipe.id,
        date: selectedDate,
        category_id: Number(selectedMealType), // Convert to number
      })

      // Add the meal to local state immediately for better UX
      const newMeal: Meal = {
        id: result.id || Date.now(), // Use the returned ID or fallback to timestamp
        mealType: selectedMealType,
        category_id: selectedMealType,
        recipe: recipeWithCalories,
      }

      console.log("Adding new meal to state:", newMeal) // Debug log

      setMeals((prevMeals) => ({
        ...prevMeals,
        [selectedDate]: [...(prevMeals[selectedDate] || []), newMeal],
      }))

      // Trigger a refresh to ensure data consistency
      setRefreshMeals(!refreshMeals)
      setShowRecipeDialog(false)
    } catch (error) {
      console.error("Failed to add recipe:", error)
    }
  }

  // Remove meal from plan
  const removeMeal = async (mealId: number): Promise<void> => {
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch(`${API_URL}/api/meals/${mealId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error("Failed to delete meal")
      }

      // Update local state after successful deletion
      setMeals((prevMeals) => ({
        ...prevMeals,
        [selectedDate]: prevMeals[selectedDate].filter((meal) => meal.id !== mealId),
      }))
    } catch (error) {
      console.error("Error deleting meal:", error)
    }
  }

  // Calculate calories for a day
  const getCaloriesForDay = (date: string): number => {
    if (!meals[date]) return 0
    return meals[date].reduce((sum, meal) => sum + getCaloriesFromRecipe(meal.recipe), 0)
  }

  // Render calendar
  const renderCalendar = (): JSX.Element => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)
    const monthName = currentDate.toLocaleString("en-US", { month: "long" })

    // Create calendar days
    const days: JSX.Element[] = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-16 md:h-24 bg-gray-50 rounded-lg"></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day).toISOString().split("T")[0]
      const isToday = date === new Date().toISOString().split("T")[0]
      const isSelected = date === selectedDate
      const dayMeals = meals[date] || []
      const totalCalories = getCaloriesForDay(date)
      const caloriePercent = Math.min(Math.round((totalCalories / calorieGoal) * 100), 100)

      days.push(
        <div
          key={day}
          className={`h-16 md:h-24 p-1 rounded-lg border ${isToday ? "border-orange-300" : "border-gray-200"} 
                    ${isSelected ? "bg-orange-50" : "bg-white"} hover:bg-orange-50 cursor-pointer transition-colors`}
          onClick={() => selectDate(day)}
        >
          <div className="flex justify-between items-start">
            <span
              className={`inline-block rounded-full w-6 h-6 text-center leading-6 ${
                isToday ? "bg-orange-500 text-white" : ""
              }`}
            >
              {day}
            </span>
            {totalCalories > 0 && (
              <span className="text-xs font-medium text-gray-500 hidden sm:inline">{totalCalories} kcal</span>
            )}
          </div>

          {dayMeals.length > 0 && (
            <div className="mt-1">
              <div className="mt-1 h-1 bg-gray-100 rounded overflow-hidden">
                <div
                  className={`h-full ${
                    caloriePercent > 100 ? "bg-red-500" : caloriePercent > 80 ? "bg-yellow-500" : "bg-green-500"
                  }`}
                  style={{ width: `${caloriePercent}%` }}
                ></div>
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {(window.innerWidth < 640 ? dayMeals.slice(0, 1) : dayMeals.slice(0, 2)).map((meal: Meal) => (
                  <Badge
                    key={meal.id}
                    variant="outline"
                    className="text-xs truncate max-w-[90px] hidden sm:inline-flex"
                  >
                    {meal.recipe.title}
                  </Badge>
                ))}
                {dayMeals.length > (window.innerWidth < 640 ? 1 : 2) && (
                  <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                    +{dayMeals.length - (window.innerWidth < 640 ? 1 : 2)}
                  </Badge>
                )}
                {dayMeals.length > 0 && window.innerWidth < 640 && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-1"></div>
                )}
              </div>
            </div>
          )}
        </div>,
      )
    }

    return (
      <div className="bg-white rounded-lg shadow-sm p-2 md:p-4">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" size="sm" onClick={prevMonth} className="p-1 md:p-2">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg md:text-xl font-semibold">
            {monthName} {year}
          </h2>
          <Button variant="ghost" size="sm" onClick={nextMonth} className="p-1 md:p-2">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-1 md:mb-2">
          {["Su", "M", "Tu", "W", "Th", "F", "Sa"].map((day) => (
            <div key={day} className="text-center font-medium text-gray-500 text-xs md:text-sm">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-2">{days}</div>
      </div>
    )
  }

  // Render day view
  const renderDayView = (): JSX.Element => {
    const dayMeals = meals[selectedDate] || []
    console.log("Day meals data:", dayMeals) // Add this line to debug
    const totalCalories = getCaloriesForDay(selectedDate)
    const caloriePercent = Math.min(Math.round((totalCalories / calorieGoal) * 100), 100)
    const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    // Update the renderDayView function to use category IDs instead of strings
    // Group meals by type
    const mealsByType = {
      [MEAL_TYPES.BREAKFAST]: dayMeals.filter((meal) => Number(meal.category_id) === MEAL_TYPES.BREAKFAST),
      [MEAL_TYPES.LUNCH]: dayMeals.filter((meal) => Number(meal.category_id) === MEAL_TYPES.LUNCH),
      [MEAL_TYPES.DINNER]: dayMeals.filter((meal) => Number(meal.category_id) === MEAL_TYPES.DINNER),
      [MEAL_TYPES.SNACK]: dayMeals.filter((meal) => Number(meal.category_id) === MEAL_TYPES.SNACK),
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setView("calendar")} className="w-full sm:w-auto">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Calendar
          </Button>
          <h2 className="text-base sm:text-lg font-medium text-center w-full sm:w-auto">{formattedDate}</h2>
        </div>

        {/* Calorie progress */}
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-2 gap-1">
              <span className="font-medium flex items-center">
                <Flame className="w-5 h-5 mr-2 text-orange-500 flex-shrink-0" /> Total Calories
              </span>
              <span className="text-lg font-bold">
                {totalCalories} / {calorieGoal} kcal
              </span>
            </div>
            <Progress value={caloriePercent} className="h-2" />
            <p className="text-sm text-gray-500 mt-2 text-right">
              {caloriePercent > 100 ? "Over limit!" : caloriePercent > 80 ? "Getting close" : "Within limit"}
            </p>
          </CardContent>
        </Card>

        {/* Meal timeline */}
        <div className="space-y-2">
          {[MEAL_TYPES.BREAKFAST, MEAL_TYPES.LUNCH, MEAL_TYPES.DINNER, MEAL_TYPES.SNACK].map((categoryId) => (
            <div key={categoryId} className="relative">
              <div className="absolute top-0 left-3 md:left-6 w-0.5 h-full bg-gray-200 -z-10"></div>
              <div className="ml-6 md:ml-12">
                <div className="flex items-center mb-2">
                  <div className="absolute left-0 w-6 h-6 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-white border-2 border-gray-200">
                    <span className="text-xs md:text-lg font-bold">
                      {categoryId === MEAL_TYPES.BREAKFAST
                        ? "07"
                        : categoryId === MEAL_TYPES.LUNCH
                          ? "12"
                          : categoryId === MEAL_TYPES.DINNER
                            ? "18"
                            : "15"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <h3 className="text-base md:text-lg font-medium">{getCategoryName(categoryId)}</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openRecipeDialog(categoryId.toString())}
                      className="ml-auto text-xs md:text-sm px-2 md:px-3"
                    >
                      <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1" /> <span className="hidden xs:inline">Add Menu</span>
                    </Button>
                  </div>
                </div>

                <div className="ml-2 mb-8">
                  {mealsByType[categoryId]?.length > 0 ? (
                    <div className="space-y-2">
                      {mealsByType[categoryId].map((meal: Meal) => {
                        // Debug log for each meal
                        console.log(`Meal ${meal.id} recipe:`, meal.recipe)
                        const calories = getCaloriesFromRecipe(meal.recipe)

                        return (
                          <Card
                            key={meal.id}
                            className="overflow-hidden border border-gray-200 hover:border-orange-200 transition-colors"
                          >
                            <div className="flex flex-col xs:flex-row">
                              <img
                                src={meal.recipe.image_url || "/placeholder.svg"}
                                alt={meal.recipe.title}
                                className="w-full xs:w-24 h-32 xs:h-24 object-cover"
                              />
                              <div className="p-3 flex-grow">
                                <div className="flex justify-between">
                                  <h4 className="font-medium truncate">{meal.recipe.title}</h4>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeMeal(meal.id)}
                                    className="h-8 w-8 p-0 text-gray-500 rounded-full -mr-2 -mt-2"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mt-1 flex-wrap gap-y-1">
                                  <span className="flex items-center mr-2">
                                    <Flame className="w-3 h-3 mr-1" />
                                    {calories} kcal
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {meal.recipe.cook_time} minutes
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  ) : (
                    <Card className="bg-gray-50 border-dashed border-2 p-4 flex justify-center">
                      <Button
                        variant="ghost"
                        onClick={() => openRecipeDialog(String(categoryId))}
                        className="text-gray-400 hover:text-gray-600 text-xs md:text-sm"
                      >
                        <PlusCircle className="h-4 w-4 md:h-6 md:w-6 mr-1 md:mr-2" />
                        <span className="hidden xs:inline">Add food to this meal</span>
                        <span className="xs:hidden">Add food</span>
                      </Button>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-2 md:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Daily Meal Planner</h1>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs sm:text-sm font-medium hidden md:inline">Calorie Goal:</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center bg-gray-100 px-2 py-1 sm:px-3 sm:py-1.5 rounded-md">
                  <span className="text-sm sm:font-medium">{calorieGoal.toLocaleString()} kcal</span>
                  <Info className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2 text-gray-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs sm:text-sm">Calorie goal is synced with your profile settings</p>
                <Button variant="link" className="p-0 h-auto text-xs text-blue-500" asChild>
                  <a href="/profile/settings">Change in profile</a>
                </Button>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Tabs defaultValue="planner" className="mb-4 sm:mb-6">
        <TabsList className="mb-2 sm:mb-4 w-full h-auto">
          <TabsTrigger value="planner" className="text-xs sm:text-sm py-1.5 flex-1">
            Meal Plan
          </TabsTrigger>
          <TabsTrigger value="statistics" className="text-xs sm:text-sm py-1.5 flex-1">
            Calorie Stats
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="text-xs sm:text-sm py-1.5 flex-1">
            Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="planner">{view === "calendar" ? renderCalendar() : renderDayView()}</TabsContent>

        <TabsContent value="statistics">
          <Card className="p-3 sm:p-6">
            <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-4">Calorie Statistics for the Last 7 Days</h3>
            <p className="text-center text-gray-500 py-6 sm:py-8">Calorie statistics chart will be displayed here</p>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card className="p-3 sm:p-6">
            <h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-4">Recommended Menus for You</h3>
            <p className="text-center text-gray-500 py-6 sm:py-8">Recommended menus will be displayed here</p>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recipe selection dialog */}
      <Dialog open={showRecipeDialog} onOpenChange={setShowRecipeDialog}>
        <DialogContent className="sm:max-w-lg max-w-[95vw] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Menu</DialogTitle>
            <DialogDescription>
              Select the menu you want to add to {getCategoryName(Number(selectedMealType))}
            </DialogDescription>
          </DialogHeader>

          <div className="relative mb-4">
            <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search for menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Loading spinner */}
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin h-8 w-8 border-t-2 border-orange-500 border-solid rounded-full"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto p-1">
              {filteredRecipes.map((recipe: Recipe) => (
                <Card
                  key={recipe.id}
                  className="cursor-pointer hover:border-orange-300 transition-colors"
                  onClick={() => addRecipeToMealPlan(recipe)}
                >
                  <div className="relative h-20 sm:h-24 overflow-hidden">
                    <img
                      src={recipe.image_url || "/placeholder.svg"}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <h4 className="text-white font-medium truncate text-sm sm:text-base">{recipe.title}</h4>
                    </div>
                  </div>
                  <CardFooter className="p-2">
                    <div className="w-full flex justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        <Flame className="h-3 w-3 mr-1 text-orange-500" />
                        {getCaloriesFromRecipe(recipe)} kcal
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-blue-500" />
                        {recipe.cook_time} min
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CalendarMealPlanner
