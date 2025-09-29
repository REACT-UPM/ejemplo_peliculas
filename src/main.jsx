import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App'
import './assets/index.css'
import { BrowserRouter } from 'react-router';


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
