import './App.css'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './Routes'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { SearchProvider } from './context/searchContext'

function App() {
  return (
    <SearchProvider>
      <div className="app-container">
        <BrowserRouter>
          <Navbar />
          <main className="pt-16"> {/* Add padding-top here */}
            <AppRoutes />
          </main>
          <Footer />
        </BrowserRouter>
      </div>
    </SearchProvider>
  )
}

export default App
