import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import HomePage from './pages/HomePage'
import TheaterPage from './pages/TheatersPage'
import ShowTimesPage from './pages/ShowTimesPage'
import ChooseSeatsPage from './pages/ChooseSeatsPage'
import FoodAndDrinksPage from './pages/FoodAndDrinksPage'
import FullMenuPage from './pages/FullMenuPage'
import AboutUsPage from './pages/AboutUsPage'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './Components/ProtectedRoute'
import './styles/App.css'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/theaters" element={<TheaterPage />} />
        <Route path="/showtimes" element={<ShowTimesPage />} />
        <Route path="/choose-seats" element={<ChooseSeatsPage />} />
        <Route path="/food-drinks" element={<FoodAndDrinksPage />} />
        <Route path="/full-menu" element={<FullMenuPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Example protected route */}
        <Route
          path="/secret-admin"
          element={
            <ProtectedRoute>
              <h1>Admin Only</h1>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App