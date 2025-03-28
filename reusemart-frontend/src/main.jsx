import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppRouter from "./Routes/index.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./main.css";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)
