import "tailwindcss";
import Register from "./Register";
import Login from "./Login";
import Homepage from "./Homepage";
import { Route, Routes } from "react-router";
import CreateMood from "./CreateMood";
function App() {
  return (
    <>
    <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Homepage />} />
        <Route path="/moods" element={<CreateMood />} />

        </Routes>
    </>
  )
}

export default App
