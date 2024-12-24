import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { Routes as AppRoutes } from './types/routes';
import { lazy, Suspense } from 'react';

// Lazy load our main components
const Home = lazy(() => import('./pages/Home'));
const Quests = lazy(() => import('./pages/Quests'));
const Skills = lazy(() => import('./pages/Skills'));
const Map = lazy(() => import('./pages/Map'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Habits = lazy(() => import('./pages/Habits'));
const Journal = lazy(() => import('./pages/Journal'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path={AppRoutes.HOME} element={<Home />} />
            <Route path={AppRoutes.QUESTS} element={<Quests />} />
            <Route path={AppRoutes.SKILLS} element={<Skills />} />
            <Route path={AppRoutes.MAP} element={<Map />} />
            <Route path={AppRoutes.TASKS} element={<Tasks />} />
            <Route path={AppRoutes.HABITS} element={<Habits />} />
            <Route path={AppRoutes.JOURNAL} element={<Journal />} />
            <Route path={AppRoutes.ACHIEVEMENTS} element={<Achievements />} />
            <Route path={AppRoutes.PROFILE} element={<Profile />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
