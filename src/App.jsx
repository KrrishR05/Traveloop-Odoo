import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// Existing pages
import Dashboard      from './pages/Dashboard';
import Login          from './pages/Login';
import Register       from './pages/Register';

// Module 2 pages
import CreateTrip     from './pages/CreateTrip';
import BuildItinerary from './pages/BuildItinerary';
import ItineraryView  from './pages/ItineraryView';
import ActivitySearch from './pages/ActivitySearch';
import CitySearch     from './pages/CitySearch';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes (no Navbar) */}
        <Route path="/login"    element={<Login />}    />
        <Route path="/register" element={<Register />} />

        {/* App routes (with Navbar via MainLayout) */}
        <Route element={<MainLayout />}>
          <Route path="/"                         element={<Dashboard />}      />
          <Route path="/trips/create"             element={<CreateTrip />}     />
          <Route path="/trips/:tripId/itinerary"  element={<BuildItinerary />} />
          <Route path="/trips/:tripId/view"       element={<ItineraryView />}  />
          <Route path="/activities/search"        element={<ActivitySearch />} />
          <Route path="/cities/search"            element={<CitySearch />}     />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
