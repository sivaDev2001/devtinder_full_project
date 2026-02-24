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
          </Route>
        </Routes>
      </BrowserRouter>
      </PersistGate>
    </Provider>
    </>
  )
}

export default App