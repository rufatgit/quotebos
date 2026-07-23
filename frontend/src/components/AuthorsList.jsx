import { useEffect, useLayoutEffect, useState, useCallback } from "react";
import api from "../api";
import "../authors.css";
import { Link } from "react-router-dom";
import AddAuthorForm from "./AddAuthorForm";

function AuthorsList({ searchQuery }) {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAuthors = useCallback(async () => {
    try {
      const endpoint = searchQuery
        ? `/authors/search?q=${searchQuery}`
        : "/authors/";
      const response = await api.get(endpoint);
      setAuthors(response.data);
    } catch (error) {
      console.error("Error fetching authors", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  useLayoutEffect(() => {
    if (loading) return;

    const savedScroll = sessionStorage.getItem("authors-scroll");
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll, 10));
      sessionStorage.removeItem("authors-scroll");
    }
  }, [loading]);

  const saveScroll = () => {
    sessionStorage.setItem("authors-scroll", window.scrollY);
  };

  return (
    <div>
      <h2>List of Authors</h2>

      <div className="authors-list">
        {authors.map((author) => (
          <Link
            to={`/authors/${author.id}`}
            className="author-row"
            key={author.id}
            onClick={saveScroll}
          >
            <img
              src={author.image_url || "/placeholder-author.png"}
              alt={author.name}
              className="author-photo"
            />
            <span className="author-name">{author.name}</span>
          </Link>
        ))}
      </div>

      <AddAuthorForm
        addAuthor={async (data) => {
          await api.post("/authors/", data);
          fetchAuthors();
        }}
      />
    </div>
  );
}

export default AuthorsList;
