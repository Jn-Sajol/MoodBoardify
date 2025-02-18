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
      <div className="flex flex-row justify-between gap-12 p-6 bg-gray-700 text-orange-600">
        <div className="flex flex-row justify-center gap-12">
          <NavLink
            className="hover:bg-orange-600 hover:text-white p-1 rounded-lg"
            to="/homepage"
          >
            Homepage
          </NavLink>
        </div>

        <div className="flex flex-row justify-center gap-12">
          <NavLink
            className="hover:bg-orange-600 hover:text-white p-1 rounded-lg"
            to="/moods"
          >
            Create Mood
          </NavLink>
          <NavLink
            className="hover:bg-orange-600 hover:text-white p-1 rounded-lg"
            to="/statistic"
          >
            Stats
          </NavLink>
          <button
            className="bg-orange-800 text-white p-1 rounded-lg cursor-pointer"
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
