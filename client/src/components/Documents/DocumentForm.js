import React, { useState, useEffect, useRef } from 'react';
import './Documents.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const DocumentForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    visibility: initialData?.visibility || 'PRIVATE'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const quillRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        visibility: initialData.visibility || 'PRIVATE'
      });
    } else {
      setFormData({
        title: '',
        content: '',
        visibility: 'PRIVATE'
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleContentChange = (content) => {
    setFormData({
      ...formData,
      content: content
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let contentToSave = formData.content;
    if (quillRef.current && quillRef.current.getEditor) {
      contentToSave = quillRef.current.getEditor().root.innerHTML;
    }

    if (!formData.title.trim() || !contentToSave.trim()) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = initialData 
        ? `http://localhost:8080/api/documents/${initialData.id}`
        : 'http://localhost:8080/api/documents';
      const response = await fetch(url, {
        method: initialData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, content: contentToSave }),
      });
      if (response.ok) {
        const data = await response.json();
        onSubmit(data);
      } else {
        const errorData = await response.text();
        setError(errorData || 'Failed to save document');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="document-form-overlay">
      <div className="document-form-container">
        <div className="document-form-header">
          <h2>{initialData ? 'Edit Document' : 'Create New Document'}</h2>
          <button onClick={onCancel} className="close-button">×</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="document-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter document title"
              maxLength="200"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <ReactQuill
              ref={quillRef}
              value={formData.content}
              onChange={handleContentChange}
              placeholder="Enter document content..."
              theme="snow"
            />
          </div>

          <div className="form-group">
            <label htmlFor="visibility">Visibility</label>
            <select
              id="visibility"
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
            >
              <option value="PRIVATE">Private</option>
              <option value="PUBLIC">Public</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Saving...' : (initialData ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentForm; 