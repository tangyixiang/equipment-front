import React from 'react'
import { useNavigate, Route } from 'react-router-dom'
import { createIcon } from '@/utils/IconUtils'
import RequireAuth from '@/components/Auth/RequireAuth'
import { nanoid } from 'nanoid'

const lazyLoad = (path) => {
  const Module = React.lazy(() => import(`@/pages${path}`))
  return <Module />
}

const useMenus = () => {
  let navigate = useNavigate()

  const buildMenus = (childrens, isDir) => {
    return childrens.map((item) => {
      return {
        key: item.path.match(':') ? item.path + nanoid() : item.path,
        path: item.path,
        label: item.meta.title,
        icon: createIcon(item.meta.icon),
        children: item.children
          ? buildMenus(item.children, 'false')
          : undefined,
        // hideChildrenInMenu: item.hidden,
        hide: item.hidden + '',
        component: item.component,
        authority: item.perms,
        parent: isDir,
        onClick: () => showPage(item.path, item.query, item.meta.title, isDir),
      }
    })
  }

  const showPage = (path, query, tabLabel, isDir) => {
    if (isDir === 'false') {
      if (query) {
        navigate(path.split(':')[0] + query)
      } else {
        navigate(path)
      }
    }
  }

  const buildRouters = (menus) => {
    let RouteList = []
    // 去重路由
    let unrepeatData = new Set()
    menus.map((route) => {
      if (route.children && route.children.length > 0) {
        route.children.forEach((cr) => {
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
    return RouteList
  }

  return [buildMenus, buildRouters]
}

export default useMenus
