import React, { useState } from 'react';
import { Search, MapPin, ExternalLink, Twitter, Building, Calendar, Users, Book, Star, GitFork } from 'lucide-react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUserData = async (searchUsername) => {
    setLoading(true);
    setError('');
    
    try {
      const userResponse = await fetch(`https://api.github.com/users/${searchUsername}`);
      
      if (!userResponse.ok) {
        throw new Error('User not found');
      }
      
      const user = await userResponse.json();
      setUserData(user);
      
      // Fetch user's repositories
      const reposResponse = await fetch(`https://api.github.com/users/${searchUsername}/repos?sort=updated&per_page=6`);
      const reposData = await reposResponse.json();
      setRepos(reposData);
      
    } catch (err) {
      setError(err.message);
      setUserData(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      fetchUserData(username.trim());
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1 className="title">GitHub Profile Finder</h1>
          <p className="subtitle">Search for GitHub users and explore their profiles</p>
        </header>

        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Enter GitHub username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="search-input"
            />
            <button 
              type="submit"
              disabled={loading}
              className="search-button"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
          </div>
        )}

        {userData && (
          <div className="profile-container">
            <div className="profile-header">
              <img 
                src={userData.avatar_url} 
                alt={userData.name || userData.login}
                className="avatar"
              />
              <div className="profile-info">
                <h2 className="name">{userData.name || userData.login}</h2>
                <p className="username">@{userData.login}</p>
                {userData.bio && <p className="bio">{userData.bio}</p>}
                
                <div className="stats">
                  <div className="stat">
                    <Users size={16} />
                    <span>{userData.followers} followers</span>
                  </div>
                  <div className="stat">
                    <span>{userData.following} following</span>
                  </div>
                  <div className="stat">
                    <Book size={16} />
                    <span>{userData.public_repos} repos</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-details">
              {userData.location && (
                <div className="detail">
                  <MapPin size={16} />
                  <span>{userData.location}</span>
                </div>
              )}
              {userData.blog && (
                <div className="detail">
                  <ExternalLink size={16} />
                  <a href={userData.blog.startsWith('http') ? userData.blog : `https://${userData.blog}`} 
                     target="_blank" 
                     rel="noopener noreferrer">
                    {userData.blog}
                  </a>
                </div>
              )}
              {userData.twitter_username && (
                <div className="detail">
                  <Twitter size={16} />
                  <a href={`https://twitter.com/${userData.twitter_username}`} 
                     target="_blank" 
                     rel="noopener noreferrer">
                    @{userData.twitter_username}
                  </a>
                </div>
              )}
              {userData.company && (
                <div className="detail">
                  <Building size={16} />
                  <span>{userData.company}</span>
                </div>
              )}
              <div className="detail">
                <Calendar size={16} />
                <span>Joined {formatDate(userData.created_at)}</span>
              </div>
            </div>

            {repos.length > 0 && (
              <div className="repos-section">
                <h3 className="repos-title">Latest Repositories</h3>
                <div className="repos-grid">
                  {repos.map((repo) => (
                    <div key={repo.id} className="repo-card">
                      <h4 className="repo-name">
                        <a href={repo.html_url} 
                           target="_blank" 
                           rel="noopener noreferrer">
                          {repo.name}
                        </a>
                      </h4>
                      {repo.description && (
                        <p className="repo-description">{repo.description}</p>
                      )}
                      <div className="repo-meta">
                        <div className="repo-meta-left">
                          {repo.language && (
                            <span className="language">{repo.language}</span>
                          )}
                        </div>
                        <div className="repo-stats">
                          <span className="stat">
                            <Star size={12} />
                            {repo.stargazers_count}
                          </span>
                          <span className="stat">
                            <GitFork size={12} />
                            {repo.forks_count}
                          </span>
                        </div>
                      </div>
                      <div className="repo-updated">
                        Updated {formatDate(repo.updated_at)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;