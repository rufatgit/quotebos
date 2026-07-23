import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api";
import "../searchResults.css";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [activeTab, setActiveTab] = useState("quotes");
  const [quotes, setQuotes] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;

      try {
        const [quotesRes, authorsRes, collectionsRes] = await Promise.all([
          api.get(`/quotes/search?q=${encodeURIComponent(query)}`),
          api.get(`/authors/search?q=${encodeURIComponent(query)}`),
          api.get(`/collections/search?q=${encodeURIComponent(query)}`),
        ]);

        setQuotes(quotesRes.data);
        setAuthors(authorsRes.data);
        setCollections(collectionsRes.data);
      } catch (error) {
        console.error("Error fetching search results", error);
      }
    };

    fetchResults();
  }, [query]);

  const counts = {
    quotes: quotes.length,
    authors: authors.length,
    collections: collections.length,
  };

  return (
    <div className="search-results">
      <h2>Search</h2>

      <div className="search-tabs">
        <span
          className={activeTab === "quotes" ? "active" : ""}
          onClick={() => setActiveTab("quotes")}
        >
          Quotes ({counts.quotes})
        </span>
        <span
          className={activeTab === "authors" ? "active" : ""}
          onClick={() => setActiveTab("authors")}
        >
          Authors ({counts.authors})
        </span>
        <span
          className={activeTab === "collections" ? "active" : ""}
          onClick={() => setActiveTab("collections")}
        >
          Collections ({counts.collections})
        </span>
      </div>

      <div className="search-results-list">
        {activeTab === "quotes" &&
          (quotes.length ? (
            quotes.map((q) => (
              <div className="search-result-item" key={q.id}>
                <p className="quote-text">"{q.quote}"</p>
                <p className="quote-author">- {q.author}</p>
              </div>
            ))
          ) : (
            <p className="no-results">No quotes found.</p>
          ))}

        {activeTab === "authors" &&
          (authors.length ? (
            authors.map((a) => (
              <Link
                to={`/authors/${a.id}`}
                className="search-result-item author-result"
                key={a.id}
              >
                <img
                  src={a.image_url || "/placeholder-author.png"}
                  alt={a.name}
                  className="author-photo"
                />
                <span>{a.name}</span>
              </Link>
            ))
          ) : (
            <p className="no-results">No authors found.</p>
          ))}

        {activeTab === "collections" &&
          (collections.length ? (
            collections.map((c) => (
              <Link
                to={`/collections/${c.id}`}
                className="search-result-item"
                key={c.id}
              >
                <span className="collection-title">{c.title}</span>
                <span className="collection-description">{c.description}</span>
              </Link>
            ))
          ) : (
            <p className="no-results">No collections found.</p>
          ))}
      </div>
    </div>
  );
}

export default SearchResults;
