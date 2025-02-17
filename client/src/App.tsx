import "tailwindcss";
import Register from "./Register";
import Login from "./Login";
import Homepage from "./Homepage";
import { Route, Routes } from "react-router";
import CreateMood from "./CreateMood";
import NavBar from "./Navbar";
import Dashboard from "./Dashboard";
function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Homepage />} />
        <Route element={<NavBar />}>
          <Route index element={<Dashboard/>} />
          <Route path="/moods" element={<CreateMood />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
