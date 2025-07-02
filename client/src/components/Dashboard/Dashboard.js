import React, { useState, useEffect, useCallback } from 'react';
import Login from '../Auth/Login';
import Register from '../Auth/Register';
import DocumentList from '../Documents/DocumentList';
import DocumentForm from '../Documents/DocumentForm';
import './Dashboard.css';

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);

  const fetchDocuments = useCallback(async (token) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/documents', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      } else {
        // Token might be expired
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');
    
    if (token && email) {
      setIsAuthenticated(true);
      setUserEmail(email);
      fetchDocuments(token);
    }
  }, [fetchDocuments]);

  const searchDocuments = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/documents/search?query=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.error('Search failed');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching documents:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounce search
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchDocuments(query);
    }, 300);
  };

  let searchTimeout;

  const handleLogin = (token) => {
    setIsAuthenticated(true);
    setUserEmail(localStorage.getItem('userEmail'));
    fetchDocuments(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUserEmail('');
    setDocuments([]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleCreateDocument = () => {
    setEditingDocument(null);
    setShowDocumentForm(true);
  };

  const handleEditDocument = (document) => {
    console.log('Edit document called with:', document);
    setEditingDocument(document);
    setShowDocumentForm(true);
  };

  const handleDeleteDocument = async (documentId) => {
    console.log('Delete document called with ID:', documentId);
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Sending DELETE request to:', `http://localhost:8080/api/documents/${documentId}`);
      const response = await fetch(`http://localhost:8080/api/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Delete response status:', response.status);
      if (response.ok) {
        setDocuments(documents.filter(doc => doc.id !== documentId));
        setSearchResults(searchResults.filter(doc => doc.id !== documentId));
        console.log('Document deleted successfully');
      } else {
        const errorText = await response.text();
        console.error('Delete failed:', errorText);
        alert('Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Error deleting document');
    }
  };

  const handleDocumentSubmit = (document) => {
    console.log('Document submit called with:', document);
    console.log('Editing document:', editingDocument);
    if (editingDocument) {
      // Update existing document
      setDocuments(documents.map(doc => 
        doc.id === document.id ? document : doc
      ));
      setSearchResults(searchResults.map(doc => 
        doc.id === document.id ? document : doc
      ));
      console.log('Document updated in state');
    } else {
      // Add new document
      setDocuments([document, ...documents]);
      console.log('Document added to state');
    }
    setShowDocumentForm(false);
    setEditingDocument(null);
  };

  const handleDocumentFormCancel = () => {
    setShowDocumentForm(false);
    setEditingDocument(null);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const displayDocuments = searchQuery.trim() ? searchResults : documents;

  if (!isAuthenticated) {
    return (
      <div className="dashboard">
        {showLogin ? (
          <Login 
            onLogin={handleLogin} 
            switchToRegister={() => setShowLogin(false)} 
          />
        ) : (
          <Register 
            onLogin={handleLogin} 
            switchToLogin={() => setShowLogin(true)} 
          />
        )}
      </div>
    );
  }

  return (
    <div className={`dashboard${darkTheme ? ' dark-theme' : ''}`}>
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-logo-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: '#e3f0ff',
              borderRadius: '50%',
              padding: 0,
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <img src="/figga-logo.png.webp" alt="Frigga Logo" style={{ height: '28px', width: '28px', background: 'transparent', borderRadius: '50%' }} />
            </div>
            <h1 style={{ margin: 0 }}>Knowledge Base Platform</h1>
          </div>
          <button onClick={() => setDarkTheme(t => !t)} className="theme-toggle-btn" title="Toggle dark theme" style={{ marginLeft: 'auto', marginRight: '16px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
            {darkTheme ? '☀️' : '🌙'}
          </button>
          <div className="user-info">
            <span className="user-email">{userEmail}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="content-header">
            <div className="header-actions">
              <button 
                onClick={handleCreateDocument} 
                className="create-document-button"
              >
                + Create New Document
              </button>
            </div>
            
            <div className="search-container">
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                {searchQuery && (
                  <button onClick={clearSearch} className="clear-search-button">
                    ✕
                  </button>
                )}
              </div>
              {isSearching && (
                <div className="search-loading">
                  <div className="search-spinner"></div>
                  Searching...
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading your documents...</p>
            </div>
          ) : (
            <DocumentList
              documents={displayDocuments}
              onEdit={handleEditDocument}
              onDelete={handleDeleteDocument}
              onRefresh={() => fetchDocuments(localStorage.getItem('token'))}
              isSearchResults={searchQuery.trim() !== ''}
              searchQuery={searchQuery}
              darkTheme={darkTheme}
            />
          )}
        </div>
      </main>

      {showDocumentForm && (
        <DocumentForm
          onSubmit={handleDocumentSubmit}
          onCancel={handleDocumentFormCancel}
          initialData={editingDocument}
        />
      )}
    </div>
  );
};

export default Dashboard; 