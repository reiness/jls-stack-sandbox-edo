import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { UserProvider } from "@/lib/context/UserContext"
import { RealTimeProvider } from "@/lib/context/RealTimeContext"
import App from "./App"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UserProvider>
      <RealTimeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </RealTimeProvider>
    </UserProvider>
  </React.StrictMode>,
)