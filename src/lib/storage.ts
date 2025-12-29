/**
 * Safe localStorage wrapper with error handling
 * Handles cases where localStorage is disabled, quota exceeded, or private browsing
 */

import { logger } from './logger'

// In-memory fallback when localStorage is unavailable
const memoryStorage: Map<string, string> = new Map()

let localStorageAvailable: boolean | null = null

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  if (localStorageAvailable !== null) return localStorageAvailable

  try {
    const testKey = '__storage_test__'
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    localStorageAvailable = true
  } catch {
    localStorageAvailable = false
  }

  return localStorageAvailable
}

/**
 * Safely get an item from storage
 */
export function getStorageItem(key: string): string | null {
  try {
    if (isLocalStorageAvailable()) {
      return localStorage.getItem(key)
    }
    return memoryStorage.get(key) ?? null
  } catch (error) {
    logger.warn(`Failed to get storage item "${key}":`, error)
    return memoryStorage.get(key) ?? null
  }
}

/**
 * Safely set an item in storage
 */
export function setStorageItem(key: string, value: string): boolean {
  try {
    if (isLocalStorageAvailable()) {
      localStorage.setItem(key, value)
    }
    memoryStorage.set(key, value)
    return true
  } catch (error) {
    logger.warn(`Failed to set storage item "${key}":`, error)
    // Fallback to memory storage
    memoryStorage.set(key, value)
    return false
  }
}

/**
 * Safely remove an item from storage
 */
export function removeStorageItem(key: string): boolean {
  try {
    if (isLocalStorageAvailable()) {
      localStorage.removeItem(key)
    }
    memoryStorage.delete(key)
    return true
  } catch (error) {
    logger.warn(`Failed to remove storage item "${key}":`, error)
    memoryStorage.delete(key)
    return false
  }
}

/**
 * Safely get and parse JSON from storage
 */
export function getStorageJSON<T>(key: string, defaultValue: T): T {
  const item = getStorageItem(key)
  if (item === null) return defaultValue

  try {
    return JSON.parse(item) as T
  } catch (error) {
    logger.warn(`Failed to parse storage JSON for "${key}":`, error)
    return defaultValue
  }
}

/**
 * Safely stringify and set JSON in storage
 */
export function setStorageJSON<T>(key: string, value: T): boolean {
  try {
    return setStorageItem(key, JSON.stringify(value))
  } catch (error) {
    logger.warn(`Failed to stringify value for "${key}":`, error)
    return false
  }
}
