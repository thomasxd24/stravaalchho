import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { loadData, saveData } from '../lib/storage'
import type { AppData, Comment, EventItem, Session, UserProfile } from '../types'
import { uid } from '../lib/format'

const DEFAULT_PROFILE: UserProfile = {
  id: 'me',
  name: 'Toi',
  handle: '@moi',
  avatarEmoji: '🦄',
  weightKg: 70,
  sex: 'male',
  unit: 'metric',
  connectedInstagram: false,
  connectedTiktok: false,
  bio: 'Nouveau·elle sur Achcool 🍻',
}

const DEFAULT_DATA: AppData = {
  profile: DEFAULT_PROFILE,
  sessions: [],
  events: [],
}

interface Store {
  data: AppData
  addSession: (session: Session) => void
  updateSession: (id: string, patch: Partial<Session>) => void
  deleteSession: (id: string) => void
  toggleKudos: (sessionId: string) => void
  addComment: (sessionId: string, text: string) => void
  updateProfile: (patch: Partial<UserProfile>) => void
  addEvent: (event: EventItem) => void
  toggleAttend: (eventId: string) => void
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData() ?? DEFAULT_DATA)

  useEffect(() => {
    saveData(data)
  }, [data])

  const store = useMemo<Store>(
    () => ({
      data,
      addSession: (session) => setData((d) => ({ ...d, sessions: [session, ...d.sessions] })),
      updateSession: (id, patch) =>
        setData((d) => ({
          ...d,
          sessions: d.sessions.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        })),
      deleteSession: (id) =>
        setData((d) => ({ ...d, sessions: d.sessions.filter((s) => s.id !== id) })),
      toggleKudos: (sessionId) =>
        setData((d) => ({
          ...d,
          sessions: d.sessions.map((s) => {
            if (s.id !== sessionId) return s
            const has = s.kudos.includes('me')
            return { ...s, kudos: has ? s.kudos.filter((k) => k !== 'me') : [...s.kudos, 'me'] }
          }),
        })),
      addComment: (sessionId, text) =>
        setData((d) => ({
          ...d,
          sessions: d.sessions.map((s) => {
            if (s.id !== sessionId) return s
            const comment: Comment = { id: uid(), authorId: 'me', text, at: new Date().toISOString() }
            return { ...s, comments: [...s.comments, comment] }
          }),
        })),
      updateProfile: (patch) => setData((d) => ({ ...d, profile: { ...d.profile, ...patch } })),
      addEvent: (event) => setData((d) => ({ ...d, events: [event, ...d.events] })),
      toggleAttend: (eventId) =>
        setData((d) => ({
          ...d,
          events: d.events.map((e) => {
            if (e.id !== eventId) return e
            const going = e.attendees.includes('me')
            return {
              ...e,
              attendees: going ? e.attendees.filter((a) => a !== 'me') : [...e.attendees, 'me'],
            }
          }),
        })),
    }),
    [data],
  )

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export function useStore(): Store {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
