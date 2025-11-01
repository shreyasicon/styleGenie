import type { GarmentItem, OutfitCombination } from "./types"

/**
 * Combination matching engine
 * Analyzes multiple garments and suggests which items work well together
 */

// Color compatibility matrix (0-100 score)
const colorCompatibility: Record<string, Record<string, number>> = {
  white: { black: 100, navy: 95, gray: 90, blue: 85, red: 80, beige: 85, brown: 75 },
  black: { white: 100, gray: 90, red: 85, gold: 80, silver: 85, beige: 70 },
  blue: { white: 95, beige: 85, brown: 80, gray: 85, navy: 70, khaki: 75 },
  navy: { white: 95, beige: 90, khaki: 85, burgundy: 80, gray: 85, brown: 75 },
  red: { black: 90, white: 85, navy: 80, gray: 75, beige: 70 },
  green: { beige: 85, brown: 90, white: 80, navy: 75, khaki: 85 },
  yellow: { navy: 85, gray: 80, white: 85, blue: 75, black: 70 },
  pink: { gray: 85, white: 90, navy: 80, beige: 85, black: 75 },
  gray: { white: 90, black: 90, navy: 85, burgundy: 80, blue: 85, pink: 80 },
  brown: { beige: 95, white: 85, cream: 90, olive: 85, navy: 75 },
  beige: { white: 90, brown: 95, navy: 85, olive: 80, gray: 85 },
}

// Garment type compatibility (which items work together)
const typeCompatibility: Record<string, string[]> = {
  shirt: ["pants", "trousers", "jeans", "skirt", "shorts", "jacket", "blazer"],
  blouse: ["pants", "trousers", "jeans", "skirt", "shorts", "jacket", "blazer"],
  dress: ["jacket", "blazer", "cardigan", "coat"],
  pants: ["shirt", "blouse", "sweater", "jacket", "blazer", "tshirt", "top"],
  trousers: ["shirt", "blouse", "sweater", "jacket", "blazer", "tshirt", "top"],
  jeans: ["shirt", "blouse", "sweater", "jacket", "tshirt", "top", "hoodie"],
  skirt: ["shirt", "blouse", "sweater", "jacket", "blazer", "tshirt", "top"],
  jacket: ["shirt", "blouse", "pants", "jeans", "dress", "skirt", "tshirt"],
  blazer: ["shirt", "blouse", "pants", "trousers", "jeans", "skirt", "dress"],
  sweater: ["pants", "jeans", "skirt", "trousers"],
  tshirt: ["jeans", "pants", "shorts", "skirt", "jacket"],
  top: ["jeans", "pants", "shorts", "skirt", "jacket", "blazer"],
}

function getColorScore(color1: string, color2: string): number {
  const c1 = color1.toLowerCase()
  const c2 = color2.toLowerCase()

  // Check direct compatibility
  if (colorCompatibility[c1]?.[c2]) {
    return colorCompatibility[c1][c2]
  }
  if (colorCompatibility[c2]?.[c1]) {
    return colorCompatibility[c2][c1]
  }

  // Default neutral compatibility
  return 60
}

function getTypeScore(type1: string, type2: string): number {
  const t1 = type1.toLowerCase()
  const t2 = type2.toLowerCase()

  // Same type doesn't work together
  if (t1 === t2) return 0

  // Check if types are compatible
  if (typeCompatibility[t1]?.includes(t2)) return 100
  if (typeCompatibility[t2]?.includes(t1)) return 100

  // Unknown combination
  return 40
}

function calculateCompatibility(garment1: GarmentItem, garment2: GarmentItem): number {
  const colorScore = getColorScore(garment1.color, garment2.color)
  const typeScore = getTypeScore(garment1.type, garment2.type)

  // Weighted average: type compatibility is more important
  return Math.round(typeScore * 0.6 + colorScore * 0.4)
}

function generateReasoning(garments: GarmentItem[], score: number): string {
  if (score >= 85) {
    return "Excellent match! These pieces complement each other perfectly in both style and color."
  } else if (score >= 70) {
    return "Great combination! These items work well together and create a cohesive look."
  } else if (score >= 55) {
    return "Good pairing! This combination is versatile and can work for various occasions."
  } else {
    return "Interesting mix! This combination offers a unique style statement."
  }
}

export function findBestCombinations(garments: GarmentItem[]): OutfitCombination[] {
  if (garments.length < 2) {
    return []
  }

  const combinations: OutfitCombination[] = []

  // Generate 2-piece combinations
  for (let i = 0; i < garments.length; i++) {
    for (let j = i + 1; j < garments.length; j++) {
      const score = calculateCompatibility(garments[i], garments[j])

      combinations.push({
        id: `${garments[i].id}-${garments[j].id}`,
        title: `${garments[i].type} + ${garments[j].type}`,
        description: `${garments[i].color} ${garments[i].type} paired with ${garments[j].color} ${garments[j].type}`,
        garments: [garments[i], garments[j]],
        compatibilityScore: score,
        reasoning: generateReasoning([garments[i], garments[j]], score),
      })
    }
  }

  // Generate 3-piece combinations if we have enough items
  if (garments.length >= 3) {
    for (let i = 0; i < garments.length; i++) {
      for (let j = i + 1; j < garments.length; j++) {
        for (let k = j + 1; k < garments.length; k++) {
          const score1 = calculateCompatibility(garments[i], garments[j])
          const score2 = calculateCompatibility(garments[j], garments[k])
          const score3 = calculateCompatibility(garments[i], garments[k])
          const avgScore = Math.round((score1 + score2 + score3) / 3)

          combinations.push({
            id: `${garments[i].id}-${garments[j].id}-${garments[k].id}`,
            title: `${garments[i].type} + ${garments[j].type} + ${garments[k].type}`,
            description: `Complete outfit with ${garments[i].color} ${garments[i].type}, ${garments[j].color} ${garments[j].type}, and ${garments[k].color} ${garments[k].type}`,
            garments: [garments[i], garments[j], garments[k]],
            compatibilityScore: avgScore,
            reasoning: generateReasoning([garments[i], garments[j], garments[k]], avgScore),
          })
        }
      }
    }
  }

  // Sort by compatibility score and return top combinations
  return combinations.sort((a, b) => b.compatibilityScore - a.compatibilityScore).slice(0, 6) // Return top 6 combinations
}
