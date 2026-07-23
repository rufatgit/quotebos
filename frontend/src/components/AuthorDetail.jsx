import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import "../authorDetail.css";

function AuthorDetail() {
  const [author, setAuthor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    image_url: "",
    bio: "",
    born: "",
    died: "",
    profession: "",
  });
  const { id } = useParams();

  const fetchAuthor = useCallback(async () => {
    try {
      const response = await api.get(`/authors/${id}`);
      setAuthor(response.data);
      setEditForm({
        name: response.data.name || "",
        image_url: response.data.image_url || "",
        bio: response.data.bio || "",
        born: response.data.born || "",
        died: response.data.died || "",
        profession: response.data.profession || "",
      });
    } catch (error) {
      console.error("Error fetching author", error);
    }
  }, [id]);

  useEffect(() => {
    fetchAuthor();
  }, [fetchAuthor]);

  const handleUpdate = async () => {
    try {
      await api.put(`/authors/${id}`, editForm);
      setIsEditing(false);
      await fetchAuthor();
    } catch (error) {
      console.error("Error updating author", error);
    }
  };

  if (!author) return <div className="author-detail-loading">Loading...</div>;

  if (isEditing) {
    return (
      <div className="author-detail">
        <input
          value={editForm.name}
          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          placeholder="Name"
        />
        <input
          value={editForm.image_url}
          onChange={(e) =>
            setEditForm({ ...editForm, image_url: e.target.value })
          }
          placeholder="Image URL"
        />
        <input
          value={editForm.bio}
          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
          placeholder="Bio"
        />
        <input
          value={editForm.born}
          onChange={(e) => setEditForm({ ...editForm, born: e.target.value })}
          placeholder="Born"
        />
        <input
          value={editForm.died}
          onChange={(e) => setEditForm({ ...editForm, died: e.target.value })}
          placeholder="Died"
        />
        <input
          value={editForm.profession}
          onChange={(e) =>
            setEditForm({ ...editForm, profession: e.target.value })
          }
          placeholder="Profession"
        />
        <div className="author-detail-actions">
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="author-detail">
      <img
        src={author.image_url || "/placeholder-author.png"}
        alt={author.name}
        className="author-detail-photo"
      />
      <h1 className="author-detail-name">{author.name}</h1>

      {(author.born || author.died) && (
        <p className="author-detail-dates">
          {author.born || "?"} – {author.died || "Present"}
        </p>
      )}

      {author.profession && (
        <p className="author-detail-profession">{author.profession}</p>
      )}

      {author.bio && <p className="author-detail-bio">{author.bio}</p>}

      <div className="author-detail-actions">
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </div>
    </div>
  );
}

export default AuthorDetail;
