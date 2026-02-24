import React from 'react'

const Card = ({user}) => {
    return (
        <div className="card bg-violet-900 w-86 h-108 shadow-sm">
            <figure>
                <img className='w-86 h-65'
                    src={user.profilepic}
                    alt="profilePic" />
            </figure>
            <div className="card-body">
                <h2 className="card-title">
                    {user.firstName+" "+user.lastName}
                </h2>
                {user.age && user.gender && (<p>Age: {user.age} , Gender : {user.gender}</p>)}
                <p>{user.about}</p>
                <div className="card-actions justify-center">
                    <div className="badge badge-outline bg-red-600 p-4">Ignored</div>
                    <div className="badge badge-outline bg-green-600 p-4">Interested</div>
                </div>
            </div>
        </div>
    )
}

export default Card