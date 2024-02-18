import React, { useContext, useState } from "react"
import { UserContext } from "../context/UserContext"
import { Navigate, useParams } from "react-router-dom"
import axios from "axios"
import PlacesPage from "./PlacesPage"
import AccountNav from "../components/AccountNav"

const ProfilePage = () => {
  const [redirect, setRedirect] = useState(null)
  const { user, ready, setUser } = useContext(UserContext)
  let { subpage } = useParams()
  if (subpage === undefined) {
    subpage = "profile"
  }
  if (!ready) {
    return "Loading..."
  }
  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />
  }

  async function logout() {
    await axios.post("/logout")
    setRedirect("/")
    setUser(null)
  }

  if (redirect) {
    return <Navigate to={redirect} />
  }

  return (
    <>
      <AccountNav />
      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email})<br />
          <button onClick={logout} className="primary max-w-sm mt-2">
            Logout
          </button>
        </div>
      )}
      {subpage === "places" && <PlacesPage />}
    </>
  )
}

export default ProfilePage
//user?.name will wait until user is ready then display name other wise it will be an error as user is empty. or jab tak ready na ho Loading.. dikha do
