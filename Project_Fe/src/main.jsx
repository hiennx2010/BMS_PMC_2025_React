import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { ConfigProvider } from './contexts/ConfigContext'  // <-- thêm dòng này

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider>              {/* <-- thêm wrapper */}
      <App />
    </ConfigProvider>
  </StrictMode>
)
