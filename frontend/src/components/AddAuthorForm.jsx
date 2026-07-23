import { useState } from "react";

const AddAuthorForm = ({ addAuthor }) => {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [bio, setBio] = useState("");
  const [born, setBorn] = useState("");
  const [died, setDied] = useState("");
  const [profession, setProfession] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (name) {
      addAuthor({
        name: name,
        image_url: imageUrl || null,
        bio: bio || null,
        born: born || null,
        died: died || null,
        profession: profession || null,
      });
      setName("");
      setImageUrl("");
      setBio("");
      setBorn("");
      setDied("");
      setProfession("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-author-form">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Author name"
      />
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL"
      />
      <input
        type="text"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Bio"
      />
      <input
        type="text"
        value={born}
        onChange={(e) => setBorn(e.target.value)}
        placeholder="Born (e.g. April 4, 1928)"
      />
      <input
        type="text"
        value={died}
        onChange={(e) => setDied(e.target.value)}
        placeholder="Died (e.g. May 28, 2014)"
      />
      <input
        type="text"
        value={profession}
        onChange={(e) => setProfession(e.target.value)}
        placeholder="Profession"
      />
      <button type="submit">Add Author</button>
    </form>
  );
};

export default AddAuthorForm;
