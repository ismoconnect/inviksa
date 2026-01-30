import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

if (import.meta.env.PROD) {
  console.log = () => { };
  console.info = () => { };
  console.warn = () => { };
  // On garde console.error pour les vrais crashs
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
