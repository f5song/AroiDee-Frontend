import { apiClient } from '../apiClient';

export const getRecipeById = async (recipeId: string) => {
  const response = await apiClient.get(`/recipes/${recipeId}`);
  return response.data;
};
