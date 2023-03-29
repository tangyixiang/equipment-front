import React, { useState } from 'react'
import { Route } from 'react-router-dom'
import RequireAuth from '@/components/Auth/RequireAuth'

const lazyLoad = (path) => {
  const Module = React.lazy(() => import(`@/pages${path}`))
  return <Module />
}

function useInitRouter() {
  function initRouer(menuTree, setRouter) {
    let RouteList = []
    // 去重路由
    let unrepeatData = new Set()
    menuTree.forEach((menu) => {
      if (menu.children && menu.children.length > 0) {
        menu.children.forEach((cr) => {
          if (!unrepeatData.has(cr.path)) {
            RouteList.push(
              <Route
                path={cr.path}
                element={
                  <RequireAuth>
                    <React.Suspense fallback={<></>}>
                      {lazyLoad(cr.component)}
                    </React.Suspense>
                  </RequireAuth>
                }
                key={cr.path}
              />
            )
            unrepeatData.add(cr.path)
          }
        })
      }
    })
    setRouter(RouteList)
  }

  return [initRouer]
}

export default useInitRouter
