// lib/recipes/storage.ts
import { STORAGE_KEYS } from "./constants";

/**
 * ดึงรายการโปรดจาก localStorage
 */
export const getFavoriteIds = (): number[] => {
  try {
    const savedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (savedFavorites) {
      return JSON.parse(savedFavorites);
    }
  } catch (error) {
    console.error("Error reading favorites from localStorage:", error);
  }
  
  return [];
};

/**
 * บันทึกรายการโปรดลง localStorage
 */
export const saveFavoriteIds = (ids: number[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(ids));
    return true;
  } catch (error) {
    console.error("Error saving favorites to localStorage:", error);
    return false;
  }
};

/**
 * บันทึกค่าใน localStorage
 */
export const saveToStorage = <T>(key: string, data: T): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving data to localStorage with key ${key}:`, error);
    return false;
  }
};

/**
 * ดึงค่าจาก localStorage
 */
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved) as T;
    }
  } catch (error) {
    console.error(`Error reading data from localStorage with key ${key}:`, error);
  }
  
  return defaultValue;
};

/**
 * บันทึกคำค้นหาล่าสุดลง localStorage
 */
export const saveRecentSearch = (search: string): string[] => {
  const recentSearches = getRecentSearches();
  
  // ป้องกันค่าซ้ำ
  if (!recentSearches.includes(search)) {
    recentSearches.unshift(search);
    
    // จำกัดจำนวนคำค้นหาล่าสุด (เก็บเพียง 10 รายการ)
    const trimmedSearches = recentSearches.slice(0, 10);
    
    saveToStorage(STORAGE_KEYS.RECENT_SEARCHES, trimmedSearches);
    return trimmedSearches;
  }
  
  return recentSearches;
};

/**
 * ดึงคำค้นหาล่าสุดจาก localStorage
 */
export const getRecentSearches = (): string[] => {
  return getFromStorage<string[]>(STORAGE_KEYS.RECENT_SEARCHES, []);
};

/**
 * บันทึกค่ากำหนดของผู้ใช้
 */
export const saveUserPreferences = (preferences: Record<string, any>): boolean => {
  return saveToStorage(STORAGE_KEYS.USER_PREFERENCES, preferences);
};

/**
 * ดึงค่ากำหนดของผู้ใช้
 */
export const getUserPreferences = (): Record<string, any> => {
  return getFromStorage(STORAGE_KEYS.USER_PREFERENCES, {});
};

export default {
  getFavoriteIds,
  saveFavoriteIds,
  saveToStorage,
  getFromStorage,
  saveRecentSearch,
  getRecentSearches,
  saveUserPreferences,
  getUserPreferences
};