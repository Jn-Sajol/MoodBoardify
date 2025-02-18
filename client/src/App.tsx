import "tailwindcss";
import Register from "./Register";
import Login from "./Login";
import Homepage from "./Homepage";
import { Route, Routes } from "react-router";
import CreateMood from "./CreateMood";
import NavBar from "./Navbar";
import Dashboard from "./Dashboard";
import Recommendation from "./Recommendation";
import MoodStatisticsPage from "./Statistics";
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
          <Route path="/recommendation" element={<Recommendation />} />
          <Route path="/statistic/:userId" element={<MoodStatisticsPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
