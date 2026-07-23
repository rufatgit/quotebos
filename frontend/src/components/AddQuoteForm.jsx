import { useState } from "react";

const AddQuoteForm = ({ addQuote }) => {
  const [quote, SetQuote] = useState("");
  const [author, SetAuthor] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (quote && author) {
      addQuote({ quote: quote, author: author });
      SetQuote("");
      SetAuthor("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={quote}
        onChange={(e) => SetQuote(e.target.value)}
        placeholder="Enter quote"
      />
      <input
        type="text"
        value={author}
        onChange={(e) => SetAuthor(e.target.value)}
        placeholder="Enter author"
      />
      <button type="submit">Add Quote</button>
    </form>
  );
};

export default AddQuoteForm;
