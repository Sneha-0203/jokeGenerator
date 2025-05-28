import { useState, useEffect } from 'react';

// OMDb API configuration
const OMDB_API_KEY = 'a44bc2b1';
const BASE_URL = 'https://www.omdbapi.com';

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    // Load popular movies on initial load
    searchMovies('popular', 1);
  }, []);

  const makeAPIRequest = async (url) => {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection.');
      }
      throw err;
    }
  };

  const searchMovies = async (query = searchTerm, page = 1) => {
    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const searchQuery = query === 'popular' ? 'marvel' : query; // Default to marvel for popular
      const data = await makeAPIRequest(`${BASE_URL}/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(searchQuery)}&type=movie&page=${page}`);
      
      if (data.Response === 'True') {
        if (page === 1) {
          setMovies(data.Search);
        } else {
          setMovies(prev => [...prev, ...data.Search]);
        }
        setTotalResults(parseInt(data.totalResults));
        setCurrentPage(page);
      } else {
        if (page === 1) {
          setMovies([]);
          setError(data.Error || 'No movies found. Try a different search term.');
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to search movies. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieDetails = async (imdbId) => {
    setLoadingDetails(true);
    try {
      const movieDetails = await makeAPIRequest(`${BASE_URL}/?apikey=${OMDB_API_KEY}&i=${imdbId}&plot=full`);
      if (movieDetails.Response === 'True') {
        setSelectedMovie(movieDetails);
      } else {
        setError('Failed to load movie details.');
      }
    } catch (err) {
      console.error('Failed to fetch movie details:', err);
      setError('Failed to load movie details. Please try again.');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchTerm.trim()) {
      setCurrentPage(1);
      searchMovies(searchTerm, 1);
    }
  };

  const loadMoreMovies = () => {
    if (movies.length < totalResults) {
      searchMovies(searchTerm || 'popular', currentPage + 1);
    }
  };

  const handleMovieClick = async (imdbId) => {
    await fetchMovieDetails(imdbId);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const getImageUrl = (poster) => {
    return poster && poster !== 'N/A' ? poster : null;
  };

  const parseActors = (actors) => {
    if (!actors || actors === 'N/A') return [];
    return actors.split(', ').slice(0, 6); // Limit to 6 actors
  };

  const parseGenres = (genres) => {
    if (!genres || genres === 'N/A') return [];
    return genres.split(', ');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0f0f23', 
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem 1rem',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          margin: '0 0 1.5rem 0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          fontWeight: 'bold'
        }}>
          🎬 CineSearch
        </h1>
        
        {/* Search Form */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '0.5rem',
          maxWidth: '600px',
          margin: '0 auto 2rem auto'
        }}>
          <input
            type="text"
            placeholder="Search for movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            style={{
              flex: 1,
              padding: '15px 20px',
              fontSize: '16px',
              border: 'none',
              borderRadius: '30px',
              outline: 'none',
              backgroundColor: 'rgba(255,255,255,0.95)',
              color: '#333',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
          />
          <button 
            type="button"
            onClick={handleSearch}
            style={{
              padding: '15px 30px',
              fontSize: '16px',
              backgroundColor: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(255,107,107,0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#ff5252';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#ff6b6b';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Search
          </button>
        </div>

        {/* Quick Search Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          {['Marvel', 'Batman', 'Star Wars', 'Disney'].map((term) => (
            <button
              key={term}
              onClick={() => {
                setSearchTerm(term);
                searchMovies(term, 1);
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: 'bold'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      <main style={{ padding: '2rem 1rem' }}>
        {/* Section Title */}
        <h2 style={{
          textAlign: 'center',
          fontSize: '2rem',
          margin: '0 0 2rem 0',
          color: '#667eea',
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
        }}>
          {searchTerm ? `🔍 Search Results for "${searchTerm}"` : '🎬 Popular Movies'}
          {totalResults > 0 && (
            <span style={{ fontSize: '1rem', color: '#aaa', display: 'block', marginTop: '0.5rem' }}>
              {movies.length} of {totalResults} results
            </span>
          )}
        </h2>

        {/* Loading State */}
        {loading && movies.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            fontSize: '1.2rem',
            padding: '3rem',
            color: '#667eea'
          }}>
            <div style={{
              fontSize: '2rem',
              marginBottom: '1rem',
              animation: 'pulse 1.5s infinite'
            }}>
              🎬
            </div>
            Loading movies...
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div style={{ 
            textAlign: 'center', 
            color: '#ff6b6b',
            fontSize: '1.1rem',
            padding: '2rem',
            backgroundColor: 'rgba(255,107,107,0.1)',
            borderRadius: '12px',
            margin: '2rem auto',
            maxWidth: '600px',
            border: '1px solid rgba(255,107,107,0.3)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
            {error}
            <button
              onClick={() => setError('')}
              style={{
                marginTop: '1rem',
                padding: '8px 16px',
                backgroundColor: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer'
              }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Movies Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '1600px',
          margin: '0 auto'
        }}>
          {movies.map((movie) => (
            <div 
              key={movie.imdbID} 
              onClick={() => handleMovieClick(movie.imdbID)}
              style={{
                backgroundColor: '#1a1a3a',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                border: '1px solid rgba(102,126,234,0.2)',
                position: 'relative'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(102,126,234,0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
              }}
            >
              <div style={{ 
                height: '400px', 
                backgroundColor: '#2a2a4a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {getImageUrl(movie.Poster) ? (
                  <img 
                    src={getImageUrl(movie.Poster)} 
                    alt={movie.Title} 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                  />
                ) : (
                  <div style={{
                    color: '#888',
                    textAlign: 'center',
                    padding: '2rem',
                    fontSize: '3rem'
                  }}>
                    🎬
                  </div>
                )}
              </div>
              
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ 
                  margin: '0 0 0.5rem 0', 
                  fontSize: '1.4rem',
                  color: '#ffffff',
                  lineHeight: '1.3',
                  fontWeight: 'bold'
                }}>
                  {movie.Title}
                </h3>
                <p style={{ 
                  margin: '0', 
                  color: '#aaa',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  📅 {movie.Year}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {movies.length > 0 && movies.length < totalResults && (
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button
              onClick={loadMoreMovies}
              disabled={loading}
              style={{
                padding: '15px 30px',
                fontSize: '16px',
                backgroundColor: loading ? '#666' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(102,126,234,0.3)'
              }}
            >
              {loading ? 'Loading...' : 'Load More Movies'}
            </button>
          </div>
        )}

        {/* Empty State */}
        {movies.length === 0 && !loading && !error && (
          <div style={{ 
            textAlign: 'center', 
            color: '#888',
            fontSize: '1.5rem',
            padding: '4rem',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '20px',
            margin: '2rem auto',
            maxWidth: '500px'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎭</div>
            Search for movies to get started
          </div>
        )}
      </main>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
            backdropFilter: 'blur(10px)'
          }}
          onClick={closeModal}
        >
          <div 
            style={{
              backgroundColor: '#1a1a3a',
              borderRadius: '20px',
              maxWidth: '1000px',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative',
              border: '2px solid rgba(102,126,234,0.3)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                backgroundColor: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                fontSize: '24px',
                cursor: 'pointer',
                zIndex: 1001,
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(255,107,107,0.3)'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#ff5252'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ff6b6b'}
            >
              ×
            </button>
            
            {loadingDetails ? (
              <div style={{
                padding: '4rem',
                textAlign: 'center',
                color: '#667eea',
                fontSize: '1.2rem'
              }}>
                <div style={{
                  fontSize: '2rem',
                  marginBottom: '1rem',
                  animation: 'pulse 1.5s infinite'
                }}>
                  🎬
                </div>
                Loading movie details...
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem', padding: '2.5rem' }}>
                <div style={{ flexShrink: 0 }}>
                  {getImageUrl(selectedMovie.Poster) ? (
                    <img 
                      src={getImageUrl(selectedMovie.Poster)} 
                      alt={selectedMovie.Title} 
                      style={{
                        width: '320px',
                        height: '480px',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '320px',
                      height: '480px',
                      backgroundColor: '#2a2a4a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '12px',
                      color: '#888',
                      fontSize: '4rem'
                    }}>
                      🎬
                    </div>
                  )}
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{ 
                    margin: '0 0 1.5rem 0', 
                    color: '#ffffff',
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    lineHeight: '1.2'
                  }}>
                    {selectedMovie.Title}
                  </h2>
                  
                  <div style={{ 
                    display: 'flex', 
                    gap: '2rem', 
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap',
                    fontSize: '1.1rem'
                  }}>
                    <span style={{ color: '#aaa', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      📅 {selectedMovie.Year}
                    </span>
                    {selectedMovie.Runtime && selectedMovie.Runtime !== 'N/A' && (
                      <span style={{ color: '#aaa', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        ⏱️ {selectedMovie.Runtime}
                      </span>
                    )}
                    {selectedMovie.imdbRating && selectedMovie.imdbRating !== 'N/A' && (
                      <span style={{ 
                        color: '#ffd700', 
                        fontWeight: 'bold',
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem'
                      }}>
                        ⭐ {selectedMovie.imdbRating}/10
                      </span>
                    )}
                    {selectedMovie.Rated && selectedMovie.Rated !== 'N/A' && (
                      <span style={{
                        backgroundColor: '#667eea',
                        color: 'white',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '15px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                      }}>
                        {selectedMovie.Rated}
                      </span>
                    )}
                  </div>

                  {parseGenres(selectedMovie.Genre).length > 0 && (
                    <div style={{ marginBottom: '2rem' }}>
                      {parseGenres(selectedMovie.Genre).map((genre, index) => (
                        <span 
                          key={index}
                          style={{
                            display: 'inline-block',
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            fontSize: '0.9rem',
                            marginRight: '0.5rem',
                            marginBottom: '0.5rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}

                  {selectedMovie.Plot && selectedMovie.Plot !== 'N/A' && (
                    <p style={{ 
                      color: '#ddd', 
                      lineHeight: '1.8',
                      fontSize: '1.1rem',
                      marginBottom: '2rem',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      padding: '1.5rem',
                      borderRadius: '12px',
                      borderLeft: '4px solid #667eea'
                    }}>
                      {selectedMovie.Plot}
                    </p>
                  )}

                  {/* Additional Info */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '1rem',
                    marginBottom: '2rem'
                  }}>
                    {selectedMovie.Director && selectedMovie.Director !== 'N/A' && (
                      <div style={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        padding: '1rem',
                        borderRadius: '8px'
                      }}>
                        <strong style={{ color: '#667eea' }}>Director:</strong>
                        <div style={{ color: '#ddd', marginTop: '0.5rem' }}>{selectedMovie.Director}</div>
                      </div>
                    )}
                    {selectedMovie.Writer && selectedMovie.Writer !== 'N/A' && (
                      <div style={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        padding: '1rem',
                        borderRadius: '8px'
                      }}>
                        <strong style={{ color: '#667eea' }}>Writer:</strong>
                        <div style={{ color: '#ddd', marginTop: '0.5rem' }}>{selectedMovie.Writer}</div>
                      </div>
                    )}
                    {selectedMovie.BoxOffice && selectedMovie.BoxOffice !== 'N/A' && (
                      <div style={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        padding: '1rem',
                        borderRadius: '8px'
                      }}>
                        <strong style={{ color: '#667eea' }}>Box Office:</strong>
                        <div style={{ color: '#ddd', marginTop: '0.5rem' }}>{selectedMovie.BoxOffice}</div>
                      </div>
                    )}
                    {selectedMovie.Awards && selectedMovie.Awards !== 'N/A' && (
                      <div style={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        padding: '1rem',
                        borderRadius: '8px'
                      }}>
                        <strong style={{ color: '#667eea' }}>Awards:</strong>
                        <div style={{ color: '#ddd', marginTop: '0.5rem' }}>{selectedMovie.Awards}</div>
                      </div>
                    )}
                  </div>

                  {/* Cast Section */}
                  {parseActors(selectedMovie.Actors).length > 0 && (
                    <div style={{ marginTop: '2rem' }}>
                      <h3 style={{ 
                        color: '#ffffff', 
                        fontSize: '1.8rem', 
                        marginBottom: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 'bold'
                      }}>
                        🎭 Main Cast
                      </h3>
                      
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1rem'
                      }}>
                        {parseActors(selectedMovie.Actors).map((actor, index) => (
                          <div 
                            key={index}
                            style={{
                              backgroundColor: 'rgba(102,126,234,0.1)',
                              borderRadius: '12px',
                              padding: '1rem',
                              border: '1px solid rgba(102,126,234,0.3)',
                              color: '#fff',
                              fontSize: '1rem',
                              fontWeight: 'bold'
                            }}
                          >
                            {actor}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          
          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: #1a1a3a;
          }
          
          ::-webkit-scrollbar-thumb {
            background: #667eea;
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: #764ba2;
          }

          /* Responsive design */
          @media (max-width: 768px) {
            .modal-content {
              flex-direction: column !important;
            }
            
            .modal-poster {
              width: 100% !important;
              max-width: 300px !important;
              height: auto !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default App;