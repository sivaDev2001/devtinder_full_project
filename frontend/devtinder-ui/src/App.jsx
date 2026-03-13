import React from 'react'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Body from './components/Body'
import Login from './components/Login'
import Profile from './components/Profile'
import {Provider} from 'react-redux'
import  appStore, { persistor }  from './utils/appStore.js'
import Feed from './components/Feed.jsx'
import EditProfile from './components/EditProfile.jsx'
import { PersistGate } from 'redux-persist/integration/react'
import Connections from './components/Connections.jsx'
import Requests from './components/Requests.jsx'
import SignUp from './components/SignUp.jsx'
import ProfilePicture from './components/ProfilePicture.jsx'
import Chat from './components/Chat.jsx'

const App = () => {
  return (
    <>
    <Provider store={appStore}>
      <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Body />}>
            <Route path='/feed' element={<Feed/>} />
            <Route path='/login' element={<Login />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/editProfile' element={<EditProfile/>}/>
            <Route path='/connections' element={<Connections/>}/>
            <Route path='/chat/:userId' element={<Chat/>}/>
            <Route path='/requests' element={<Requests/>}/>
            <Route path='/signup' element={<SignUp/>}/>
            <Route path='/profilePicture' element={<ProfilePicture/>}/>
            <Route path='*' element={<h1 className='text-center text-3xl my-5'>404 Not Found!!</h1>} /> {/*for any route which is not defined in the above routes, this will be rendered */}
          </Route>
        </Routes>
      </BrowserRouter>
      </PersistGate>
    </Provider>
    </>
  )
}

export default App