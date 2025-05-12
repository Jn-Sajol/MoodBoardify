import "tailwindcss";
import Register from "./Register";
import Login from "./Login";
import Homepage from "./Homepage";
import { Route, Routes } from "react-router";
import CreateMood from "./CreateMood";
import NavBar from "./Navbar";
import Recommendation from "./Recommendation";
import MoodStatisticsPage from "./Statistics";
import ProtectedRoute from "./ProtectedRoute";
import FeedPage from "./feed";
function App() {
  return (
    <>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<NavBar />}>
          <Route index element={<Homepage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/moods" element={<CreateMood />} />
            <Route path="/recommendation" element={<Recommendation />} />
            <Route path="/statistic" element={<MoodStatisticsPage />} />
            <Route path="/feed" element={<FeedPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
