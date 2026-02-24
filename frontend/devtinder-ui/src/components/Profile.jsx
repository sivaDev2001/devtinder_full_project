import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import EditProfile from './EditProfile'

const Profile = () => {
  const user = useSelector(state => state.user)
  const navigate = useNavigate()
  return (
    <>
      {user && (
        <div className='flex justify-center'>
          <div className="card w-96 bg-base-300 shadow-xl my-5">
            <figure>
              <img
                src={user.profilepic}
                alt="Profile"
                className="w-full h-80 object-cover"
              />
            </figure>

            {/* Card Body */}
            <div className="card-body">
              <h2 className="card-title justify-center">Profile Details</h2>

              <div className="space-y-2 text-sm">
                <p className="my-3"><span className="font-semibold">First Name : </span> {user.firstName}</p>
                <p className="my-3"><span className="font-semibold">Last Name : </span> {user.lastName}</p>
                <p className="my-3"><span className="font-semibold">Age : </span> {user.age}</p>
                <p className="my-3"><span className="font-semibold">Gender : </span> {user.gender}</p>
                <p className="my-3"><span className="font-semibold">About : </span>
                  {user.about}</p>
              </div>

              <div className="card-actions justify-center my-4">
                <button className="btn btn-primary"
                  onClick={() =>{ 
                    navigate('/editProfile')}}>Edit Profile</button>
              </div>
            </div>
          </div>

         

        </div>
      )}
    </>
  )
}

export default Profile