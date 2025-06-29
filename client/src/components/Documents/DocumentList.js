import React, { useState, useEffect } from 'react';
import './Documents.css';

const DocumentList = ({ documents, onEdit, onDelete, onRefresh, isSearchResults = false, searchQuery = '' }) => {
  const [filterVisibility, setFilterVisibility] = useState('ALL');
  const [filteredDocuments, setFilteredDocuments] = useState(documents);

  useEffect(() => {
    let filtered = documents;

    // Filter by visibility (only if not showing search results)
    if (!isSearchResults && filterVisibility !== 'ALL') {
      filtered = filtered.filter(doc => doc.visibility === filterVisibility);
    }

    setFilteredDocuments(filtered);
  }, [documents, filterVisibility, isSearchResults]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const highlightSearchTerm = (text, query) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="search-highlight">{part}</mark>
      ) : part
    );
  };

  const getTitle = () => {
    if (isSearchResults) {
      return `Search Results for "${searchQuery}" (${filteredDocuments.length})`;
    }
    return `My Documents (${filteredDocuments.length})`;
  };

  return (
    <div className="document-list-container">
      <div className="document-list-header">
        <h2>{getTitle()}</h2>
        
        {!isSearchResults && (
          <div className="document-filters">
            <select
              value={filterVisibility}
              onChange={(e) => setFilterVisibility(e.target.value)}
              className="visibility-filter"
            >
              <option value="ALL">All Documents</option>
              <option value="PUBLIC">Public</option>
              <option value="PRIVATE">Private</option>
            </select>
          </div>
        )}
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            {isSearchResults ? '🔍' : '📄'}
          </div>
          <h3>
            {isSearchResults ? 'No search results found' : 'No documents found'}
          </h3>
          <p>
            {isSearchResults 
              ? `No documents match "${searchQuery}". Try a different search term.`
              : filterVisibility !== 'ALL' 
                ? 'Try adjusting your filters'
                : 'Create your first document to get started'
            }
          </p>
        </div>
      ) : (
        <div className="document-grid">
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="document-card">
              <div className="document-card-header">
                <div className="document-title">
                  <h3>
                    {isSearchResults 
                      ? highlightSearchTerm(doc.title, searchQuery)
                      : doc.title
                    }
                  </h3>
                  <span className={`visibility-badge ${doc.visibility.toLowerCase()}`}>
                    {doc.visibility}
                  </span>
                </div>
                <div className="document-actions">
                  <button
                    onClick={() => {
                      console.log('Edit button clicked for document:', doc);
                      onEdit(doc);
                    }}
                    className="action-button edit"
                    title="Edit document"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => {
                      console.log('Delete button clicked for document ID:', doc.id);
                      onDelete(doc.id);
                    }}
                    className="action-button delete"
                    title="Delete document"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div className="document-content">
                <p>
                  {isSearchResults 
                    ? highlightSearchTerm(truncateContent(doc.content), searchQuery)
                    : truncateContent(doc.content)
                  }
                </p>
              </div>
              
              <div className="document-footer">
                <div className="document-meta">
                  <span className="created-date">
                    Created: {formatDate(doc.createdAt)}
                  </span>
                  {doc.updatedAt !== doc.createdAt && (
                    <span className="updated-date">
                      Updated: {formatDate(doc.updatedAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentList; 