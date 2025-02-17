import "tailwindcss";
import Register from "./Register";
import Login from "./Login";
import Homepage from "./Homepage";
import { Route, Routes } from "react-router";
function App() {
  return (
    <>
    <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Homepage />} />
        </Routes>
    </>
  )
}

export default App
