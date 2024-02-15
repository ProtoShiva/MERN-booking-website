import React, { useContext, useState } from "react"
import { UserContext } from "../context/UserContext"
import { Navigate, Link, useParams } from "react-router-dom"
import axios from "axios"

const AccountPage = () => {
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
  function linkClasses(type = null) {
    let classes = "inline-flex gap-1 py-2 px-6 rounded-full"
    if (type === subpage) {
      classes += " bg-primary text-white"
    } else {
      classes += " bg-gray-200"
    }
    return classes
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
      <nav className="w-full flex justify-center mt-8 gap-4">
        <Link className={linkClasses("profile")} to={"/account"}>
          My Profile
        </Link>
        <Link className={linkClasses("bookings")} to={"/account/bookings"}>
          My Bookings
        </Link>
        <Link className={linkClasses("places")} to={"/account/places"}>
          My Accomodations
        </Link>
      </nav>
      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email})<br />
          <button onClick={logout} className="primary max-w-sm mt-2">
            Logout
          </button>
        </div>
      )}
    </>
  )
}

export default AccountPage
//user?.name will wait until user is ready then display name other wise it will be an error as user is empty. or jab tak ready na ho Loading.. dikha do
