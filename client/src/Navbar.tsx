import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";

const NavBar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token"); // Check if token exists

  useEffect(() => {
    console.log("isAuthenticated", isAuthenticated);
    if (!isAuthenticated) {
      navigate("/register");
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <div className="flex flex-row justify-between gap-12 p-6 bg-gray-700 text-orange-600">
        <div className="flex flex-row justify-center  gap-12 bg-gray-700 text-orange-600">
          <NavLink
            className="hover:bg-orange-600 hover:text-white p-1 rounded-lg"
            to="/homepage"
          >
            Homepage
          </NavLink>
        </div>

        <div className="flex flex-row justify-center   gap-12 bg-gray-700 text-orange-600">
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
          <NavLink
            className="bg-orange-800 text-white p-1 rounded-lg"
            onClick={handleLogout}
          >
            Logout
          </NavLink>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default NavBar;