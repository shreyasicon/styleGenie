// Cache utility for managing temporary storage of images and combinations

export interface CachedImage {
  preview: string // base64 data URL
  timestamp: number
}

export interface CachedWardrobe {
  shirts: CachedImage[]
  pants: CachedImage[]
  shoes: CachedImage[]
  addons: CachedImage[]
  timestamp: number
}

export interface CachedCombination {
  shirt: {
    type: string
    color: string
    styleTags: string[]
    image: string
  }
  pant: {
    type: string
    color: string
    styleTags: string[]
    image: string
  }
  shoe: {
    type: string
    color: string
    styleTags: string[]
    image: string
  }
  addon: {
    type: string
    color: string
    styleTags: string[]
    image: string
  }
  preferences: {
    country?: string
    eventType?: string
    specifications?: string
  }
  timestamp: number
}

const CACHE_KEYS = {
  WARDROBE: "stylegenie_wardrobe",
  COMBINATION: "stylegenie_combination",
  HISTORY: "stylegenie_history",
} as const

const CACHE_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

// Check if cache is expired
function isCacheExpired(timestamp: number): boolean {
  return Date.now() - timestamp > CACHE_EXPIRY
}

// Save wardrobe (all uploaded images)
export function saveWardrobe(
  shirts: Array<{ preview: string }>,
  pants: Array<{ preview: string }>,
  shoes: Array<{ preview: string }>,
  addons: Array<{ preview: string }>,
): void {
  try {
    const wardrobe: CachedWardrobe = {
      shirts: shirts.map((s) => ({ preview: s.preview, timestamp: Date.now() })),
      pants: pants.map((p) => ({ preview: p.preview, timestamp: Date.now() })),
      shoes: shoes.map((s) => ({ preview: s.preview, timestamp: Date.now() })),
      addons: addons.map((a) => ({ preview: a.preview, timestamp: Date.now() })),
      timestamp: Date.now(),
    }
    sessionStorage.setItem(CACHE_KEYS.WARDROBE, JSON.stringify(wardrobe))
    console.log("[v0] Wardrobe cached:", {
      shirts: shirts.length,
      pants: pants.length,
      shoes: shoes.length,
      addons: addons.length,
    })
  } catch (error) {
    console.error("[v0] Error caching wardrobe:", error)
  }
}

// Load wardrobe (all uploaded images)
export function loadWardrobe(): CachedWardrobe | null {
  try {
    const cached = sessionStorage.getItem(CACHE_KEYS.WARDROBE)
    if (!cached) return null

    const wardrobe: CachedWardrobe = JSON.parse(cached)

    // Check if cache is expired
    if (isCacheExpired(wardrobe.timestamp)) {
      console.log("[v0] Wardrobe cache expired, clearing...")
      clearWardrobe()
      return null
    }

    console.log("[v0] Wardrobe loaded from cache:", {
      shirts: wardrobe.shirts.length,
      pants: wardrobe.pants.length,
      shoes: wardrobe.shoes.length,
      addons: wardrobe.addons.length,
    })
    return wardrobe
  } catch (error) {
    console.error("[v0] Error loading wardrobe:", error)
    return null
  }
}

// Clear wardrobe cache
export function clearWardrobe(): void {
  sessionStorage.removeItem(CACHE_KEYS.WARDROBE)
  console.log("[v0] Wardrobe cache cleared")
}

// Save combination
export function saveCombination(combination: Omit<CachedCombination, "timestamp">): void {
  try {
    const cached: CachedCombination = {
      ...combination,
      timestamp: Date.now(),
    }
    sessionStorage.setItem(CACHE_KEYS.COMBINATION, JSON.stringify(cached))

    // Also add to history
    addToHistory(cached)

    console.log("[v0] Combination cached")
  } catch (error) {
    console.error("[v0] Error caching combination:", error)
  }
}

// Load combination
export function loadCombination(): CachedCombination | null {
  try {
    const cached = sessionStorage.getItem(CACHE_KEYS.COMBINATION)
    if (!cached) return null

    const combination: CachedCombination = JSON.parse(cached)

    // Check if cache is expired
    if (isCacheExpired(combination.timestamp)) {
      console.log("[v0] Combination cache expired, clearing...")
      clearCombination()
      return null
    }

    console.log("[v0] Combination loaded from cache")
    return combination
  } catch (error) {
    console.error("[v0] Error loading combination:", error)
    return null
  }
}

// Clear combination cache
export function clearCombination(): void {
  sessionStorage.removeItem(CACHE_KEYS.COMBINATION)
  console.log("[v0] Combination cache cleared")
}

// Add combination to history (for "Try Another" feature)
function addToHistory(combination: CachedCombination): void {
  try {
    const cached = sessionStorage.getItem(CACHE_KEYS.HISTORY)
    const history: CachedCombination[] = cached ? JSON.parse(cached) : []

    // Keep only last 10 combinations
    history.unshift(combination)
    if (history.length > 10) {
      history.pop()
    }

    sessionStorage.setItem(CACHE_KEYS.HISTORY, JSON.stringify(history))
    console.log("[v0] Added to history, total:", history.length)
  } catch (error) {
    console.error("[v0] Error adding to history:", error)
  }
}

// Get combination history
export function getCombinationHistory(): CachedCombination[] {
  try {
    const cached = sessionStorage.getItem(CACHE_KEYS.HISTORY)
    if (!cached) return []

    const history: CachedCombination[] = JSON.parse(cached)

    // Filter out expired combinations
    const validHistory = history.filter((c) => !isCacheExpired(c.timestamp))

    if (validHistory.length !== history.length) {
      sessionStorage.setItem(CACHE_KEYS.HISTORY, JSON.stringify(validHistory))
    }

    return validHistory
  } catch (error) {
    console.error("[v0] Error loading history:", error)
    return []
  }
}

// Clear all caches
export function clearAllCaches(): void {
  clearWardrobe()
  clearCombination()
  sessionStorage.removeItem(CACHE_KEYS.HISTORY)
  console.log("[v0] All caches cleared")
}
