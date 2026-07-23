import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import api from "../api";
import AddQuoteForm from "./AddQuoteForm";
import QuoteItem from "./QuoteItem";

const Quotes = ({ searchQuery }) => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotes = useCallback(async (query = "") => {
    try {
      const url = query ? `/quotes/search?q=${query}` : "/quotes/";
      const response = await api.get(url);
      setQuotes(response.data);
    } catch (error) {
      console.error("Error fetching quotes", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchQuotes(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, fetchQuotes]);

  useLayoutEffect(() => {
    if (loading) return;

    const savedScroll = sessionStorage.getItem("explore-scroll");
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll, 10));
      sessionStorage.removeItem("explore-scroll");
    }
  }, [loading]);

  const saveScroll = () => {
    sessionStorage.setItem("explore-scroll", window.scrollY);
  };

  return (
    <div>
      <h2>Quotes List</h2>

      <div className="quote-container">
        {quotes.map((q) => (
          <QuoteItem
            key={q.id}
            quoteItem={q}
            fetchQuotes={() => fetchQuotes(searchQuery)}
            onAuthorClick={saveScroll}
          />
        ))}
      </div>

      <AddQuoteForm
        addQuote={async (data) => {
          await api.post("/quotes/", data);
          fetchQuotes();
        }}
      />
    </div>
  );
};

export default Quotes;
