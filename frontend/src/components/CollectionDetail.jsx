import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import "../collectionDetail.css";

function CollectionDetail() {
  const [collection, setCollection] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await api.get(`/collections/${id}`);
        setCollection(response.data);
      } catch (error) {
        console.error("Error fetching collection", error);
      }
    };

    fetchCollection();
  }, [id]);

  if (!collection) return <div className="collection-loading">Loading...</div>;

  return (
    <div className="collection-detail">
      <h1 className="collection-detail-title">{collection.title}</h1>
      {collection.description && (
        <p className="collection-detail-description">
          {collection.description}
        </p>
      )}

      <div className="collection-detail-quotes">
        {collection.quotes.map((q) => (
          <div className="collection-quote-card" key={q.id}>
            <p className="quote-text">"{q.quote}"</p>
            <p className="quote-author">- {q.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CollectionDetail;
