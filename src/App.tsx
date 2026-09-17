import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './state/store'
import { AppShell } from './components/AppShell'
import { Landing } from './pages/Landing'
import { Feed } from './pages/Feed'
import { LogSession } from './pages/LogSession'
import { SessionDetail } from './pages/SessionDetail'
import { Events } from './pages/Events'
import { EventDetail } from './pages/EventDetail'
import { Stats } from './pages/Stats'
import { Profile } from './pages/Profile'
import { Safety } from './pages/Safety'

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<AppShell />}>
            <Route path="/app" element={<Feed />} />
            <Route path="/app/new" element={<LogSession />} />
            <Route path="/app/events" element={<Events />} />
            <Route path="/app/events/:id" element={<EventDetail />} />
            <Route path="/app/stats" element={<Stats />} />
            <Route path="/app/profile" element={<Profile />} />
            <Route path="/app/safety" element={<Safety />} />
            <Route path="/session/:id" element={<SessionDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}
