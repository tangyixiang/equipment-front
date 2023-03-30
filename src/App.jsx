import React, { useLayoutEffect, useEffect, useState, useContext } from 'react'
import BaseLayout from './components/Layout/BaseLayout'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import NoFoundPage from './pages/404'
import RequireAuth from './components/Auth/RequireAuth'
import Joblog from './pages/monitor/joblog'
import Home from './pages/home'
import Welcome from './pages/home/Welcome'

function App() {
  const [router, setRouter] = useState('')

  return (
    <>
      <Routes>
        <Route path="/login" exact element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <BaseLayout initRouer={setRouter} />
            </RequireAuth>
          }
        >
          <Route index element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/monitor/job-log" element={<Joblog />} />
          {router}
          <Route path="*" element={<NoFoundPage />} />
        </Route>
        {/* {init && <Route path="*" element={<NoFoundPage />} />} */}
      </Routes>
    </>
  )
}

export default App
