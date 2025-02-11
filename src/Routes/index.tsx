import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import AnimeDetailPage from "../pages/AnimeDetailPage";
import SearchResults from "../pages/searchResultPage";
import Login from "../pages/LogIn";
import SignUpPage from "../pages/SignUpPage";
import LandingPage from "../pages/LandingPage";
import Profile from "../pages/Profile";

import RequireAuth from "../components/requireAuth";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/anime/:id" element={<AnimeDetailPage />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/anime/trending" element={<Home filter="trending" />} />
      <Route path="/anime/popular" element={<Home filter="popular" />} />
      <Route path="/anime/upcoming" element={<Home filter="upcoming" />} />
      <Route path="/anime/airing" element={<Home filter="airing" />} />
      
      {/* Protected Routes */}
      {/* <Route element={<RequireAuth />}>
        <Route path="/community" element={<Community />} />
      </Route> */}

      <Route element={<RequireAuth />}>
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;