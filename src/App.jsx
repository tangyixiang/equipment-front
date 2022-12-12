import React, { useLayoutEffect, useEffect, useState } from 'react'
import BaseLayout from './components/Layout/BaseLayout'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import NoFoundPage from './pages/404'
import RequireAuth from './components/Auth/RequireAuth'
import useGlobalStore from './store'
import useMenus from './hooks/useMenus'
import { getRouters } from '@/api/menu'
import BlankPage from './components/BlankPage'
import Joblog from './pages/monitor/joblog'
import Home from './pages/home'
import Welcome from './pages/home/Welcome'

// const notFound = <Route path="*" element={<NoFoundPage />} />

function App() {
  const [router, setRouter] = useState('')
  const [init, setInit] = useState(false)
  const [menus, setMenus] = useState([])
  const [buildMenus, buildRouters] = useMenus()
  const { userStore } = useGlobalStore()
  let user = userStore.userInfo

  useLayoutEffect(() => {
    if (user) {
      getRouters().then((res) => {
        const menuList = buildMenus(res.data, 'true')
        const routeList = buildRouters(menuList)
        setRouter(routeList)
        setMenus(menuList)
        setInit(true)
      })
    }
  }, [user])

  return (
    <>
      <Routes>
        <Route path="/login" exact element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <BaseLayout menus={menus} />
            </RequireAuth>
          }
        >
          <Route index element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/monitor/job-log" element={<Joblog />} />
          {router}
          <Route path="*" element={<NoFoundPage />} />
        </Route>
        {init && <Route path="*" element={<NoFoundPage />} />}
      </Routes>
    </>
  )
}

export default App
