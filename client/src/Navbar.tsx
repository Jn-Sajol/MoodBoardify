import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { FiMenu, FiX } from "react-icons/fi"; // Icons for mobile menu

const NavBar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/register");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth");
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

          {/* Nav Links - Responsive */}
          <div
            className={`absolute md:static top-20 left-0 w-full md:w-auto md:flex bg-teal-800 md:bg-transparent md:space-x-8 transition-all duration-300 ease-in ${
              isMenuOpen ? "block p-4" : "hidden"
            }`}
          >
            <NavLink
              className="block md:inline-block text-lg font-semibold hover:text-teal-200 p-2"
              to="/moods"
            >
              Create Mood
            </NavLink>
            <NavLink
              className="block md:inline-block text-lg font-semibold hover:text-teal-200 p-2"
              to="/statistic"
            >
              Mood Statistics
            </NavLink>
            <button
              className="block md:inline-block text-lg font-semibold bg-teal-700 hover:text-teal-200 p-2 rounded-lg cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default NavBar;
