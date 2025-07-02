import React, { useEffect, useState } from 'react';

const DocumentComments = ({ documentId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [documentId]);

  const fetchComments = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/comments/document/${documentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        setError('Failed to fetch comments');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await fetch('http://localhost:8080/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          text: newComment,
          authorId: userId,
          documentId: documentId
        })
      });
      if (response.ok) {
        setNewComment('');
        fetchComments();
      } else {
        setError('Failed to add comment');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comments-modal-overlay">
      <div className="comments-modal">
        <div className="comments-header">
          <h3>Comments</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        {loading && <div>Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        <div className="comments-list">
          {comments.length === 0 ? (
            <div className="no-comments">No comments yet.</div>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="comment-item">
                <div className="comment-meta">
                  <span>User {comment.authorId}</span>
                  <span>{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <div className="comment-text">{comment.text}</div>
              </div>
            ))
          )}
        </div>
        <form className="add-comment-form" onSubmit={handleAddComment}>
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
          />
          <button type="submit" disabled={loading || !newComment.trim()}>
            Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default DocumentComments; 