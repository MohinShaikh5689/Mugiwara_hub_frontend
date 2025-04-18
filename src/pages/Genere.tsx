import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaBookmark, FaFire, FaTheaterMasks, FaFilm } from 'react-icons/fa';

interface Genre {
  mal_id: number;
  name: string;
  count: number;
}

const GenrePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  
  // Modern vibrant color palette for genres
  const colorPalette = [
    'text-rose-400', 'text-pink-400', 'text-fuchsia-400', 'text-purple-400',
    'text-violet-400', 'text-indigo-400', 'text-blue-400', 'text-sky-400',
    'text-cyan-400', 'text-teal-400', 'text-emerald-400', 'text-green-400',
    'text-lime-400', 'text-yellow-400', 'text-amber-400', 'text-orange-400',
    'text-red-400'
  ];

  // Card background gradients
  const gradientBgs = [
    'from-rose-900/30 to-purple-900/30',
    'from-pink-900/30 to-indigo-900/30',
    'from-fuchsia-900/30 to-blue-900/30',
    'from-purple-900/30 to-sky-900/30',
    'from-violet-900/30 to-cyan-900/30',
    'from-indigo-900/30 to-teal-900/30',
    'from-blue-900/30 to-emerald-900/30',
    'from-sky-900/30 to-green-900/30'
  ];

  // Genre categories with icons
  const genreGroups = [
    { 
      title: "Popular Genres", 
      icon: <FaFire className="text-amber-400 mr-2" />, 
      ids: [1, 2, 4, 8, 10, 22, 24] 
    },
    { 
      title: "Demographics", 
      icon: <FaBookmark className="text-sky-400 mr-2" />, 
      ids: [27, 25, 42, 43, 15] 
    },
    { 
      title: "Themes & Settings", 
      icon: <FaTheaterMasks className="text-violet-400 mr-2" />, 
      ids: [13, 23, 29, 31, 62, 18, 82, 36] 
    },
    { 
      title: "Story Elements", 
      icon: <FaFilm className="text-emerald-400 mr-2" />, 
      ids: [37, 30, 40, 41, 11, 14, 7] 
    }
  ];

  const genres: Genre[] = [
    { mal_id: 1, name: "Action", count: 5484 },
    { mal_id: 2, name: "Adventure", count: 4320 },
    { mal_id: 5, name: "Avant Garde", count: 1029 },
    { mal_id: 46, name: "Award Winning", count: 256 },
    { mal_id: 28, name: "Boys Love", count: 189 },
    { mal_id: 4, name: "Comedy", count: 7656 },
    { mal_id: 8, name: "Drama", count: 3045 },
    { mal_id: 10, name: "Fantasy", count: 5860 },
    { mal_id: 26, name: "Girls Love", count: 118 },
    { mal_id: 47, name: "Gourmet", count: 216 },
    { mal_id: 14, name: "Horror", count: 575 },
    { mal_id: 7, name: "Mystery", count: 974 },
    { mal_id: 22, name: "Romance", count: 2151 },
    { mal_id: 24, name: "Sci-Fi", count: 3419 },
    { mal_id: 36, name: "Slice of Life", count: 1545 },
    { mal_id: 30, name: "Sports", count: 800 },
    { mal_id: 37, name: "Supernatural", count: 1526 },
    { mal_id: 41, name: "Suspense", count: 449 },
    { mal_id: 51, name: "Anthropomorphic", count: 1170 },
    { mal_id: 52, name: "CGDCT", count: 262 },
    { mal_id: 53, name: "Childcare", count: 75 },
    { mal_id: 54, name: "Combat Sports", count: 94 },
    { mal_id: 81, name: "Crossdressing", count: 58 },
    { mal_id: 55, name: "Delinquents", count: 74 },
    { mal_id: 39, name: "Detective", count: 310 },
    { mal_id: 56, name: "Educational", count: 317 },
    { mal_id: 57, name: "Gag Humor", count: 265 },
    { mal_id: 58, name: "Gore", count: 271 },
    { mal_id: 59, name: "High Stakes Game", count: 55 },
    { mal_id: 13, name: "Historical", count: 1662 },
    { mal_id: 60, name: "Idols (Female)", count: 350 },
    { mal_id: 61, name: "Idols (Male)", count: 181 },
    { mal_id: 62, name: "Isekai", count: 425 },
    { mal_id: 63, name: "Iyashikei", count: 182 },
    { mal_id: 64, name: "Love Polygon", count: 109 },
    { mal_id: 66, name: "Mahou Shoujo", count: 346 },
    { mal_id: 17, name: "Martial Arts", count: 679 },
    { mal_id: 18, name: "Mecha", count: 1304 },
    { mal_id: 67, name: "Medical", count: 54 },
    { mal_id: 38, name: "Military", count: 731 },
    { mal_id: 19, name: "Music", count: 4898 },
    { mal_id: 6, name: "Mythology", count: 643 },
    { mal_id: 68, name: "Organized Crime", count: 105 },
    { mal_id: 69, name: "Otaku Culture", count: 111 },
    { mal_id: 20, name: "Parody", count: 798 },
    { mal_id: 70, name: "Performing Arts", count: 101 },
    { mal_id: 71, name: "Pets", count: 132 },
    { mal_id: 40, name: "Psychological", count: 449 },
    { mal_id: 3, name: "Racing", count: 264 },
    { mal_id: 72, name: "Reincarnation", count: 145 },
    { mal_id: 74, name: "Love Status Quo", count: 46 },
    { mal_id: 21, name: "Samurai", count: 246 },
    { mal_id: 23, name: "School", count: 2191 },
    { mal_id: 75, name: "Showbiz", count: 50 },
    { mal_id: 29, name: "Space", count: 662 },
    { mal_id: 11, name: "Strategy Game", count: 336 },
    { mal_id: 31, name: "Super Power", count: 709 },
    { mal_id: 76, name: "Survival", count: 75 },
    { mal_id: 77, name: "Team Sports", count: 321 },
    { mal_id: 78, name: "Time Travel", count: 150 },
    { mal_id: 32, name: "Vampire", count: 176 },
    { mal_id: 79, name: "Video Game", count: 160 },
    { mal_id: 80, name: "Visual Arts", count: 91 },
    { mal_id: 48, name: "Workplace", count: 221 },
    { mal_id: 82, name: "Urban Fantasy", count: 206 },
    { mal_id: 83, name: "Villainess", count: 21 },
    { mal_id: 43, name: "Josei", count: 157 },
    { mal_id: 15, name: "Kids", count: 6832 },
    { mal_id: 42, name: "Seinen", count: 1071 },
    { mal_id: 25, name: "Shoujo", count: 513 },
    { mal_id: 27, name: "Shounen", count: 2101 }
  ];


  // Filter genres based on search input
  const filteredGenres = searchTerm 
    ? genres.filter(genre => genre.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : genres;

  // Navigate to genre's anime list
  const navigateToGenre = (genreId: number, genreName: string) => {
    navigate(`/genres/${genreId}?name=${genreName}`);
  };

  // Assign a color based on genre id
  const getColorForGenre = (id: number) => {
    return colorPalette[id % colorPalette.length];
  };

  // Get a gradient background
  const getGradientBg = (id: number) => {
    return gradientBgs[id % gradientBgs.length];
  };

  // Get genres for a specific group
  const getGenresForGroup = (ids: number[]) => {
    return genres.filter(genre => ids.includes(genre.mal_id));
  };

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-20 px-4 sm:px-6 lg:px-8 pb-16">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section with Search */}
        <div className="relative rounded-2xl overflow-hidden mb-12 bg-gradient-to-r from-purple-900/50 to-indigo-900/50">
          <div className="relative z-10 p-8 sm:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Discover Anime by Genre</h1>
            <p className="text-white/80 max-w-2xl text-lg mb-8">
              From action-packed adventures to heartwarming romances, find your next favorite anime across different genres.
            </p>
            
            {/* Search Input */}
            <div className="max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search genres..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/30 backdrop-blur-sm text-white rounded-full py-3 px-5 pl-12 
                         focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-white/20"
                />
                <FaSearch className="absolute left-4 top-3.5 h-5 w-5 text-white/70" />
              </div>
            </div>
          </div>
        </div>

        {searchTerm ? (
          // Search Results
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-10"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Search Results for "{searchTerm}"
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredGenres.length > 0 ? (
                filteredGenres.map((genre) => (
                  <motion.div
                    key={genre.mal_id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigateToGenre(genre.mal_id, genre.name)}
                    className={`bg-gradient-to-br ${getGradientBg(genre.mal_id)} bg-[var(--bg-secondary)] rounded-lg p-5 cursor-pointer shadow-md hover:shadow-lg transition-all`}
                  >
                    <h3 className={`text-xl font-bold ${getColorForGenre(genre.mal_id)}`}>
                      {genre.name}
                    </h3>
                    <p className="text-gray-400 text-sm mt-2">{genre.count.toLocaleString()} titles</p>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-400">No genres found matching "{searchTerm}"</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          // Genre Groups
          <>
            {/* Featured Genres */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 20 }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FaFire className="text-amber-400 mr-2" /> Featured Genres
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: "Action", color: "text-red-400", gradient: "from-red-900/30 to-red-800/10" },
                  { name: "Romance", color: "text-pink-400", gradient: "from-pink-900/30 to-pink-800/10" },
                  { name: "Comedy", color: "text-amber-400", gradient: "from-amber-900/30 to-amber-800/10" },
                  { name: "Fantasy", color: "text-blue-400", gradient: "from-blue-900/30 to-blue-800/10" }
                ].map((item, index) => {
                  const genre = genres.find(g => g.name === item.name);
                  if (!genre) return null;
                  
                  return (
                    <motion.div
                      key={genre.mal_id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      onClick={() => navigateToGenre(genre.mal_id, genre.name)}
                      className={`relative overflow-hidden rounded-xl cursor-pointer h-36 sm:h-40 bg-gradient-to-br ${item.gradient} shadow-lg`}
                    >
                      <div className="absolute inset-0 flex flex-col justify-end p-5">
                        <h3 className={`text-2xl font-bold ${item.color}`}>
                          {genre.name}
                        </h3>
                        <p className="text-white/70 text-sm mt-1">{genre.count.toLocaleString()} anime</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Genre Categories - With modern card design */}
            {genreGroups.map((group, groupIndex) => (
              <motion.div 
                key={group.title} 
                className="mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 20 }}
                transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  {group.icon} {group.title}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {getGenresForGroup(group.ids).map((genre, index) => (
                    <motion.div
                      key={genre.mal_id}
                      whileHover={{ 
                        scale: 1.05,
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
                      }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 + groupIndex * 0.1 }}
                      onClick={() => navigateToGenre(genre.mal_id, genre.name)}
                      className={`bg-[var(--bg-secondary)] rounded-lg p-4 cursor-pointer transition-all border-l-4 ${getColorForGenre(genre.mal_id).replace('text-', 'border-')}`}
                    >
                      <h3 className={`text-lg font-semibold ${getColorForGenre(genre.mal_id)}`}>
                        {genre.name}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">{genre.count.toLocaleString()} anime</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* All Genres - Tag Cloud Style */}
            <motion.div 
              className="mt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">All Genres</h2>
              <div className="bg-[var(--bg-secondary)]/30 rounded-xl p-6 shadow-inner">
                <div className="flex flex-wrap gap-3">
                  {genres.map((genre, idx) => (
                    <motion.span
                      key={genre.mal_id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.01 }}
                      onClick={() => navigateToGenre(genre.mal_id, genre.name)}
                      className={`px-3 py-1.5 rounded-full cursor-pointer ${getColorForGenre(genre.mal_id)} bg-[var(--bg-secondary)] hover:bg-opacity-80 transition-all text-sm font-medium`}
                    >
                      {genre.name}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default GenrePage;