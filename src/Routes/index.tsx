import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import AnimeDetailPage from "../pages/AnimeDetailPage";
import SearchResults from "../pages/searchResultPage";
import Login from "../pages/LogIn";
import SignUpPage from "../pages/SignUpPage";
import LandingPage from "../pages/LandingPage";
import Profile from "../pages/Profile";
import CommunityPage from "../pages/CommunityPage";
import VisitPage from "../pages/visitProfilePage";
import NotFoundPage from "../pages/notFoundPage";
import FriendsPage from "../pages/FriendsPage";
import RequireAuth from "../components/requireAuth";
import RecommendationPage from "../pages/RecommendationPage";
import ChatComponent from "../pages/ChatPage";
import Add_friend from "../components/Add_friend";
import CommunityChat from "../pages/communityChat";
import CommunityDetails from "../pages/CommunityDetails";
import CommunityJoin from "../pages/communityJoin";
import GenrePage from "../pages/Genere";
import NotificationPage from "../pages/NotificationPage";
import ProfileSettings from "../pages/profileSettengs";
import CommunityEditPage from "../pages/communityEditPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes - Access without login */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="*" element={<NotFoundPage />} />

      {/* Anime Content Routes - Should require login but commonly public */}
      <Route element={<RequireAuth />}>
        <Route path="/Anime" element={<RecommendationPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/anime/:id" element={<AnimeDetailPage />} />
        <Route path="/search/:query" element={<SearchResults />} />
        <Route path="/anime/trending" element={<Home filter="trending" />} />
        <Route path="/anime/popular" element={<Home filter="popular" />} />
        <Route path="/anime/upcoming" element={<Home filter="upcoming" />} />
        <Route path="/anime/airing" element={<Home filter="airing" />} />
        <Route path="/genres/:genreId" element={<Home />} />
        <Route path="/recommendations" element={<RecommendationPage />} />
        <Route path="/genres/" element={<GenrePage />} />
      </Route>

      {/* User Profile & Social Routes - Protected */}
      <Route element={<RequireAuth />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/settings" element={<ProfileSettings />} />
        <Route path="/users/:userId" element={<VisitPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/addfriends" element={<Add_friend />} />
        <Route path="/chat/:id" element={<ChatComponent />} />
        <Route path="/notifications" element={<NotificationPage />} />
      </Route>

      {/* Community Routes - Protected */}
      <Route element={<RequireAuth />}>
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/communitychat/:id" element={<CommunityChat />} />
        <Route path="/communitydetails/:id" element={<CommunityDetails />} />
        <Route path="/community/join/:id" element={<CommunityJoin />} />
        <Route path="/community/edit/:id" element={<CommunityEditPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;