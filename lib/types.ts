export interface DetectionResult {
  type: string
  color: string
  styleTags: string[]
  image: string
}

export interface GarmentItem extends DetectionResult {
  id: string
}

export interface OutfitCombination {
  id: string
  title: string
  description: string
  garments: GarmentItem[]
  compatibilityScore: number
  reasoning: string
}

export interface OutfitPiece {
  item: string
  color: string
}

export interface OutfitSuggestion {
  title: string
  description: string
  pieces: OutfitPiece[]
  mockupImage: string
}

export interface SavedLook {
  id: string
  garmentImage: string
  garmentType: string
  garmentColor: string
  suggestion: OutfitSuggestion
  savedAt: string
}
