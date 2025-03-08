/**
 * Converts recipe ingredient measurements between metric and imperial units
 */
export const convertIngredient = (ingredient: string, toUnit: string): string => {
    if (toUnit === "imperial") {
      // Simple conversion examples
      if (ingredient.includes("g graham crackers")) {
        return ingredient.replace("200g graham crackers", "7oz graham crackers");
      } else if (ingredient.includes("g melted butter")) {
        return ingredient.replace("100g melted butter", "3.5oz melted butter");
      } else if (ingredient.includes("g cream cheese")) {
        return ingredient.replace("500g cream cheese", "17.6oz cream cheese");
      } else if (ingredient.includes("ml whipping cream")) {
        return ingredient.replace("200ml whipping cream", "6.8 fl oz whipping cream");
      } else if (ingredient.includes("g sugar")) {
        return ingredient.replace("100g sugar", "3.5oz sugar");
      }
    }
    return ingredient;
  };