import { useEffect, useState } from "react"
import axiosInstance from "../utils/axiosConfig"
import { useDispatch } from "react-redux"
import { addUser, removeUser } from '../utils/slices'
import { Link, useNavigate } from "react-router-dom"
import { removeFeed } from "../utils/feedSlices"
import { persistor } from "../utils/appStore"
import { FaRegEye } from "react-icons/fa"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const userDispatch = useDispatch()
  const feedNavigate = useNavigate()
  const [error, setError] = useState("")
  const [eye, setEye] = useState(false)
  const handleLoginButton = async () => {
    try {
      const res = await axiosInstance.post("/login",
        {
          email, password
        })
      userDispatch(addUser(res.data.data))

      feedNavigate('/feed')
    }
    catch (err) {
      setError(err?.response?.data || "Some credentials is wrong!!")
    }
  }
  useEffect(() => {
    userDispatch(removeUser())
    userDispatch(removeFeed())
    persistor.purge()
  }, [])
  return (
    <div className="flex justify-center my-5">
      <div className="card card-border bg-base-300 w-96">
        <div className="card-body">
          <h2 className="card-title justify-center">Login</h2>
          <div className="">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email :</legend>
              <input type="text"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} className="input" />
            </fieldset>
          </div>
          <div className="my-1">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Password :</legend>
              <div className="relative">
                <input
                  type={eye ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input "
                />

                <FaRegEye
                  size={22}
                  onClick={() => {
                    setEye(true)
                    setTimeout(() => {
                      setEye(false)
                    }, 1500)
                  }}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500" />
              </div>
            </fieldset>
          </div>
          <p className="text-red-500">{error}</p>
          <div className="card-actions justify-center">
            <button className="btn btn-primary"
              onClick={handleLoginButton}>login</button>
          </div>
          <p className="text-center my-2">Don't have an account? <Link to="/signup" className="link link-primary">Sign In</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Login