import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import {
  BrowserRouter,
  unstable_HistoryRouter as HistoryRouter,
} from 'react-router-dom'
import 'moment/locale/zh-cn'
import zhCN from 'antd/es/locale/zh_CN'
import { ConfigProvider } from 'antd'
import history from './utils/history'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  // <React.StrictMode>
  <HistoryRouter history={history} basename={process.env.REACT_APP_ACCESS_PATH}>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </HistoryRouter>
  // </React.StrictMode>
)

reportWebVitals()
