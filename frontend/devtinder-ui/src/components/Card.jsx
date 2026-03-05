import React from 'react'
import { BASE_URL } from '../utils/constants'
import { filterFeed } from '../utils/feedSlices'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

const Card = ({ user,callFetchAgain}) => {
    const feedUsers = useSelector(state=>state.feed)
    const dispatchFilteredFeed = useDispatch()
    const handleFeed = async (status, users) => {
        try {
            const res = await axios.post(`${BASE_URL}/user/request/${status}/${users._id}`,{},
                {
                    withCredentials: true
                }
            )
            if(feedUsers.length === 1)
            {
                callFetchAgain()
            }
            dispatchFilteredFeed(filterFeed(users._id))
        }
        catch (err) {
            console.error(err)
        }
    }
    return (
        <div className="card bg-violet-900 w-86 h-108 shadow-sm">
            <figure>
                <img className='w-86 h-65'
                    src={user.profilepic}
                    alt="profilePic" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">
                    {user.firstName + " " + user.lastName}
                </h2>
                {user.age && user.gender && (<p>Age: {user.age} , Gender : {user.gender}</p>)}
                <p>{user.about}</p>
                <div className="card-actions justify-center">
                    <button className="badge badge-outline bg-red-600 p-4"
                        onClick={() => handleFeed("ignored", user)}>Ignored</button>
                    <button className="badge badge-outline bg-green-600 p-4"
                        onClick={() => handleFeed("interested", user)}>Interested</button>
                </div>
            </div>
        </div>
    )
}

export default Card