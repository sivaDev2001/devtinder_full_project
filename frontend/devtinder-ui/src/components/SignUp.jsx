import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { IoMdCloseCircleOutline } from "react-icons/io"
import { Link, useNavigate } from 'react-router-dom'
import { BASE_URL } from '../utils/constants'
import { useDispatch } from 'react-redux'
import { FaRegEye } from "react-icons/fa"
import { addUser } from '../utils/slices'

const SignUp = () => {
    const [firstName, setFirstName] = useState("Harry")
    const [lastName, setLastName] = useState("potter")
    const [email, setEmail] = useState("harry@gmail.com")
    const [password, setPassword] = useState("harry@123")
    const [age, setAge] = useState("22")
    const [gender, setGender] = useState("male")
    const [skill, setSkill] = useState("")
    const [profilepic, setProfilePic] = useState("https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Cat_07464_kalamis_safinaz.jpg/250px-Cat_07464_kalamis_safinaz.jpg")
    const [about, setAbout] = useState("hi")
    const [skills, setSkills] = useState(["javascript"])
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState("")
    const [eye, setEye] = useState(false)

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

    const handleSignUp = async () => {
        try {
            const res = await axios.post(BASE_URL + '/signin',
                {
                    firstName, lastName, email, password, age, gender, profilepic, about, skills
                },
                {
                    withCredentials: true
                }
            )
            dispatch(addUser(res.data.data))
            setShowToast(true)
            setToastMessage(res.data.message)
            navigate('/feed')
            setTimeout(() => {
                setShowToast(false)
            }, 3000)
        }
        catch (err) {
            if (err.response.data.code) {
                setShowToast(true)
                setToastMessage("Email already registerd!!")
                setTimeout(() => {
                    setShowToast(false)
                }, 3000)
            }
            else if (err.status === 400) {
                setShowToast(true)
                setToastMessage(err.response.data.message)
                setTimeout(() => {
                    setShowToast(false)
                }, 3000)
            }
        }
    }

    return (
        <div>
            <div className="flex justify-center my-5">
                <div className="card card-border bg-base-300 w-96">
                    <div className="card-body">
                        <h2 className="card-title justify-center">Sign In</h2>

                        <div className="">
                            <fieldset className="fieldset">
                                <legend className="fieldset-legend">FirstName :</legend>
                                <input type="text"
                                    placeholder='Enter your first name'
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)} className="input" />
                            </fieldset>
                        </div>
                        <div className="">
                            <fieldset className="fieldset">
                                <legend className="fieldset-legend">LastName :</legend>
                                <input type="text"
                                    placeholder='Enter your last name'
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)} className="input" />
                            </fieldset>
                        </div>

                        <div className="">
                            <fieldset className="fieldset">
                                <legend className="fieldset-legend">Email :</legend>
                                <input type="text"
                                    placeholder='Enter your email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} className="input" />
                            </fieldset>
                        </div>

                        <div className="">
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

                        <div className="">
                            <fieldset className="fieldset">
                                <legend className="fieldset-legend">Age :</legend>
                                <input type="text"
                                    placeholder='Enter your age'
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
                                <legend className="fieldset-legend">ProfilePic :</legend>
                                <input type="text"
                                    placeholder='Enter your profile pic url'
                                    value={profilepic}
                                    onChange={(e) => setProfilePic(e.target.value)} className="input" />
                            </fieldset>
                        </div>

                        {/* currently coding*/}
                        <div className="">
                            <fieldset className="fieldset">
                                <legend className="fieldset-legend">Skills :</legend>
                                <input type="text"
                                    value={skill}
                                    onChange={(e) => setSkill(e.target.value)} className="input"
                                    placeholder={!skill ? 'Enter only 4 skills' : ''} />
                                <div className="card-actions justify-center my-2">
                                    <button className="btn btn-primary"
                                        onClick={addSkills}>Add Skill</button>
                                </div>
                            </fieldset>
                            {skills.length > 0 && (
                                <div className="">
                                    <fieldset className="fieldset">
                                        <legend className="fieldset-legend">Added Skills :</legend>
                                        <div className="flex gap-2 flex-wrap">
                                            {skills.map((value, index) => (
                                                <span key={index} className="badge badge-primary relative pr-1 font-bold pt-2 pb-3">
                                                    {value}
                                                    <IoMdCloseCircleOutline className="cursor-pointer"
                                                        onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                                                    />
                                                </span>
                                            ))}
                                        </div>
                                    </fieldset>
                                </div>
                            )}
                        </div>

                        <div className="">
                            <fieldset>
                                <legend className="fieldset-legend">About</legend>
                                <textarea placeholder="Tell us about yourself" className="textarea textarea-secondary"
                                    value={about}

                                    onChange={e => setAbout(e.target.value)} />
                            </fieldset>
                        </div>

                        <div className="card-actions justify-center mt-3">
                            <button className="btn btn-primary"
                                onClick={handleSignUp}>Sign In</button>
                        </div>
                        <p className="text-center mb-5">Already have an account? <Link to="/login" className="link link-primary">Login</Link></p>

                    </div>
                </div>
            </div>

            {showToast && (
                <div className="toast toast-top toast-center">
                    <div className="alert alert-success">
                        <span>{toastMessage}</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SignUp