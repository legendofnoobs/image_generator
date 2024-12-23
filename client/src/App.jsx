import { Routes, Route } from "react-router-dom"
import {ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import "./index.css"
import BuyCredit from "./pages/BuyCredit"
import Home from "./pages/Home"
import Result from "./pages/Result"
import Navbar from "./components/Navbar"
import Login from "./components/Login"
import { useContext } from "react"
import { AppContext } from "./context/AppContext"
const App = () => {
  const {showLogin} = useContext(AppContext)
  return (
    <div className="px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50">
      <ToastContainer position="bottom-right"/>
      <Navbar/>
      {showLogin && <Login/>}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/result" element={<Result />} />
        <Route path="/buyCredit" element={<BuyCredit />} />
      </Routes>
    </div>
  )
}

export default App