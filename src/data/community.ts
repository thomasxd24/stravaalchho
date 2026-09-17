import type { DrinkEntry, EventItem, Session, UserProfile } from '../types'
import { presetFor } from './drinkPresets'

export type CommunityUser = Pick<UserProfile, 'id' | 'name' | 'handle' | 'avatarEmoji'>

export const COMMUNITY_USERS: CommunityUser[] = [
  { id: 'u-lea', name: 'Léa Fontaine', handle: '@lea.fon', avatarEmoji: '🐝' },
  { id: 'u-max', name: 'Maxime Roy', handle: '@maxroy', avatarEmoji: '🦊' },
  { id: 'u-ines', name: 'Inès Caron', handle: '@ines.c', avatarEmoji: '🌸' },
  { id: 'u-theo', name: 'Théo Blanc', handle: '@theoblanc', avatarEmoji: '🐺' },
  { id: 'u-sarah', name: 'Sarah Nguyen', handle: '@sarahn', avatarEmoji: '🍀' },
]

function drink(type: DrinkEntry['type'], hoursFromStart: number, startIso: string, qty = 1): DrinkEntry {
  const preset = presetFor(type)
  const at = new Date(new Date(startIso).getTime() + hoursFromStart * 3600 * 1000).toISOString()
  return {
    id: `${type}-${hoursFromStart}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    label: preset.label,
    emoji: preset.emoji,
    volumeMl: preset.defaultVolumeMl * qty,
    abv: preset.defaultAbv,
    at,
  }
}

function hoursAgoIso(h: number): string {
  return new Date(Date.now() - h * 3600 * 1000).toISOString()
}

function buildSession(
  id: string,
  userId: string,
  title: string,
  locationName: string,
  startedHoursAgo: number,
  durationHours: number,
  drinksSpec: Array<[DrinkEntry['type'], number]>,
  kudos: string[],
  comments: Array<{ authorId: string; text: string }>,
  photoEmoji?: string,
  eventId?: string,
): Session {
  const startedAt = hoursAgoIso(startedHoursAgo)
  const endedAt = new Date(new Date(startedAt).getTime() + durationHours * 3600 * 1000).toISOString()
  const drinks = drinksSpec.map(([type, h]) => drink(type, h, startedAt))
  return {
    id,
    userId,
    title,
    locationName,
    startedAt,
    endedAt,
    drinks,
    photoUrl: photoEmoji,
    kudos,
    comments: comments.map((c, i) => ({
      id: `${id}-c${i}`,
      authorId: c.authorId,
      text: c.text,
      at: endedAt,
    })),
    eventId,
  }
}

export const COMMUNITY_SESSIONS: Session[] = [
  buildSession(
    's-lea-1',
    'u-lea',
    'Afterwork terrasse',
    'Le Perchoir, Paris',
    20,
    3,
    [
      ['cocktail', 0],
      ['cocktail', 1.2],
      ['water', 1.5],
      ['cocktail', 2.4],
    ],
    ['u-max', 'u-ines'],
    [{ authorId: 'u-max', text: 'Le spritz avait l’air incroyable 🍹' }],
    '🌇',
  ),
  buildSession(
    's-max-1',
    'u-max',
    'Soirée jeux de société',
    'Chez Théo',
    30,
    4,
    [
      ['beer', 0],
      ['beer', 1],
      ['beer', 2.5],
    ],
    ['u-lea', 'u-theo', 'u-sarah'],
    [{ authorId: 'u-theo', text: 'Revanche la semaine prochaine 😤' }],
    '🎲',
  ),
  buildSession(
    's-ines-1',
    'u-ines',
    'Dégustation vin nature',
    'Cave de la Butte',
    50,
    2.5,
    [
      ['wine', 0],
      ['wine', 1],
      ['water', 1.3],
      ['wine', 1.8],
    ],
    ['u-lea'],
    [],
    '🍷',
  ),
  buildSession(
    's-theo-1',
    'u-theo',
    'Anniversaire Sarah',
    'Le Comptoir Général',
    5,
    5,
    [
      ['shot', 0],
      ['cocktail', 0.5],
      ['cocktail', 2],
      ['water', 2.2],
      ['beer', 3.5],
    ],
    ['u-max', 'u-lea', 'u-ines', 'u-sarah'],
    [
      { authorId: 'u-sarah', text: 'Merci d’être venus tous 🥹' },
      { authorId: 'u-lea', text: 'Meilleure soirée du mois' },
    ],
    '🎉',
    'e-birthday',
  ),
  buildSession(
    's-sarah-1',
    'u-sarah',
    'Sober-ish brunch',
    'Café Oberkampf',
    75,
    2,
    [
      ['water', 0],
      ['wine', 0.5],
      ['water', 1],
    ],
    ['u-ines'],
    [{ authorId: 'u-ines', text: 'Bien joué pour l’hydratation 💧' }],
    '🥂',
  ),
]

export const COMMUNITY_EVENTS: EventItem[] = [
  {
    id: 'e-birthday',
    title: 'Anniversaire Sarah 🎂',
    date: hoursAgoIso(5),
    locationName: 'Le Comptoir Général, Paris',
    description: 'On fête les 27 ans de Sarah. Cocktails, gâteau, et beaucoup d’eau entre deux verres !',
    emoji: '🎉',
    attendees: ['u-theo', 'u-max', 'u-lea', 'u-ines', 'u-sarah'],
    createdBy: 'u-theo',
  },
  {
    id: 'e-crawl',
    title: 'Bar crawl Canal Saint-Martin',
    date: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
    locationName: 'Canal Saint-Martin, Paris',
    description: '5 bars, 5 spécialités locales. Rendez-vous 19h, navette + eau offerte à chaque étape.',
    emoji: '🍻',
    attendees: ['u-max', 'u-lea'],
    createdBy: 'u-max',
  },
  {
    id: 'e-wine',
    title: 'Wine & Cheese night',
    date: new Date(Date.now() + 6 * 24 * 3600 * 1000).toISOString(),
    locationName: 'Cave de la Butte',
    description: 'Dégustation de 6 vins nature avec accord fromages. Places limitées à 12.',
    emoji: '🧀',
    attendees: ['u-ines'],
    createdBy: 'u-ines',
  },
]

export function communityUser(userId: string): CommunityUser | undefined {
  return COMMUNITY_USERS.find((u) => u.id === userId)
}
