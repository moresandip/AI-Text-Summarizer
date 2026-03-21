import { useState } from 'react';

function TextInput({ onSubmit, loading }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="input-form">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste unstructured text here..."
        rows={8}
        disabled={loading}
        className="textarea"
      />
      <button type="submit" disabled={!text.trim() || loading} className="submit-btn">
        {loading ? 'Analyzing...' : 'Summarize'}
      </button>
    </form>
  );
}

export default TextInput;
