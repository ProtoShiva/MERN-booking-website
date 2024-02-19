import { Route, Routes } from "react-router-dom"
import Header from "./components/Header"
import IndexPage from "./pages/IndexPage"
import LoginPage from "./pages/LoginPage"
import Layout from "./layout/Layout"
import RegisterPage from "./pages/RegisterPage"
import axios from "axios"
import { UserContextProvider } from "./context/UserContext"
import ProfilePage from "./pages/ProfilePage"
import PlacesPage from "./pages/PlacesPage"
import PlacesFormPages from "./pages/PlacesFormPages"
import PlacePage from "./pages/PlacePage"
import BookingPage from "./pages/BookingPage"
import BookingsPage from "./pages/BookingsPage"
axios.defaults.baseURL = "http://localhost:3000"
axios.defaults.withCredentials = true
function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/account/places" element={<PlacesPage />} />
          <Route path="/account/places/new" element={<PlacesFormPages />} />
          <Route path="/account/places/:id" element={<PlacesFormPages />} />
          <Route path="/place/:id" element={<PlacePage />} />
          <Route path="/account/bookings" element={<BookingsPage />} />
          <Route path="/account/bookings/:id" element={<BookingPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
