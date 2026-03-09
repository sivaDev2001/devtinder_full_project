import axiosInstance from "../utils/axiosConfig"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
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
  const [skill, setSkill] = useState("")
  const [skills, setSkills] = useState(user.skills || [])

  const addSkills = () => {
    if (skill.trim() !== "") {
      setSkills(prevSkills => {
        if (prevSkills.includes(skill.trim())) {
          alert("skill already added!!")
          return prevSkills
        }
        else {
          return [...prevSkills, skill.trim()]
        }
      }
      )
      setSkill("")
    }
    else if (skill.trim() === "") {
      alert("Enter any skills to add!!")
    }
  }

  const handleEditProfile = async () => {
    try {
      const res = await axiosInstance.patch("/profile/edit",
        {
          firstName, lastName, age, gender, profilepic, about, skills
        }
      );
      updatedUserDispatch(addUser(res.data.data))
      setIsSuccess(true)
      const message = `${res.data.data.firstName}, Your Profile has been ${res.data.message}`
      setShowSuccess(message)
      setValues(() => {
        const value = {
          data: showSuccess || message,
          color: "green"
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
          <div className="flex flex-col md:flex-row justify-center items-start gap-4 px-4">

            <div className="flex justify-center my-5 w-full md:w-auto">
              <div className="card card-border bg-base-300 w-full md:w-96">
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
                      <input type="number"
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

                  {/* currently coding*/}
                  <div className="">
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend">Skills :</legend>
                      <input type="text"
                        value={skill}
                        onChange={(e) => setSkill(e.target.value)} className="input"
                        placeholder={!skill ? 'Enter your skills' : ''} />
                      <div className="card-actions justify-center my-3">
                        <button className="btn btn-primary"
                          onClick={addSkills}>Add Skill</button>
                      </div>
                    </fieldset>

                    <div className="">
                      <fieldset className="fieldset">
                        <legend className="fieldset-legend">Your Skills :</legend>
                        <div className="flex gap-2 flex-wrap">
                          {skills.map((value, index) => (
                            <span key={index} className="badge badge-primary">
                              {value}
                            </span>
                          ))}
                        </div>
                      </fieldset>
                    </div>
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
            <div className="card w-full md:w-96 bg-base-300 shadow-xl my-5">
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
                  <p className="my-3"><span className="font-semibold">Skills : </span>
                    {skills.join(', ')}</p>
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