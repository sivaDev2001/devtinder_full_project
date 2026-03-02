import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addConnections } from '../utils/connections'

const Connections = () => {
    const dispatchConnections = useDispatch()
    const connections = useSelector(state => state.connections)
    
    const fetchConnections = async () => {
        try {
            const res = await axios.get(BASE_URL + '/user/view/connections',
                {
                    withCredentials: true
                }
            )
            console.log(res.data.data)
            dispatchConnections(addConnections(res.data.data))
        } catch (error) {
            console.error('Error fetching connections:', error)
        }
    }
    
    useEffect(() => {
        fetchConnections()
    }, [])
    if (!connections || connections.length === 0) {
        return (
            <div className='flex justify-center my-5'>
                <div className="text-center p-8">
                    <p className="text-lg text-gray-500">No connections yet</p>
                </div>
            </div>
        )
    }
    
    return (
        <div className='flex flex-wrap justify-center gap-6 my-5'>
            {connections.map((connection) => (
                <div key={connection._id} className="card w-80 bg-base-300  shadow-lg">
                    {/* Image at the top */}
                    <figure className="px-4 pt-4">
                        <img
                            src={connection.profilepic || 'https://via.placeholder.com/300'}
                            alt={connection.firstName}
                            className="w-full h-64 rounded-lg object-cover"
                        />
                    </figure>

                    {/* Card content below */}
                    <div className="card-body">
                        <div className="flex justify-between items-center">
                            <h2 className="card-title text-2xl font-bold">
                                {connection.firstName} {connection.lastName}
                            </h2>
                        </div>

                        <div className="flex gap-4 text-sm text-gray-600 mt-2">
                            <span className="badge badge-lg">Age: {connection.age}</span>
                            <span className="badge badge-lg">Gender: {connection.gender}</span>
                        </div>

                        {connection.skills && connection.skills.length > 0 && (
                            <div className="mt-3">
                                <p className="text-xs font-semibold mb-2">Skills:</p>
                                <div className="flex flex-wrap gap-2">
                                    {connection.skills.map((skill, idx) => (
                                        <span key={idx} className="badge badge-outline text-xs">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="card-actions justify-end mt-4">
                            <button className="btn btn-primary btn-sm">Message</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Connections