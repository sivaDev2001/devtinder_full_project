import axios from "axios"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../utils/constants"
import { addUser } from "../utils/slices"
import Toast from "./Toast"


const EditProfile = () => {
  const user = useSelector(state => state.user)
  const updatedUserDispatch = useDispatch()
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState(user.firstName)
  const [lastName, setLastName] = useState(user.lastName)
  const [age, setAge] = useState(user.age)
  const [gender, setGender] = useState(user.gender)
  const [profilepic, setProfilePic] = useState(user.profilepic)
  const [about, setAbout] = useState(user.about)
  const [isError, isSetError] = useState(false)
  const [showError, setShowError] = useState("")
  const [showSuccess, setShowSuccess] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [values, setValues] = useState({})


  const handleEditProfile = async () => {
    try {
      const res = await axios.patch(BASE_URL + "/profile/edit",
        {
          firstName, lastName, age, gender, profilepic, about
        },
        {
          withCredentials: true
        }
      );
      updatedUserDispatch(addUser(res.data.data))
      setIsSuccess(true)
      const message = `${res.data.data.firstName}, Your Profile has been ${res.data.message}`
      setShowSuccess(message)
      setValues(() => {
        const value = {
          data:showSuccess || message,
          color:"green"
        }
        return value
      })
      setTimeout(() => {
        setIsSuccess(false)
      }, 3000)
    }
    catch (err) {
      err.status === 400 && isSetError(true)
      const message = err.response.data
      setShowError(message)
      setValues(() => {
        const value = {
          data: showError || message,
          color: "red"
        }
        return value
      })
      setTimeout(() => {
        isSetError(false)
      }, 3000)
    }
  }
  return (
    <>
      {
        user && (
          <div className="flex justify-center justify-between gap-4">

            <div className="flex justify-center my-5">
              <div className="card card-border bg-base-300 w-96">
                <div className="card-body">
                  <h2 className="card-title justify-center">Profile</h2>

                  <div className="">
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend">FirstName</legend>
                      <input type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)} className="input" />
                    </fieldset>
                  </div>
                  <div className="">
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend">LastName</legend>
                      <input type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)} className="input" />
                    </fieldset>
                  </div>

                  <div className="">
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend">Age</legend>
                      <input type="text"
                        value={age}
                        onChange={(e) => setAge(e.target.value)} className="input" />
                    </fieldset>
                  </div>

                  <div className="flex items-center gap-4">
                    <legend className="fieldset-legend my-1">Gender :</legend>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="male"
                        checked={gender === "male"}
                        className="radio radio-secondary radio-xs"
                        onChange={e => setGender(e.target.value)}
                      />
                      <span>Male</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="female"
                        checked={gender === "female"}
                        className="radio radio-secondary radio-xs"
                        onChange={e => setGender(e.target.value)}
                      />
                      <span>Female</span>
                    </label>
                  </div>

                  <div className="">
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend">ProfilePic</legend>
                      <input type="text"
                        value={profilepic}
                        onChange={(e) => setProfilePic(e.target.value)} className="input" />
                    </fieldset>
                  </div>

                  <div className="">
                    <fieldset>
                      <legend className="fieldset-legend">About</legend>
                      <textarea placeholder="" className="textarea textarea-secondary"
                        value={about}
                        onChange={e => setAbout(e.target.value)} />
                    </fieldset>
                  </div>

                  <div className="card-actions justify-center mb-5">
                    <button className="btn btn-primary"
                      onClick={handleEditProfile}>SaveProfile</button>
                  </div>
                </div>
              </div>
            </div>

            {/* second container */}
            <div className="card w-96 bg-base-300 shadow-xl my-5">
              <figure>
                <img
                  src={profilepic}
                  alt="Profile"
                  className="w-full h-80 object-cover"
                />
              </figure>

              {/* Card Body */}
              <div className="card-body">
                <h2 className="card-title justify-center">Profile Details</h2>

                <div className="space-y-2 text-sm">
                  <p className="my-3"><span className="font-semibold">First Name : </span> {firstName}</p>
                  <p className="my-3"><span className="font-semibold">Last Name : </span> {lastName}</p>
                  <p className="my-3"><span className="font-semibold">Age : </span> {age}</p>
                  <p className="my-3"><span className="font-semibold">Gender : </span> {gender}</p>
                  <p className="my-3"><span className="font-semibold">About : </span>
                    {about}</p>
                </div>

                <div className="card-actions justify-center my-4">
                  <button className="btn btn-primary"
                    onClick={() => navigate('/profile')}>VisitProfile</button>
                </div>
              </div>
            </div>

          </div>
        )
      }

      {isError && (
        <Toast message={values} /> ////fix the toast theme right now
      )}

      {isSuccess && (
        <Toast message={values} />
      )}
    </>


  )
}

export default EditProfile