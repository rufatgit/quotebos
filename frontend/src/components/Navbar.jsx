import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../Navbar.css";
import logo2 from "../assets/logo3.jpeg";

export default function Navbar({
  onSearch,
  onLogoClick,
  searchQuery,
  isLoggedIn,
  onLoginClick,
  onLogout,
}) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/" className="logo" onClick={onLogoClick}>
        <img src={logo2} alt="Quotebos Logo" />
      </Link>

      <div className={`nav-links ${isOpen ? "active" : ""}`}>
        <Link
          to="/"
          onClick={() => {
            setIsOpen(false);
            onLogoClick();
          }}
        >
          <button>Explore</button>
        </Link>
        <Link
          to="/authors"
          onClick={() => {
            setIsOpen(false);
            onLogoClick();
          }}
        >
          <button>Authors</button>
        </Link>
        <Link
          to="/collections"
          onClick={() => {
            setIsOpen(false);
            onLogoClick();
          }}
        >
          <button>Collections</button>
        </Link>
        <Link
          to="/quoteoftheday"
          onClick={() => {
            setIsOpen(false);
            onLogoClick();
          }}
        >
          <button>Quote Of The Day</button>
        </Link>
      </div>
      <input
        type="text"
        placeholder={
          location.pathname.startsWith("/authors")
            ? "Search for author..."
            : location.pathname.startsWith("/collections")
              ? "Seach for collection..."
              : "Search quote..."
        }
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
          }
        }}
        className="search-bar"
      />

      {isLoggedIn ? (
        <button className="login-btn" onClick={onLogout}>
          Logout
        </button>
      ) : (
        <button className="login-btn" onClick={onLoginClick}>
          Login
        </button>
      )}
    </nav>
  );
}
