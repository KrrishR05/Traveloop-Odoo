import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Existing pages
import Dashboard      from './pages/Dashboard';
import Login          from './pages/Login';
import Register       from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// Module 2 pages
import CreateTrip     from './pages/CreateTrip';
import BuildItinerary from './pages/BuildItinerary';
import ItineraryView  from './pages/ItineraryView';
import ActivitySearch from './pages/ActivitySearch';
import CitySearch     from './pages/CitySearch';

// Module 3 pages
import MyTrips          from './pages/MyTrips';
import UserProfile      from './pages/UserProfile';
import Community        from './pages/Community';
import TripJournal      from './pages/TripJournal';
import SharedItinerary  from './pages/SharedItinerary';

// Module 4 pages
import BudgetBreakdown    from './pages/BudgetBreakdown';
import PackingChecklist   from './pages/PackingChecklist';
import AnalyticsDashboard from './pages/AnalyticsDashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth routes (no Navbar, no protection) */}
          <Route path="/login"           element={<Login />}          />
          <Route path="/register"        element={<Register />}       />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* App routes (with Navbar via MainLayout, protected) */}
          <Route element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            {/* Core */}
            <Route path="/"                         element={<Dashboard />}      />
            <Route path="/trips/create"             element={<CreateTrip />}     />
            <Route path="/trips/:tripId/itinerary"  element={<BuildItinerary />} />
            <Route path="/trips/:tripId/view"       element={<ItineraryView />}  />
            <Route path="/activities/search"        element={<ActivitySearch />} />
            <Route path="/cities/search"            element={<CitySearch />}     />

            {/* Module 3 */}
            <Route path="/my-trips"                 element={<MyTrips />}         />
            <Route path="/profile"                  element={<UserProfile />}     />
            <Route path="/community"                element={<Community />}       />
            <Route path="/journal"                  element={<TripJournal />}     />
            <Route path="/shared/:id"               element={<SharedItinerary />} />
            <Route path="/shared-itineraries"       element={<Community />}       />

            {/* Module 4 */}
            <Route path="/budget"                   element={<BudgetBreakdown />}    />
            <Route path="/checklist"                element={<PackingChecklist />}   />
            <Route path="/analytics"                element={<AnalyticsDashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
