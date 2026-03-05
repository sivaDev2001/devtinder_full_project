import React, { useState } from 'react'
import axiosInstance from '../utils/axiosConfig'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addFeed, } from '../utils/feedSlices'
import Card from './Card'

const Feed = () => {
  const feedDispatch = useDispatch()
  const feedData = useSelector(state => state.feed)

  const fetchFeed = async () => {
    // if(feedData) return
    try {
      const res = await axiosInstance.get('/user/feed')
      feedDispatch(addFeed(res.data.data))
    }
    catch (err) {
      console.error(err)
    }
  }
  useEffect(() => {
    fetchFeed()
  }, [])
  const callFetchAgain = () => {
    fetchFeed()
  }
  if (!feedData || feedData.length === 0) {
    return (
      <div className='flex justify-center my-5'>
        <div className="text-center p-8">
          <p className="text-lg text-gray-500">No feed is available for you!!</p>
        </div>
      </div>
    )
  }
  return (
    <div className='flex justify-center my-5'>
      {feedData && (
        <Card user={feedData[0]} callFetchAgain={callFetchAgain} />
      )}
    </div>
  )
}

export default Feed