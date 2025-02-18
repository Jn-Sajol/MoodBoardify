import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";

const NavBar = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get fresh token value
    if (!token) {
      navigate("/register");
    }
  }, []); // Run only once on mount

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    navigate("/login"); // Redirect to login page
  };

  return (
    <>
      <div className="flex justify-between items-center bg-gradient-to-r from-teal-800 to-teal-600 p-6 text-white">
        <div className="flex flex-row justify-center gap-12">
          <NavLink
            className="text-2xl font-semibold hover:text-teal-200 transition-all rounded-lg"
            to="/"
          >
            MoodBoardiFy
          </NavLink>
        </div>

        <div className="flex flex-row justify-center gap-12">
          <NavLink
            className="text-2xl font-semibold hover:text-teal-200 transition-all p-1 rounded-lg"
            to="/moods"
          >
            Create Mood
          </NavLink>
          <NavLink
            className="text-2xl font-semibold hover:text-teal-200 transition-all p-1 rounded-lg"
            to="/statistic"
          >
            Mood Statistics
          </NavLink>
          <button
            className=" text-2xl bg-teal-800 hover:text-teal-200 text-white p-1 rounded-lg cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default NavBar;
