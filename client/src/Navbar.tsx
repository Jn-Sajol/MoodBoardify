import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { FiMenu, FiX } from "react-icons/fi";

const NavBar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track user login state

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Update the login state
    setIsLoggedIn(!!token);

    // Redirect to login if accessing protected routes without a token
    const protectedRoutes = ["/moods", "/statistic", "/recommendation"];
    if (!token && protectedRoutes.includes(window.location.pathname)) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth");
    setIsLoggedIn(false); // Update login state
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-teal-800 to-teal-600 p-6 text-white">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <NavLink
            className="text-2xl font-bold"
            style={{ fontFamily: "Bebas Neue, cursive" }}
            to="/"
            onClick={() => setIsMenuOpen(false)} // Close menu when clicking logo
          >
            MoodBoardiFy
          </NavLink>

          {/* Hamburger Menu (Mobile) */}
          <button
            className="text-white text-3xl md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>

          {/* Nav Links */}
          <div
            className={`absolute md:static top-20 left-0 w-full md:w-auto md:flex bg-teal-800 md:bg-transparent md:space-x-8 transition-all duration-300 ease-in ${
              isMenuOpen ? "block p-4" : "hidden"
            }`}
          >
            <NavLink
              className="block md:inline-block text-lg font-semibold hover:text-teal-200 p-2"
              to="/moods"
              onClick={() => setIsMenuOpen(false)} // Close menu on link click
            >
              Create Mood
            </NavLink>
            <NavLink
              className="block md:inline-block text-lg font-semibold hover:text-teal-200 p-2"
              to="/statistic"
              onClick={() => setIsMenuOpen(false)} // Close menu on link click
            >
              Mood Statistics
            </NavLink>
            <NavLink
              className="block md:inline-block text-lg font-semibold hover:text-teal-200 p-2"
              to="/feed"
              onClick={() => setIsMenuOpen(false)} // Close menu on link click
            >
              Social Feed
            </NavLink>

            {/* Conditionally show Login or Logout button */}
            {isLoggedIn ? (
              <button
                className="block md:inline-block text-lg font-semibold bg-teal-700 hover:text-teal-200 p-2 rounded-lg cursor-pointer"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false); // Close menu after logout
                }}
              >
                Logout
              </button>
            ) : (
              <button
                className="block md:inline-block text-lg font-semibold bg-teal-700 hover:text-teal-200 p-2 rounded-lg cursor-pointer"
                onClick={() => {
                  handleLogin();
                  setIsMenuOpen(false); // Close menu after login
                }}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default NavBar;
