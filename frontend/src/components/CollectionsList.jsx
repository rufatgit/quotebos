import { useEffect, useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "../collections.css";

function CollectionsList({ searchQuery }) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const fetchCollections = async () => {
        try {
          const endpoint = searchQuery
            ? `/collections/search?q=${searchQuery}`
            : "/collections/";
          const response = await api.get(endpoint);
          setCollections(response.data);
        } catch (error) {
          console.error("Error fetching collections", error);
        } finally {
          setLoading(false);
        }
      };
      fetchCollections();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  useLayoutEffect(() => {
    if (loading) return;

    const savedScroll = sessionStorage.getItem("collections-scroll");
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll, 10));
      sessionStorage.removeItem("collections-scroll");
    }
  }, [loading]);

  const saveScroll = () => {
    sessionStorage.setItem("collections-scroll", window.scrollY);
  };

  return (
    <div>
      <h2>Collections</h2>

      <div className="collections-list">
        {collections.map((collection) => (
          <Link
            to={`/collections/${collection.id}`}
            className="collection-row"
            key={collection.id}
            onClick={saveScroll}
          >
            <span className="collection-title">{collection.title}</span>
            <span className="collection-description">
              {collection.description}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CollectionsList;
