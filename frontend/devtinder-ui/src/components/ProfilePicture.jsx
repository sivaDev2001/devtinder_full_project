import React from 'react'
import { useState } from 'react'
import { BASE_URL } from '../utils/constants'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addUser } from '../utils/slices'


const ProfilePicture = () => {
    const dispatch = useDispatch()
    const [image, setImage] = useState(null)
    const [showToast,setShowToast] = useState(false)
    const [toastMessage,setToastMessage]= useState("")
    const navigate = useNavigate()
    const handleUploadImage = () => {
        // Create a file input element
        const fileInput = document.createElement('input')
        fileInput.type = 'file'
        fileInput.accept = '[image/*,document/*]' // Accept only image and document files
        fileInput.onchange = (e) => {
            const file = e.target.files[0]
            setImage(file)
        }
        fileInput.click() // Programmatically click the file input to open the file dialog
    }
    const handleSaveImage = async () => {
        try {
            const formData = new FormData()
            formData.append("profilepic", image)
            const res = await axios.patch(BASE_URL + '/images/upload', formData, {
                withCredentials: true,
            })
            dispatch(addUser(res.data.data))
            setShowToast(true)
            setToastMessage(res.data.message)
            setTimeout(() => {
                setShowToast(false)
                navigate('/feed')
            }, 1000)
        }
        catch (err) {
            console.error("Error uploading image:", err)
        }
    }
    return (
        <>
            <div className="flex justify-center items-center min-h-screen">
                <div className="flex flex-col items-center gap-4 p-6 bg-base-100 shadow-md rounded-xl mb-10">

                    {/* Profile Image */}
                    <div className="avatar">
                        <div className="ring-primary ring-offset-base-100 w-56 rounded-full ring-2 ring-offset-2">
                            <img src={image ?
                                URL.createObjectURL(image)
                                : "https://img.daisyui.com/images/profile/demo/spiderperson@192.webp"} />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button className="btn btn-outline"
                            onClick={() => navigate('/feed')}>Skip for now</button>
                        {image ?
                            <button className="btn btn-primary"
                                onClick={handleSaveImage}>save profile photo</button> :
                            <button className="btn btn-primary"
                                onClick={handleUploadImage}>Upload profile photo</button>

                        }
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
        </>
    )
}

export default ProfilePicture