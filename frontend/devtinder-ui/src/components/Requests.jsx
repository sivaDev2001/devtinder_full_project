import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import axios from 'axios'
import { filterRequest, setRequests } from '../utils/requestsSlice'
import { useDispatch, useSelector } from 'react-redux'

const Requests = () => {
    const requestsDispatch = useDispatch()
    const reqData = useSelector(state => state.requests)
    const fetchRequests = async () => {
        try {
            const res = await axios.get(BASE_URL + '/user/view/requests',
                {
                    withCredentials: true
                }
            )
            requestsDispatch(setRequests(res.data.data))  
        }
        catch (err) {
            console.error("ERROR : " + err)
        }
    }
    const handleRequest = async (status, requestId) => {
        try {
            const res = await axios.post(`${BASE_URL}/user/review/${status}/${requestId}`, {},
                {
                    withCredentials: true
                }
            )
            requestsDispatch(filterRequest(requestId))
        }
        catch (err) {
            console.error("ERROR : " + err)
        }
    }
    useEffect(() => {
        fetchRequests()
    }, [])

    if (!reqData || reqData.length === 0) {
        return (
            <div className='flex justify-center my-5'>
                <div className="text-center p-8">
                    <p className="text-lg text-gray-500">No requests yet</p>
                </div>
            </div>
        )
    }

    return (
        <div className='flex flex-wrap justify-center gap-6 my-5'>
            {reqData.map((user) => (
                <div key={user.fromUserId._id} className="card w-80 bg-base-300  shadow-lg">
                    {/* Image at the top */}
                    <figure className="px-4 pt-4">
                        <img
                            src={user.fromUserId.profilepic || 'https://via.placeholder.com/300'}
                            alt={user.fromUserId.firstName}
                            className="w-full h-64 rounded-lg object-cover"
                        />
                    </figure>

                    {/* Card content below */}
                    <div className="card-body">
                        <div className="flex justify-between items-center">
                            <h2 className="card-title text-2xl font-bold">
                                {user.fromUserId.firstName} {user.fromUserId.lastName}
                            </h2>
                        </div>

                        <div className="flex gap-4 text-sm text-gray-600 mt-2">
                            <span className="badge badge-lg">Age: {user.fromUserId.age}</span>
                            <span className="badge badge-lg">Gender: {user.fromUserId.gender}</span>
                        </div>

                        {user.fromUserId.skills && user.fromUserId.skills.length > 0 && (
                            <div className="mt-3">
                                <p className="text-xs font-semibold mb-2">Skills:</p>
                                <div className="flex flex-wrap gap-2">
                                    {user.fromUserId.skills.map((skill, idx) => (
                                        <span key={idx} className="badge badge-outline text-xs">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="card-actions justify-end mt-4">
                            <button className="btn btn-error btn-sm"
                                onClick={() => handleRequest("rejected", user._id)}>Reject</button>
                            <button className="btn btn-primary btn-sm"
                                onClick={() => handleRequest("accepted", user._id)}>Accept</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Requests