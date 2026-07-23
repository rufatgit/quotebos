import "./App.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import QuoteList from "./components/Quotes";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AuthorsList from "./components/AuthorsList";
import AuthorDetail from "./components/AuthorDetail";
import CollectionsList from "./components/CollectionsList";
import CollectionDetail from "./components/CollectionDetail";
import QuoteOfTheDay from "./components/QuoteOfTheDay";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import SearchResults from "./components/SearchResults";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  //This checks on page load whether a token already exists (so refreshing the page doesn't log you out).
  // !!token converts the string/null into a clean true/false
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  //logout function
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleSignupSuccess = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      <Navbar
        onSearch={setSearchQuery}
        onLogoClick={() => setSearchQuery("")}
        searchQuery={searchQuery}
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setShowLogin(true)}
        onLogout={handleLogout}
      />
      {showLogin && (
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setShowLogin(false)}
          onSwitchToSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
      )}

      {showSignup && (
        <SignupForm
          onSignupSuccess={handleSignupSuccess}
          onClose={() => setShowSignup(false)}
        />
      )}

      <main className="content">
        <div className="container">
          <Routes>
            <Route path="/" element={<QuoteList searchQuery={searchQuery} />} />
            <Route
              path="/authors"
              element={<AuthorsList searchQuery={searchQuery} />}
            />{" "}
            <Route path="/authors/:id" element={<AuthorDetail />} />
            <Route
              path="/collections"
              element={<CollectionsList searchQuery={searchQuery} />}
            />{" "}
            <Route path="/collections/:id" element={<CollectionDetail />} />
            <Route path="/quoteoftheday" element={<QuoteOfTheDay />} />
            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </div>
      </main>

      <Footer></Footer>
    </div>
  );
};

export default App;
