import axiosInstance from "../utils/axiosConfig"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { removeUser } from "../utils/slices"
import { removeConnections } from "../utils/connections"


const NavBar = () => {
  const userData = useSelector(state => state.user)
  const removeUserDispatch = useDispatch()
  const removeUserConnections = useDispatch()
  const navigate = useNavigate()
  const handleLogOut = async () => {
    try {
      await axiosInstance.post('/logout')
      removeUserDispatch(removeUser())
      removeUserConnections(removeConnections())
      navigate('/login')
    }
    catch (err) {
      console.error("ERROR : " + err)
    }
  }
  return (
    <div className="navbar bg-base-300 text-base-content shadow-sm">
      <div className="flex-1">
        <Link to={'/feed'} className="btn btn-ghost text-xl">DevTinder</Link>
      </div>
      {userData && (
        <div className="flex">
          <p className="m-2">Hello, {userData.firstName}</p>
          <div className="flex gap-2">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src={userData.profilepic} />
                </div>
              </div>
              <ul
                tabIndex="-1"
                className="menu menu-sm dropdown-content bg-base-300 rounded-box z-1 mt-4 w-52 p-2 shadow">
                <li>
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <Link to="/profile">Profile</Link>
                    </div>
                    <div>
                      <Link to="/editProfile" className="badge badge-sm">
                        Edit
                      </Link>
                    </div>
                  </div>
                </li>


                <li><Link to={'/connections'}>Connections</Link></li>
                <li><a onClick={handleLogOut}>Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NavBar