import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./style.scss";
import App from './App.jsx'
import { AuthContextProvider } from './context/authContext.jsx'
import { DarkModeContextProvider } from './context/darkModeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DarkModeContextProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </DarkModeContextProvider>
  </StrictMode>,
)
