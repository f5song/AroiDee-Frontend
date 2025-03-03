// lib/recipes/index.ts
// Export all public interfaces, constants, and functions

// Types
export * from './types';

// Constants 
export {
  RECIPES_PER_PAGE,
  SORT_OPTIONS,
  SORT_OPTIONS_LIST,
  TAB_VALUES,
  DIFFICULTY_OPTIONS,
  COOKING_TIME_OPTIONS,
  DEFAULT_FILTER_OPTIONS,
  TAG_COLORS,
  CATEGORIES,
  CATEGORY_GROUPS,
  TAG_DISPLAY,
  APP_CONFIG,
  STATUS_MESSAGES
} from './constants';

// API functions
export {
  fetchRecipes,
  fetchUserRecipes,
  fetchFavoriteRecipes,
  fetchRecipeById,
  fetchRecipesBySource,
  toggleFavoriteRecipe,
  isFavoriteRecipe,
  fetchCategories
} from './api';

// Utils
export {
  sortRecipes,
  filterRecipes,
  getTagColor,
  formatCookingTime,
  getTagDisplayName,
  formatCalories,
  getDifficultyDisplay,
  extractUniqueTags,
  paginateData,
  getCategoryOptions,
  formatRecipeForDisplay,
  getPlaceholderRecipeImage,
  validateImageFile
} from './utils';

// Storage utils
export {
  getFavoriteIds,
  saveFavoriteIds,
  saveRecentSearch,
  getRecentSearches,
  saveUserPreferences,
  getUserPreferences
} from './storage';

// Form module (everything related to creating/editing recipes)
export * from './form';