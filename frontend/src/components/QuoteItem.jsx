import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const QuoteItem = ({ quoteItem, fetchQuotes, onAuthorClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    quote: quoteItem.quote,
    author: quoteItem.author,
  });

  const handleUpdate = async () => {
    try {
      await api.put(`/quotes/${quoteItem.id}`, editForm);
      setIsEditing(false);
      await fetchQuotes();
    } catch (error) {
      console.error("Error updating quote", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this quote?")) {
      try {
        await api.delete(`/quotes/${quoteItem.id}`);
        await fetchQuotes();
      } catch (error) {
        console.error("Error deleting quote", error);
      }
    }
  };

  return (
    <div className="quote-card">
      {isEditing ? (
        <>
          <input
            value={editForm.quote}
            onChange={(e) =>
              setEditForm({ ...editForm, quote: e.target.value })
            }
          />
          <input
            value={editForm.author}
            onChange={(e) =>
              setEditForm({ ...editForm, author: e.target.value })
            }
          />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <p className="quote-text">"{quoteItem.quote}"</p>
          <p className="quote-author">
            -{" "}
            <Link
              to={`/authors/${quoteItem.author_id}`}
              className="quote-author-link"
              onClick={onAuthorClick}
            >
              {quoteItem.author}
            </Link>
          </p>
          <div className="card-actions">
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default QuoteItem;
