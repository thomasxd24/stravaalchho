import type { DrinkEntry, Sex } from '../types'

const ETHANOL_DENSITY_G_PER_ML = 0.789
const ELIMINATION_RATE_PER_HOUR = 0.015 // % BAC burned off per hour, average adult
const DISTRIBUTION_RATIO: Record<Sex, number> = {
  male: 0.68,
  female: 0.55,
}

export const STANDARD_DRINK_GRAMS = 14 // grams of pure alcohol in one "standard drink" (US reference)

export function gramsOfAlcohol(drink: Pick<DrinkEntry, 'volumeMl' | 'abv'>): number {
  return drink.volumeMl * (drink.abv / 100) * ETHANOL_DENSITY_G_PER_ML
}

export function standardDrinks(drink: Pick<DrinkEntry, 'volumeMl' | 'abv'>): number {
  return gramsOfAlcohol(drink) / STANDARD_DRINK_GRAMS
}

export interface BacPoint {
  t: number // minutes since session start
  bac: number // percent, e.g. 0.08
}

/**
 * Widmark-formula estimate. For entertainment / self-tracking only —
 * not a breathalyzer substitute and never a basis for deciding to drive.
 */
export function computeBacCurve(
  drinks: DrinkEntry[],
  weightKg: number,
  sex: Sex,
  startedAt: string,
  endTimeOverride?: string,
): BacPoint[] {
  const alcoholDrinks = drinks.filter((d) => d.type !== 'water')
  if (alcoholDrinks.length === 0) return [{ t: 0, bac: 0 }]

  const weightG = weightKg * 1000
  const r = DISTRIBUTION_RATIO[sex]
  const start = new Date(startedAt).getTime()
  const end = endTimeOverride ? new Date(endTimeOverride).getTime() : Date.now()
  const lastDrinkTime = Math.max(...alcoholDrinks.map((d) => new Date(d.at).getTime()))
  const horizon = Math.max(end, lastDrinkTime + 3 * 60 * 60 * 1000)

  const totalMinutes = Math.max(30, Math.round((horizon - start) / 60000))
  const stepMinutes = totalMinutes > 12 * 60 ? 15 : 5
  const points: BacPoint[] = []

  for (let t = 0; t <= totalMinutes; t += stepMinutes) {
    const nowMs = start + t * 60000
    let totalGrams = 0
    for (const d of alcoholDrinks) {
      const dTime = new Date(d.at).getTime()
      if (dTime <= nowMs) totalGrams += gramsOfAlcohol(d)
    }
    const hoursElapsed = t / 60
    const raw = (totalGrams * 100) / (weightG * r) - ELIMINATION_RATE_PER_HOUR * hoursElapsed
    points.push({ t, bac: Math.max(0, raw) })
  }

  return points
}

export function currentBac(
  drinks: DrinkEntry[],
  weightKg: number,
  sex: Sex,
  startedAt: string,
): number {
  const curve = computeBacCurve(drinks, weightKg, sex, startedAt)
  const nowMinutes = (Date.now() - new Date(startedAt).getTime()) / 60000
  let closest = curve[0]
  for (const p of curve) {
    if (p.t <= nowMinutes) closest = p
  }
  return closest?.bac ?? 0
}

export function peakBac(curve: BacPoint[]): number {
  return curve.reduce((max, p) => Math.max(max, p.bac), 0)
}

export type BacZone = 'sober' | 'buzzed' | 'high' | 'danger'

export function bacZone(bac: number): BacZone {
  if (bac < 0.02) return 'sober'
  if (bac < 0.05) return 'buzzed'
  if (bac < 0.08) return 'high'
  return 'danger'
}

export const bacZoneMeta: Record<BacZone, { label: string; color: string; message: string }> = {
  sober: {
    label: 'Sober',
    color: '#22c55e',
    message: 'Clear-headed.',
  },
  buzzed: {
    label: 'Buzzed',
    color: '#eab308',
    message: 'Feeling it. Pace yourself and drink water.',
  },
  high: {
    label: 'Impaired',
    color: '#f97316',
    message: 'You are legally impaired in most places. Do not drive. Get a ride home.',
  },
  danger: {
    label: 'High risk',
    color: '#ef4444',
    message: 'High BAC — real health risk. Stop drinking, hydrate, stay with friends, seek help if unwell.',
  },
}

export function hoursUntilSober(currentBacValue: number): number {
  if (currentBacValue <= 0) return 0
  return currentBacValue / ELIMINATION_RATE_PER_HOUR
}
