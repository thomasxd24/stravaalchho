export type DrinkType =
  | 'beer'
  | 'wine'
  | 'cocktail'
  | 'shot'
  | 'cider'
  | 'seltzer'
  | 'champagne'
  | 'water'
  | 'other'

export interface DrinkPreset {
  type: DrinkType
  label: string
  emoji: string
  defaultVolumeMl: number
  defaultAbv: number
}

export interface DrinkEntry {
  id: string
  type: DrinkType
  label: string
  emoji: string
  volumeMl: number
  abv: number
  at: string // ISO timestamp
}

export interface Comment {
  id: string
  authorId: string
  text: string
  at: string
}

export interface Session {
  id: string
  userId: string
  title: string
  locationName: string
  startedAt: string
  endedAt: string
  drinks: DrinkEntry[]
  photoUrl?: string
  notes?: string
  kudos: string[]
  comments: Comment[]
  eventId?: string
}

export type Sex = 'male' | 'female'

export interface UserProfile {
  id: string
  name: string
  handle: string
  avatarEmoji: string
  weightKg: number
  sex: Sex
  unit: 'metric' | 'imperial'
  connectedInstagram: boolean
  connectedTiktok: boolean
  bio: string
}

export interface EventItem {
  id: string
  title: string
  date: string
  locationName: string
  description: string
  emoji: string
  attendees: string[]
  createdBy: string
}

export interface AppData {
  profile: UserProfile
  sessions: Session[]
  events: EventItem[]
}
