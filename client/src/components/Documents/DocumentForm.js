import React, { useState, useRef, useEffect } from 'react';
import './Documents.css';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [useSimpleEditor, setUseSimpleEditor] = useState(false);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const handleFormat = (format) => {
    switch (format) {
      case 'bold':
        execCommand('bold');
        setIsBold(!isBold);
        break;
      case 'italic':
        execCommand('italic');
        setIsItalic(!isItalic);
        break;
      case 'underline':
        execCommand('underline');
        setIsUnderline(!isUnderline);
        break;
      case 'insertUnorderedList':
        execCommand('insertUnorderedList');
        break;
      case 'insertOrderedList':
        execCommand('insertOrderedList');
        break;
      default:
        break;
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleKeyDown = (e) => {
    // Handle Enter key for new lines
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.execCommand('insertLineBreak', false, null);
    }
  };

  // Simple textarea fallback
  if (useSimpleEditor) {
    return (
      <div className="rich-text-editor">
        <div className="editor-toolbar">
          <span style={{ fontSize: '0.9rem', color: '#666' }}>Simple Editor</span>
          <button
            type="button"
            onClick={() => setUseSimpleEditor(false)}
            className="toolbar-button"
            style={{ marginLeft: 'auto' }}
          >
            Switch to Rich Editor
          </button>
        </div>
        <textarea
          value={value.replace(/<[^>]*>/g, '')}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="editor-content"
          style={{
            border: 'none',
            resize: 'vertical',
            fontFamily: 'inherit',
            fontSize: '1rem',
            lineHeight: '1.6'
          }}
        />
      </div>
    );
  }

  return (
    <div className="rich-text-editor">
      <div className="editor-toolbar">
        <button
          type="button"
          onClick={() => handleFormat('bold')}
          className={`toolbar-button ${isBold ? 'active' : ''}`}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => handleFormat('italic')}
          className={`toolbar-button ${isItalic ? 'active' : ''}`}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => handleFormat('underline')}
          className={`toolbar-button ${isUnderline ? 'active' : ''}`}
          title="Underline"
        >
          <u>U</u>
        </button>
        <div className="toolbar-separator"></div>
        <button
          type="button"
          onClick={() => handleFormat('insertUnorderedList')}
          className="toolbar-button"
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => handleFormat('insertOrderedList')}
          className="toolbar-button"
          title="Numbered List"
        >
          1. List
        </button>
        <button
          type="button"
          onClick={() => setUseSimpleEditor(true)}
          className="toolbar-button"
          style={{ marginLeft: 'auto' }}
          title="Switch to Simple Editor"
        >
          Simple
        </button>
      </div>
      <div
        ref={editorRef}
        className="editor-content"
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
    </div>
  );
};

const DocumentForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    visibility: initialData?.visibility || 'PRIVATE'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update form data when initialData changes (for edit mode)
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

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = initialData 
        ? `http://localhost:8080/api/documents/${initialData.id}`
        : 'http://localhost:8080/api/documents';
      
      console.log('Submitting document:', {
        url,
        method: initialData ? 'PUT' : 'POST',
        formData,
        initialData
      });
      
      const response = await fetch(url, {
        method: initialData ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        onSubmit(data);
      } else {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        setError(errorData || 'Failed to save document');
      }
    } catch (err) {
      console.error('Network error:', err);
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
            <RichTextEditor
              value={formData.content}
              onChange={handleContentChange}
              placeholder="Write your document content here..."
            />
            <div className="char-count">
              {formData.content.replace(/<[^>]*>/g, '').length}/10000 characters
            </div>
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