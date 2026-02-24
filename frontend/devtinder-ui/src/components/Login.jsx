import { useState } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import {addUser} from '../utils/slices'
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../utils/constants"

const Login = () => {
  const [email, setEmail] = useState("kohli@gmail.com")
  const [password, setPassword] = useState("kohli@123")
  const userDispatch = useDispatch()
  const feedNavigate = useNavigate()
  const [error,setError] = useState("")
  const handleLoginButton = async () => {
    try {
      const res = await axios.post(BASE_URL+"/login",
        {
          email, password
        },
        {
          withCredentials: true
        })
        userDispatch(addUser(res.data.data))
        feedNavigate('/feed')
    }
    catch(err)
    {
      setError(err?.response?.data || "Some credentials is wrong!!")
    }
  }
  return (
    <div className="flex justify-center my-5">
      <div className="card card-border bg-base-300 w-96">
        <div className="card-body">
          <h2 className="card-title justify-center">Login</h2>
          <div className="">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email</legend>
              <input type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)} className="input" />
            </fieldset>
          </div>
          <div className="my-1">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Password</legend>
              <input type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)} className="input" />
            </fieldset>
          </div>
          <p className="text-red-500">{error}</p>
          <div className="card-actions justify-center">
            <button className="btn btn-primary"
              onClick={handleLoginButton}>login</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login