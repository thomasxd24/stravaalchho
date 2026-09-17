import type { DrinkPreset } from '../types'

export const DRINK_PRESETS: DrinkPreset[] = [
  { type: 'beer', label: 'Bière', emoji: '🍺', defaultVolumeMl: 330, defaultAbv: 5 },
  { type: 'wine', label: 'Vin', emoji: '🍷', defaultVolumeMl: 150, defaultAbv: 12.5 },
  { type: 'champagne', label: 'Champagne', emoji: '🥂', defaultVolumeMl: 120, defaultAbv: 12 },
  { type: 'cocktail', label: 'Cocktail', emoji: '🍹', defaultVolumeMl: 200, defaultAbv: 15 },
  { type: 'shot', label: 'Shot', emoji: '🥃', defaultVolumeMl: 40, defaultAbv: 40 },
  { type: 'cider', label: 'Cidre', emoji: '🍎', defaultVolumeMl: 330, defaultAbv: 4.5 },
  { type: 'seltzer', label: 'Seltzer', emoji: '🥫', defaultVolumeMl: 330, defaultAbv: 5 },
  { type: 'water', label: 'Eau', emoji: '💧', defaultVolumeMl: 330, defaultAbv: 0 },
  { type: 'other', label: 'Autre', emoji: '🍸', defaultVolumeMl: 250, defaultAbv: 10 },
]

export function presetFor(type: string): DrinkPreset {
  return DRINK_PRESETS.find((p) => p.type === type) ?? DRINK_PRESETS[DRINK_PRESETS.length - 1]
}
