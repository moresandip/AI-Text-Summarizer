import { useState } from 'react';
import axios from 'axios';
import TextInput from './components/TextInput';
import ResultDisplay from './components/ResultDisplay';
import './components/TextInput.css';
import './components/ResultDisplay.css';
import './App.css';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (text) => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await axios.post('/api/summarize', { text });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      const errorMsg =
        err.response?.data?.error ||
        (err.code === 'ERR_NETWORK'
          ? 'Backend unreachable. Make sure the Express server is running on http://localhost:5000.'
          : err.response?.status === 500
            ? 'Backend error (500). Check server logs and GEMINI_API_KEY in server/.env.'
            : `Request failed (${err.response?.status || 'unknown'}).`);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>AI Text Summarizer</h1>
      <TextInput onSubmit={handleSubmit} loading={loading} />
      {error && <div className="error">{error}</div>}
      {result && <ResultDisplay result={result} />}
    </div>
  );
}

export default App;
