import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Home from "./components/Home"
import Login from "./components/Login"
import Registration from "./components/Registration"
import Profile from "./components/Profile"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from "./components/ProtectedRoute"



export default function App() {

  return (
    <>
      <Router>
        <Header />
        <Routes>

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />

          </Route>

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />

        </Routes>
      </Router>
      <ToastContainer />
      <toast />
    </>
  )
}