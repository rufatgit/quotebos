import { useEffect, useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import "../quoteOfTheDay.css";

function QuoteOfTheDay() {
  const [quote, setQuote] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await api.get("/quotes/quote-of-the-day");
        setQuote(response.data);
      } catch (error) {
        console.error("Error fetching quote of the day", error);
      }
    };

    const fetchHistory = async () => {
      try {
        const response = await api.get(
          "/quotes/quote-of-the-day-history?days=7",
        );
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching quote history", error);
      }
    };

    const loadAll = async () => {
      await Promise.all([fetchQuote(), fetchHistory()]);
      setLoading(false);
    };

    loadAll();
  }, []);

  useLayoutEffect(() => {
    if (loading) return;

    const savedScroll = sessionStorage.getItem("qod-scroll");
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll, 10));
      sessionStorage.removeItem("qod-scroll");
    }
  }, [loading]);

  if (loading || !quote) return <div className="qod-loading">Loading...</div>;

  const saveScroll = () => {
    sessionStorage.setItem("qod-scroll", window.scrollY);
  };

  return (
    <>
      <div className="qod-container">
        <p className="qod-label">Quote of the Day</p>
        <p className="qod-text">"{quote.quote}"</p>
        <p className="qod-author">
          -{" "}
          <Link
            to={`/authors/${quote.author_id}`}
            className="qod-main-author-link"
            onClick={saveScroll}
          >
            {quote.author}
          </Link>
        </p>
      </div>
      <div className="qod-history">
        <h3 className="qod-history-title">Previous Quotes of the Day</h3>
        {history.slice(1).map((item) => (
          <div className="qod-history-item" key={item.date}>
            <span className="qod-history-date">
              {new Date(item.date).toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
            <p className="qod-history-quote">"{item.quote.quote}"</p>
            <p className="qod-history-author">
              -{" "}
              <Link
                to={`/authors/${item.quote.author_id}`}
                className="qod-author-link"
                onClick={saveScroll}
              >
                {item.quote.author}
              </Link>
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export default QuoteOfTheDay;
