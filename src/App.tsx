import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './Routes'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { SearchProvider } from './context/searchContext'
import { LayoutProvider, useLayout } from './context/layoutContex'
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", { withCredentials: true });

export const useSocket = () => {
  const [isOnline, setIsOnline] = useState({});

  useEffect(() => {
    const userId = localStorage.getItem("userId"); // Replace with actual user authentication logic

    if (userId) {
      socket.emit("online", userId);
    }

    socket.on("user_online", (onlineUserId) => {
      setIsOnline((prev) => ({ ...prev, [onlineUserId]: true }));
    });

    socket.on("user_offline", (offlineUserId) => {
      setIsOnline((prev) => ({ ...prev, [offlineUserId]: false }));
    });

    return () => {
      if (userId) {
        socket.emit("offline", userId);
      }
      socket.disconnect();
    };
  }, []);

  return { socket, isOnline };
};



const AppContent = () => {
  const { showNavbar, showFooter } = useLayout();

  return (
    <div className="app-container">
      {showNavbar && <Navbar />}
      <main className={showNavbar ? "pt-16" : ""}> 
        <AppRoutes />
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <LayoutProvider>
      <SearchProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </SearchProvider>
    </LayoutProvider>
  );
}

export default App
