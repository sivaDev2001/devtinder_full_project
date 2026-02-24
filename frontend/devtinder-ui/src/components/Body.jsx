import { Outlet, useNavigate } from "react-router-dom"
import NavBar from "./NavBar"
import Footer from "./Footer"
import axiosInstance from "../utils/axiosConfig"
import { useDispatch, useSelector } from "react-redux"
import { addUser } from "../utils/slices"
import { useEffect } from "react"

const Body = () => {
  const profileDispatch = useDispatch()
  const userData = useSelector(state => state.user)
  const navigate = useNavigate()
  const fetchProfile = async () => {
    try {
      const user = await axiosInstance.get('/profile/view')
      profileDispatch(addUser(user.data))
    }
    catch (err) {
      if (err.status === 400 || 401) {
        navigate('/login')
      }
    }
  }
  useEffect(() => {
    fetchProfile()
  }, [])
  return (
    <>
      <div className=""> 
        <NavBar />
        <Outlet /> {/*to render all the child components  */}
        <Footer />
      </div>
    </>
  )
}

export default Body