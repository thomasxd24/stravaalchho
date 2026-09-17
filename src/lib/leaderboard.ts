import type { EventItem, Session } from '../types'

export interface LeaderboardEntry {
  userId: string
  score: number
  waterCount: number
  safeRideCount: number
  eventsAttended: number
  varietyCount: number
}

/**
 * Deliberately rewards moderation and reliability, not volume consumed or peak BAC:
 * hydrating between drinks, always getting home safely, showing up to events, and
 * trying different things — never "who drank the most".
 */
export function computeLeaderboard(sessions: Session[], events: EventItem[]): LeaderboardEntry[] {
  const userIds = Array.from(new Set(sessions.map((s) => s.userId)))
  return userIds
    .map((userId) => {
      const mine = sessions.filter((s) => s.userId === userId)
      const waterCount = mine.reduce((sum, s) => sum + s.drinks.filter((d) => d.type === 'water').length, 0)
      const safeRideCount = mine.filter((s) => s.safeRideHome).length
      const eventsAttended = events.filter((e) => e.attendees.includes(userId)).length
      const varietyTypes = new Set(mine.flatMap((s) => s.drinks.filter((d) => d.type !== 'water').map((d) => d.type)))
      const varietyCount = Math.min(varietyTypes.size, 5)
      const score = waterCount * 2 + safeRideCount * 5 + eventsAttended * 3 + varietyCount * 1
      return { userId, score, waterCount, safeRideCount, eventsAttended, varietyCount }
    })
    .sort((a, b) => b.score - a.score)
}
